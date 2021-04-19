<script lang="ts">
  import minimist from 'minimist'
  import apps from '../apps'
  import fs from '../fs'
  import Window from '../components/Window.svelte'
  import path from '@jkearl/lightning-fs/src/path'

  import { tick } from 'svelte'
  import { author, open_apps } from '../stores'
  import { nanoid, close as stop } from '../util'

  export let session: string
  let text: HTMLInputElement
  let command: string
  let needsauth = false
  let form: HTMLFormElement
  let messages = []
  let directory = '/'

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
  const clear = () => void (messages = [])
  const del = async (args: string[]) => {
    const stat = await fs.promises.stat(`${directory}/${args.join(' ')}`)
    if (stat.type === 'file') {
      return await fs.promises.unlink(`${directory}/${args.join(' ')}`)
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
      messages = [
        ...messages,
        `Killed ${apps_killed} session${apps_killed === 1 ? '' : 's'} of ${
          app.name
        }`
      ]
    } else {
      messages = [...messages, `Couldn't find that app.`]
    }
  }
  const resolve = (dir?: string) =>
    dir ? (dir.startsWith('/') ? dir : path.resolve(directory, dir)) : directory
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
      fs.promises.writeFile(`${directory}/${args.join('')}`, '', 'utf8'),
    mkdir: (args) => fs.promises.mkdir(resolve(args.join(' '))),
    ls: async (args) =>
      (await fs.promises.readdir(resolve(args.join(' ')))).join('\n'),
    git(args: string[]) {
      async function isogit({ _: [command], ...opts }: minimist.ParsedArgs) {
        try {
          const result = await git[command](
            Object.assign(
              {
                fs,
                dir: directory,
                http,
                onMessage: (str: string)=>(messages = [...messages, str]),
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
        directory = dir
      }
    },
    async overwrite(args) {
      const [name, ...content] = args
      const stat = await fs.promises.stat(`${directory}/${name}`)
      if (stat.type === 'file') {
        await fs.promises.writeFile(
          `${directory}/${name}`,
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
    messages = [...messages, `${directory}>${command}`]
    const [cmd, ...args] = command.split(' ')
    command = ''
    if (commands[cmd]) {
      const output = await commands[cmd](args)
      if (output) {
        messages = [...messages, output]
      }
    }
  }
</script>

<main on:click={focus}>
  {#each messages as message, index}
    <code>{index === 0 || !message ? '' : '\n'}{message}</code>
  {/each}
  <form on:submit|preventDefault={run}>
    <label for="terminal">{directory}&gt;</label><input
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
  code {
    white-space: pre-wrap;
  }
  main form {
    display: flex;
  }
  label {
    font-family: 'Cascadia Mono', 'Consolas', monospace;
    white-space: pre;
    font-size: 13px;
  }
  main input {
    width: 100%;
    padding: 0;
    margin: 0;
    font-size: 13px;
    background: transparent;
    color: white;
    border: 0;
    font-family: 'Cascadia Code', monospace;
  }
  main {
    font-family: 'Cascadia Code', monospace;
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
  }
</style>
