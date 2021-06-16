<script lang="ts">
  import minimist from 'minimist'
  import apps from '../../apps'
  import fs from '../../fs'
  import Window from '../../components/Window.svelte'
  import path from '@jkearl/lightning-fs/src/path'
  import http from 'isomorphic-git/http/web/index.js'
  import { tick } from 'svelte'
  import { author, sessions } from '../../stores'
  import { nanoid } from '../../util'

  export let tab = {
    messages: [],
    directory: '/',
    command: '',
    needsauth: false
  }

  let text: HTMLInputElement
  let form: HTMLFormElement
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
        tab.needsauth = true
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
      tab.needsauth = true
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
      tab.needsauth = false
      localStorage.setItem('git_user', auth.username)
      localStorage.setItem('git_password', auth.password)
    }
  }
  const clear = () => void (tab.messages = [])
  const del = async (args: string[]) => {
    const stat = await fs.promises.stat(`${tab.directory}/${args.join(' ')}`)
    if (stat.type === 'file') {
      return await fs.promises.unlink(`${tab.directory}/${args.join(' ')}`)
    }
  }
  function kill(args: string[]) {
    const [app] = apps.filter((app) =>
      app.name.toLowerCase().includes(args.join(' ').toLowerCase())
    )
    const apps_killed = $sessions.filter((session) => session.app === app)
      .length
    if (app) {
      $sessions = $sessions.filter((session) => session.app !== app)
      tab.messages = [
        ...tab.messages,
        `Killed ${apps_killed} session${apps_killed === 1 ? '' : 's'} of ${
          app.name
        }`
      ]
    } else {
      tab.messages = [...tab.messages, `Couldn't find that app.`]
    }
  }
  const resolve = (dir?: string) =>
    dir
      ? dir.startsWith('/')
        ? dir
        : path.resolve(tab.directory, dir)
      : tab.directory
  const commands: {
    [key: string]: (
      args: string[]
    ) => string | Promise<string> | void | Promise<void>
  } = {
    close,
    clear,
    del,
    kill,
    cls: clear,
    clr: clear,
    unlink: del,
    delete: del,
    remove: del,
    rm: del,
    taskkill: kill,
    taskill: kill,
    touch: (args) =>
      fs.promises.writeFile(`${tab.directory}/${args.join('')}`, '', 'utf8'),
    mkdir: (args) => fs.promises.mkdir(resolve(args.join(' '))),
    ls: async (args) =>
      (await fs.promises.readdir(resolve(args.join(' ')))).join('\n'),
    async git(args: string[]) {
      const { default: git } = await import('isomorphic-git')
      console.log(git)
      async function isogit({ _: [command], ...opts }: minimist.ParsedArgs) {
        try {
          const result = await git[command](
            Object.assign(
              {
                fs,
                dir: tab.directory,
                http,
                onMessage: (str: string) =>
                  (tab.messages = [...tab.messages, str]),
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
        tab.directory = dir
      }
    },
    async overwrite(args) {
      const [name, ...content] = args
      const stat = await fs.promises.stat(`${tab.directory}/${name}`)
      if (stat.type === 'file') {
        await fs.promises.writeFile(
          `${tab.directory}/${name}`,
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
      $sessions = [
        ...$sessions,
        {
          id: nanoid(),
          app: apps.find((app) => app.name === 'File Explorer'),
          minimized: false,
          props: {
            startingdir: resolve(args.join(' '))
          }
        }
      ]
    }
  }

  async function run() {
    tab.messages = [...tab.messages, `${tab.directory} >${tab.command}`]
    const [cmd, ...args] = tab.command.split(' ') || []
    tab.command = ''
    if (commands[cmd]) {
      const output = await commands[cmd](args)
      if (output) {
        tab.messages = [...tab.messages, output]
      }
    }
  }
</script>

{#each tab?.messages ?? [] as message, index}
  <code>{index === 0 || !message ? '' : '\n'}{message}</code>
{/each}
<form on:submit|preventDefault={run} class="input">
  <label for="terminal">{tab.directory} &gt;</label><input
    name="terminal"
    type="text"
    bind:this={text}
    placeholder="# mollerscript moment"
    bind:value={tab.command}
  />
</form>
{#if tab.needsauth}
  <Window
    x={window.innerWidth - 500}
    session={{
      app: {
        component: Window,
        icon:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Git_icon.svg/1024px-Git_icon.svg.png',
        name: 'Git Auth'
      },
      id: nanoid(),
      minimized: false
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
  .input {
    display: flex;
  }
  label,
  code {
    font-family: 'Cascadia Code', 'Consolas', monospace;
    white-space: pre;
    color: white;
    font-size: 13px;
  }
  main > form input {
    width: 100%;
  }
  input {
    padding: 0;
    margin: 0;
    font-size: 13px;
    background: transparent;
    color: white;
    border: 0;
    font-family: 'Cascadia Code', 'Consolas', monospace;
  }
  @media (prefers-color-scheme: light) {
    input,
    label,
    code {
      color: black;
    }
  }
</style>
