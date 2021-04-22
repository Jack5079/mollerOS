<script lang="ts">
  import fs from '../../fs'
  import { author } from '../../stores'
  export let dir: string = '/'
  export let gitdir: string = '/'

  const FILE = 0,
    WORKDIR = 2,
    STAGE = 3

  let filenames = import('isomorphic-git/index.umd.min.js')
    .then(({ statusMatrix }) =>
      statusMatrix({
        dir: gitdir.replace('/.git', ''),
        gitdir,
        fs
      })
    )
    .then((files) =>
      files.filter((row) => row[WORKDIR] !== row[STAGE]).map((row) => row[FILE])
    )
  async function stage() {
    const repo = {
      dir: gitdir.replace('/.git', ''),
      gitdir,
      fs
    }
    const { statusMatrix, add, remove } = await import(
      'isomorphic-git/index.umd.min.js'
    )

    await statusMatrix(repo).then((status) =>
      Promise.all(
        status.map(([filepath, , worktreeStatus]) =>
          worktreeStatus
            ? add({ ...repo, filepath })
            : remove({ ...repo, filepath })
        )
      )
    )
    filenames = Promise.resolve([])
  }
  let message: string = ''
  let commiting: boolean = false
  async function submit() {
    const { commit } = await import('isomorphic-git/index.umd.min.js')
    commiting = true
    await commit({
      fs,
      gitdir,
      message,
      author: $author
    })
    message = ''
    commiting = false
  }
</script>

<nav>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    ><path
      fill-rule="evenodd"
      d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"
    /></svg
  >{#await import('isomorphic-git/index.umd.min.js').then((git) =>
    git.currentBranch({ fs, dir, gitdir, test: true })
  ) then branch}{branch || '?'}{/await}
  {#await import('isomorphic-git/index.umd.min.js').then((git) =>
    git.listRemotes({ fs, dir, gitdir })
  ) then [remote]}
    {#if remote}
      <a
        title="clone {remote.remote} in vscode"
        href="vscode://vscode.git/clone?url={encodeURIComponent(remote.url)}"
        ><svg
          role="img"
          viewBox="0 0 24 24"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
          /></svg
        ></a
      >
    {/if}
  {/await}
  {#await filenames then unstages}
    <button on:click={stage} title="Click here to stage all changes"
      ><span>{unstages.length} files unstaged</span></button
    >
    {#if !unstages.length}
      <form on:submit|preventDefault={submit}>
        <input
          type="text"
          disabled={commiting}
          placeholder="Commit message here..."
          bind:value={message}
        />
      </form>
    {/if}
  {/await}
</nav>

<style>
  a,
  button,
  nav {
    color: white;
  }
  svg {
    fill: white;
    stroke: transparent;
  }
  nav {
    background: blueviolet;
  }
  form,
  button {
    display: contents;
  }
  button {
    cursor: pointer;
  }
  button span {
    text-decoration: underline;
  }
</style>
