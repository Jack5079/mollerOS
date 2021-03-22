<script lang="ts">
  let text: HTMLInputElement;
  let command: string;
  import minimist from "minimist";
  import { tick } from "svelte";
  import apps from "../apps";
  import fs from "../fs";
  import { open_apps } from "../stores";
  import Window from "../Window.svelte";
  let needsauth = false;
  let form: HTMLFormElement;
  let username: string;
  let password: string;
  let messages = [];
  let directory = "/";
  const nanoid = (t = 21) => {
    let e = "",
      r = crypto.getRandomValues(new Uint8Array(t));
    for (; t--; ) {
      let n = 63 & r[t];
      e +=
        n < 36
          ? n.toString(36)
          : n < 62
          ? (n - 26).toString(36).toUpperCase()
          : n < 63
          ? "_"
          : "-";
    }
    return e;
  };
  function gitcommand(args: string[]) {
    async function isogit({ _: [command], ...opts }: minimist.ParsedArgs) {
      try {
        const result = await git[command](
          Object.assign(
            {
              fs,
              dir: directory,
              http,
              corsProxy: "https://cors.isomorphic-git.org",
              onAuth: () => {
                needsauth = true;
                return new Promise(async (resolve) => {
                  await tick();
                  form.addEventListener(
                    "submit",
                    (
                      event: Event & {
                        currentTarget: EventTarget & HTMLFormElement;
                      }
                    ) => {
                      needsauth = false;
                      resolve({
                        username: (event.currentTarget.querySelector(
                          'input[type="text"]'
                        ) as HTMLInputElement).value,
                        password: (event.currentTarget.querySelector(
                          'input[type="password"]'
                        ) as HTMLInputElement).value,
                      });
                    }
                  );
                });
              },
              headers: {
                "User-Agent": `git/mollerOS/isogit-${git.version()}`,
              },
            },
            opts
          )
        );
        if (result === undefined) return;
        // detect streams
        if (typeof result.on === "function") {
          console.log(result);
        } else {
          messages = [...messages, JSON.stringify(result, null, 2)];
        }
      } catch (err) {
        console.error(err);
        messages = [...messages, err.message];
      }
    }
    const parsed = minimist(args);
    isogit(parsed);
  }
  function focus() {
    text.focus();
  }
  async function run() {
    const [cmd, ...args] = command.split(" ");
    if (cmd === "git") {
      gitcommand(args);
    }
    if (cmd === "mkdir") {
      fs.promises.mkdir(args.join(" "));
    }
    if (cmd === "ls") {
      messages = [
        ...messages,
        (await fs.promises.readdir(directory)).join("\n"),
      ];
    }
    if (cmd === "cd") {
      try {
        if (args.join(" ") === "/") {
          directory = "/";
          return;
        }
        const stat = await fs.promises.stat(
          directory + `${directory === "/" ? "" : "/"}${args.join(" ")}`
        );
        if (stat.type === "dir") {
          if (directory === "/") {
            directory += args.join(" ");
          } else {
            directory += `/${args.join(" ")}`;
          }
        }
      } catch (err) {
        messages = [...messages, err + ""];
      }
    }
    if (cmd === "overwrite") {
      const [name, ...content] = args
      const stat = await fs.promises.stat(`${directory}/${name}`);
      if (stat.type === "file") {
        messages = [
          ...messages,
          await fs.promises.writeFile(
            `${directory}/${name}`,
            content.join(' '),
            "utf8"
          ),
        ];
      } else {
        messages = [...messages, "That's a folder retard"];
      }
    }
    if (
      cmd === "rm" ||
      cmd === "remove" ||
      cmd === "delete" ||
      cmd === "unlink"
    ) {
      const stat = await fs.promises.stat(`${directory}/${args.join(" ")}`);
      if (stat.type === "file") {
        await fs.promises.unlink(`${directory}/${args.join(" ")}`);
      }
    }
    if (cmd === "open") {
      const app_name = args.join(" ");
      const app = apps.find(
        (app) =>
          app.name.toUpperCase() === app_name.toUpperCase() ||
          app.name.toUpperCase().includes(app_name.toUpperCase())
      );
      if (!app) {
        messages = [...messages, "App not found!"];
      } else {
        $open_apps = [
          ...$open_apps,
          {
            id: nanoid(),
            app: app,
          },
        ];
      }
    }
    if (cmd === "cat") {
      try {
        const stat = await fs.promises.stat(`${directory}/${args.join(" ")}`);
        if (stat.type === "file") {
          messages = [
            ...messages,
            await fs.promises.readFile(
              `${directory}/${args.join(" ")}`,
              "utf8"
            ),
          ];
        } else {
          messages = [...messages, "That's a folder retard"];
        }
      } catch (err) {
        messages = [...messages, err + ""];
      }
    }
    if (cmd === "cls" || cmd === "clear") {
      messages = [];
    }
  }
</script>

<main on:click={focus}>
  {#each messages as message}
    <pre>{message}</pre>
  {/each}
  <form on:submit|preventDefault={run}>
    <label for="terminal">{directory}&gt;</label><input
      name="terminal"
      type="text"
      bind:this={text}
      placeholder="git clone..."
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
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Git_icon.svg/1024px-Git_icon.svg.png",
        name: "Git Auth",
      },
      id: nanoid(),
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
  main form {
    display: flex;
  }
  label {
    font-family: "Cascadia Mono", "Consolas", monospace;
    white-space: pre;
  }
  main input {
    width: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    color: white;
    border: 0;
    font-family: "Cascadia Code", monospace;
  }
  main {
    font-family: "Cascadia Code", monospace;
    width: 100%;
    background: black;
    color: white;
  }
</style>
