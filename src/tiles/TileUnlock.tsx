import { useContext, useState } from 'react'
import { PakmanStateContext, QueryBarContext } from '../Contexts'
import styling from '../lib/styling'
import {  PakmanUnlock } from '../pak/Pakman'
import { SubmitHandler, useForm } from 'react-hook-form'

interface Inputs {
  passphrase: string,
}

export default function TileUnlock() {
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)
  const [ message, setMessage ] = useState('')
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()

  if (pakman.ov != 'pakrypt.pakman_state:loaded') {
    return <></>
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setMessage('')
    const [newPakman, result] = await PakmanUnlock(pakman, data.passphrase)
    if (result.ov == 'pakrypt.pakman_unlock_result:success') {
      setPakman(newPakman)
      setQuery('')
    } else {
      setMessage(result.ov)
    }
  }
  
  return <div className={styling.tile.tileComponentCommand}>
    <form className="flex flex-col gap-2" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <input type="password" className={styling.input.formInput + ' w-100'} {...register('passphrase', {
          required: true,
      })} />
      <button className={styling.button.formButton} type="submit">Unlock</button>
    </form>
    <div>
      {message}
    </div>
  </div>
}
