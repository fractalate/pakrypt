import { useContext, useState } from 'react'
import styling from '../lib/styling'
import { PakmanStateContext } from '../Contexts'
import { PakmanUpdateLocalOptions } from '../pak/Pakman'

export default function TileDebug() {
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const [message, setMessage] = useState('')

  if (pakman.ov !== 'pakrypt.pakman_state:unlocked') {
    return <></>
  }

  const addLocals = async () => {
    const [newPakman, result] = await PakmanUpdateLocalOptions(pakman, {
      ov: 'pakrypt.pakman_local_options:1.0',
      pakmanStore: {
        ov: 'pakrypt.pakman_local_options.pakman_store:1.0',
        url: 'https://santasworkshop.com/',
        key: 'asdf',
      },
    })
    console.log('here I am')
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(newPakman)
    } else {
      setMessage(result.ov)
    }
  }

  const removeLocals = async () => {
    const [newPakman, result] = await PakmanUpdateLocalOptions(pakman, null)
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(newPakman)
    } else {
      setMessage(result.ov)
    }
  }

  return <div className={styling.tile.tileComponentCommand + ' flex flex-col'}>
    <button className={styling.button.formButton} onClick={() => addLocals()}>Adds Locals</button>
    <button className={styling.button.formButton} onClick={() => removeLocals()}>Remove Locals</button>
    <br/>
    {message}
  </div>
}
