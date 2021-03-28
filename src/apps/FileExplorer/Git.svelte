<script lang="ts">
  export let directory: string
  import fs from '../../fs'
  git.statusMatrix({
    dir: directory,
    fs,
    filter: () => true
  }).then(console.log)
</script>

<aside>
<input type="text" placeholder="commit message here...">
<ul>
  
</ul>
</aside>

<style>
  aside {
    width: 147px;
    min-height: 100%;
    display: inline-block;
  }
</style>
