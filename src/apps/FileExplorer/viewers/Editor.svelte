<script lang="ts">
  export let file: string
  import fs from '../../../fs'
  import { editor, languages } from 'monaco-editor'
  import { onMount } from 'svelte'
  import path from '@jkearl/lightning-fs/src/path'
  let div: HTMLDivElement

  export const languageOf = (filename: string) =>
    languages
      .getLanguages()
      .find(
        (lanugage) =>
          lanugage.filenames?.some((fname) => fname === filename) ||
          lanugage.extensions?.some((ext) => filename.endsWith(ext))
      )?.id || 'plaintext'

  onMount(async () => {
    const value = await fs.promises.readFile(file, {
      encoding: 'utf8'
    })
    const monaco = editor.create(div, {
      automaticLayout: true,
      value: (value as unknown) as string,
      theme: matchMedia('(prefers-color-scheme: light)').matches
        ? 'vs'
        : 'vs-dark'
    })
    monaco.onDidChangeModelContent(() => {
      fs.promises.writeFile(file, monaco.getValue())
    })
    editor.setModelLanguage(monaco.getModel(), languageOf(path.basename(file)))
    // make it actually fucking save when you change it
    return monaco.dispose.bind(monaco)
  })
</script>

<div bind:this={div} />

<style>
  div {
    width: 100%;
    border: 0;
    background: black;
    color: white;
    overflow: hidden;
  }
  @media (prefers-color-scheme: light) {
    div {
      background: white;
      color: black;
    }
  }
</style>
