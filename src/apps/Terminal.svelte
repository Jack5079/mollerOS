<script lang="ts">
  import minimist from 'minimist'
  import apps from '../apps'
  import fs from '../fs'
  import Window from '../components/Window.svelte'
  import path from '@jkearl/lightning-fs/src/path'
  import http from 'isomorphic-git/http/web/index.js'
  import { tick } from 'svelte'
  import { author, open_apps } from '../stores'
  import { nanoid, close as stop } from '../util'
  import { fly } from 'svelte/transition'

  export let startingdirectory = '/'
  export let session: string
  let text: HTMLInputElement
  let command: string
  let needsauth = false
  let form: HTMLFormElement
  let tab = 0
  let tabs = [
    {
      messages: [],
      directory: startingdirectory
    }
  ]
  $: tab > tabs.length - 1 && (tab = tabs.length - 1)
  $: tabs.length === 0 && stop(session)
  // //====================================================\\
  //                    COMMANDS
  // \\====================================================//
  /**
   * git settings
   * pretty stupid but uh i guess it works
   */
  const gitauth = {
    onAuth: () => {
      if (localStorage.getItem('git_user')) {
        return {
          username: localStorage.getItem('git_user'),
          password: localStorage.getItem('git_pass')
        }
      }
      return new Promise(async (resolve) => {
        needsauth = true
        await tick()
        form.addEventListener(
          'submit',
          (
            event: Event & {
              currentTarget: EventTarget & HTMLFormElement
            }
          ) => {
            resolve({
              username: (event.currentTarget.querySelector(
                'input[type="text"]'
              ) as HTMLInputElement).value,
              password: (event.currentTarget.querySelector(
                'input[type="password"]'
              ) as HTMLInputElement).value
            })
          },
          {
            once: true
          }
        )
      })
    },
    onAuthFailure: async () => {
      needsauth = true
      await tick()
      return new Promise(async (resolve) => {
        form.addEventListener(
          'submit',
          (
            event: Event & {
              currentTarget: EventTarget & HTMLFormElement
            }
          ) => {
            resolve({
              username: (event.currentTarget.querySelector(
                'input[type="text"]'
              ) as HTMLInputElement).value,
              password: (event.currentTarget.querySelector(
                'input[type="password"]'
              ) as HTMLInputElement).value
            })
          },
          {
            once: true
          }
        )
      })
    },
    onAuthSuccess: (
      _url: string,
      auth: { username: string; password: string }
    ) => {
      needsauth = false
      localStorage.setItem('git_user', auth.username)
      localStorage.setItem('git_password', auth.password)
    }
  }
  const close = stop.bind(undefined, session)
  const clear = () => void (tabs[tab].messages = [])
  const del = async (args: string[]) => {
    const stat = await fs.promises.stat(`${tabs[tab].directory}/${args.join(' ')}`)
    if (stat.type === 'file') {
      return await fs.promises.unlink(`${tabs[tab].directory}/${args.join(' ')}`)
    }
  }
  function kill(args: string[]) {
    const [app] = apps.filter((app) =>
      app.name.toLowerCase().includes(args.join(' ').toLowerCase())
    )
    const apps_killed = $open_apps.filter((session) => session.app === app)
      .length
    if (app) {
      $open_apps = $open_apps.filter((session) => session.app !== app)
      tabs[tab].messages = [
        ...tabs[tab].messages,
        `Killed ${apps_killed} session${apps_killed === 1 ? '' : 's'} of ${
          app.name
        }`
      ]
    } else {
      tabs[tab].messages = [...tabs[tab].messages, `Couldn't find that app.`]
    }
  }
  const resolve = (dir?: string) =>
    dir ? (dir.startsWith('/') ? dir : path.resolve(tabs[tab].directory, dir)) : tabs[tab].directory
  const commands: {
    [key: string]: (
      args: string[]
    ) => string | Promise<string> | void | Promise<void>
  } = {
    close,
    clear,
    del,
    kill,
    exit: close,
    stop: close,
    cls: clear,
    clr: clear,
    unlink: del,
    delete: del,
    remove: del,
    rm: del,
    taskkill: kill,
    taskill: kill,
    touch: (args) =>
      fs.promises.writeFile(`${tabs[tab].directory}/${args.join('')}`, '', 'utf8'),
    mkdir: (args) => fs.promises.mkdir(resolve(args.join(' '))),
    ls: async (args) =>
      (await fs.promises.readdir(resolve(args.join(' ')))).join('\n'),
    async git(args: string[]) {
      const git = await import('isomorphic-git/index.umd.min.js')
      async function isogit({ _: [command], ...opts }: minimist.ParsedArgs) {
        try {
          const result = await git[command](
            Object.assign(
              {
                fs,
                dir: tabs[tab].directory,
                http,
                onMessage: (str: string) =>
                  (tabs[tab].messages = [...tabs[tab].messages, str]),
                corsProxy: 'https://cors.isomorphic-git.org',
                headers: {
                  'User-Agent': `git/mollerOS/isogit-${git.version()}`
                },
                author: $author
              },
              opts,
              gitauth,
              {
                dir: resolve(opts.dir)
              }
            )
          )
          if (result === undefined) return
          // detect streams
          if (typeof result.on === 'function') {
            console.log(result)
          } else {
            return JSON.stringify(result, null, 2)
          }
        } catch (err) {
          return err.toString()
        }
      }
      const parsed = minimist(args)
      return isogit(parsed)
    },
    async cd(args) {
      const dir = resolve(args.join(' '))
      const stat = await fs.promises.stat(dir)
      if (stat.type === 'dir') {
        tabs[tab].directory = dir
      }
    },
    async overwrite(args) {
      const [name, ...content] = args
      const stat = await fs.promises.stat(`${tabs[tab].directory}/${name}`)
      if (stat.type === 'file') {
        await fs.promises.writeFile(
          `${tabs[tab].directory}/${name}`,
          content.join(' '),
          'utf8'
        )
        return ''
      } else {
        return "That's a folder retard"
      }
    },
    async cat(args) {
      try {
        const stat = await fs.promises.stat(resolve(args.join(' ')))
        if (stat.type === 'file') {
          return (fs.promises.readFile(
            resolve(args.join(' ')),
            'utf8'
          ) as Promise<unknown>) as Promise<string>
        } else {
          return "That's a folder retard"
        }
      } catch (err) {
        return err + ''
      }
    },
    explorer: (args) => {
      $open_apps = [
        ...$open_apps,
        {
          id: nanoid(),
          app: apps.find((app) => app.name === 'File Explorer'),
          props: {
            startingdir: resolve(args.join(' '))
          }
        }
      ]
    }
  }

  function focus() {
    text.focus()
  }
  async function run() {
    tabs[tab].messages = [...tabs[tab].messages, `${tabs[tab].directory}>${command}`]
    const [cmd, ...args] = command.split(' ')
    command = ''
    if (commands[cmd]) {
      const output = await commands[cmd](args)
      if (output) {
        tabs[tab].messages = [...tabs[tab].messages, output]
      }
    }
  }
</script>

<main on:click|self={focus}>
  <nav>
    {#each tabs as tabb, i}
      <article
        on:click={() => (tab = i)}
        class:active={i === tab}
        transition:fly={{ y: -50 }}
      >
        <input type="text" placeholder="New Tab" /><button
          on:click={() => (tabs = tabs.filter((tab) => tab !== tabb))}
          >🗙︎</button
        >
      </article>
    {/each}
    <button
      on:click={() =>
        (tabs = [
          ...tabs,
          {
            messages: [],
            directory: tabs[tab].directory
          }
        ])}>+</button
    >
  </nav>
  {#each tabs[tab]?.messages ?? [] as message, index}
    <code>{index === 0 || !message ? '' : '\n'}{message}</code>
  {/each}
  <form on:submit|preventDefault={run}>
    <label for="terminal">{tabs[tab].directory} &gt;</label><input
      name="terminal"
      type="text"
      bind:this={text}
      placeholder="# mollerscript moment"
      bind:value={command}
    />
  </form>
</main>
{#if needsauth}
  <Window
    x={window.innerWidth - 500}
    session={{
      app: {
        component: Window,
        icon:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Git_icon.svg/1024px-Git_icon.svg.png',
        name: 'Git Auth'
      },
      id: nanoid()
    }}
  >
    <form bind:this={form} on:submit|preventDefault>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Passsword" />
      <input type="submit" value="Login" />
    </form>
  </Window>
{/if}

<style>
  .active {
    border: solid 1px blue;
  }
  nav button {
    padding: 0;
    background: none;
    border: 0;
    padding-left: 1em;
    padding-right: 0.1em;
    color: white;
  }
  nav article {
    display: flex;
    justify-content: center;
    align-items: center;
    display: inline-block;
    background: rgba(255, 255, 255, 0.3);
  }
  code {
    white-space: pre-wrap;
  }
  main form {
    display: flex;
  }
  label {
    font-family: 'Cascadia Code', 'Consolas', monospace;
    white-space: pre;
    font-size: 13px;
  }
  main > form input {
    width: 100%;
  }
  nav input {
    width: max-content;
  }
  main input {
    padding: 0;
    margin: 0;
    font-size: 13px;
    background: transparent;
    color: white;
    border: 0;
    font-family: 'Cascadia Code', 'Consolas',monospace;
  }
  main {
    font-family: 'Cascadia Code', 'Consolas', monospace;
    width: 100%;
    background: black;
    color: white;
  }
  @media (prefers-color-scheme: light) {
    main,
    main input {
      color: black;
    }
    main {
      background: white;
    }
    nav button {
      color: black;
    }
    nav article {
      display: inline-block;
      background: rgba(0, 0, 0, 0.1);
    }
  }
</style>
