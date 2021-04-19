import LightningFS from '@jkearl/lightning-fs'
const lfs = new LightningFS(localStorage.getItem('drive') || 'mollerOS')

export default lfs
