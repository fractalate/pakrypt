import { useContext, useState } from 'react'
import { PakmanStateContext, QueryBarContext } from '../Contexts'
import styling from '../lib/styling'
import {  PakmanUnlock } from '../pak/Pakman'
import { SubmitHandler, useForm } from 'react-hook-form'
import behavior from '../lib/behavior'
import { toUserMessage } from '../pak/Text'

interface Inputs {
  passphrase: string,
}

export default function TileUnlock() {
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)
  const [ message, setMessage ] = useState('')
  const [passwordType, setPasswordType] = useState('password' as 'password' | 'text')

  const togglePasswordVisible = () => {
    if (passwordType === 'password') {
      setPasswordType('text')
    } else if (passwordType === 'text') {
      setPasswordType('password')
    }
  }

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
      setMessage(toUserMessage(result))
    }
  }

  return <div className={styling.tile.tileComponentCommand}>
    <form className="flex flex-col gap-2" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flew-row relative">
        <input type={passwordType} className={styling.input.formInput + ' pr-8 w-full'} {...behavior.input.sensitiveData} {...register('passphrase', {
            required: true,
        })} />
        <button type="button" className={styling.button.formButton + ' absolute right-0 '} onClick={(e) => {
          e.preventDefault()
          togglePasswordVisible()
        }}>👁️</button>
      </div>
      <button className={styling.button.formButton} type="submit">Unlock</button>
    </form>
    <div>
      {message}
    </div>
  </div>
}
