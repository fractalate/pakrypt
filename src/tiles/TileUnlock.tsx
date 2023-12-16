import { useContext } from 'react'
import { PakmanStateContext } from '../Contexts'
import styling from '../lib/styling'
import {  PakmanUnlock } from '../pak/Pakman'
import { SubmitHandler, useForm } from 'react-hook-form'

interface Inputs {
  passphrase: string,
}

export default function TileUnlock() {
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()

  if (pakman.ov != 'pakrypt.pakmanstate:loaded') {
    return <></>
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // TODO: Do someting if the passphrase is bad. See the 2nd item of the returned array.
    const [newPakman] = await PakmanUnlock(pakman, data.passphrase)
    setPakman(newPakman)
  }
  
  return <div className={styling.tile.tileComponentCommand}>
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <input type="password" className={styling.input.formInput} {...register('passphrase', {
          required: true,
      })} />
      <button className={styling.button.formButton} type="submit">Unlock</button>
    </form>
  </div>
}
