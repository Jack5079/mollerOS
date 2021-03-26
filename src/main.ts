import mollerOS from './mollerOS.svelte';
if (document.body) document.body.remove()
const app = new mollerOS({
	target: document.documentElement,
	// intro: true
});

console.log(`%c    mollerOS${location.hostname === 'localhost' ? ' dev' : ''}`, 'background: url(https://5079.ml/5079mlicon.svg); background-repeat: no-repeat; background-size: contain; font-size: 50px; font-family: "Inter", sans-serif;');

export default app;
