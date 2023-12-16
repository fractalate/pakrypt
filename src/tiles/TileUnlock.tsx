import { useContext, useState } from 'react'
import { PakmanStateContext } from '../Contexts'
import styling from '../lib/styling'
import {  PakmanUnlock } from '../pak/Pakman'
import { SubmitHandler, useForm } from 'react-hook-form'

interface Inputs {
  passphrase: string,
}

export default function TileUnlock() {
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const [ message, setMessage ] = useState('')
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()

  if (pakman.ov != 'pakrypt.pakmanstate:loaded') {
    return <></>
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setMessage('')
    const [newPakman, result] = await PakmanUnlock(pakman, data.passphrase)
    setPakman(newPakman)
    if (result.ov != 'pakrypt.pakmanunlockresult:success') {
      setMessage(result.ov)
    }
  }
  
  return <div className={styling.tile.tileComponentCommand}>
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <input type="password" className={styling.input.formInput} {...register('passphrase', {
          required: true,
      })} />
      <button className={styling.button.formButton} type="submit">Unlock</button>
    </form>
    <div>
      {message}
    </div>
  </div>
}
