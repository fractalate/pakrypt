import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import styling from '../lib/styling'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PakmanChangePassphrase } from '../pak/Pakman'
import PageNotUnlocked from './PageErrorNotUnlocked'
import behavior from '../lib/behavior'
import { toUserMessage } from '../pak/Text'

interface Inputs {
  passphrase: string,
  passphrase2: string,
}

export default function PageChangePassphrase() {
  const { popPage } = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const [ message, setMessage ] = useState('')
  const { setQuery } = useContext(QueryBarContext)
  const [passwordType, setPasswordType] = useState('password' as 'password' | 'text')

  const togglePasswordVisible = () => {
    if (passwordType === 'password') {
      setPasswordType('text')
    } else if (passwordType === 'text') {
      setPasswordType('password')
    }
  }

  const {
    handleSubmit,
    register,
    watch,
  } = useForm<Inputs>()

  // XXX: Find some other way to detect when the field changes. onChange maybe?
  const [opassphrase, setOpassphrase] = useState('')
  const passphrase = watch('passphrase')
  const [opassphrase2, setOpassphrase2] = useState('')
  const passphrase2 = watch('passphrase2')

  if (message && passphrase != opassphrase) {
    setMessage('')
  }
  if (message && passphrase2 != opassphrase2) {
    setMessage('')
  }

  if (pakman.ov !== 'pakrypt.pakman_state:unlocked') {
    return <PageNotUnlocked />
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.passphrase !== data.passphrase2) {
      setMessage('Passphrases do not match! Try again.')
      setOpassphrase(data.passphrase)
      setOpassphrase2(data.passphrase2)
      return
    }

    const [newPakman, result] = await PakmanChangePassphrase(pakman, data.passphrase)

    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(newPakman)
      setQuery('')
      popPage()
    } else {
      // To get error messages to persist, I have to set opassphrase and opassphrase2.
      setMessage(toUserMessage(result))
      setOpassphrase(data.passphrase)
      setOpassphrase2(data.passphrase2)
    }
  }

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => popPage()}>Cancel</button>
    <div>Please give a new passphrase for this pak.</div>
    <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="passphrase">New Passphrase</label>
        <div className="flex flex-row relative">
          <input type={passwordType} className={styling.input.formInput + ' pr-8 w-full'} {...behavior.input.sensitiveData} {...register('passphrase', {
              required: true,
          })} />
          <button type="button" className={styling.button.formButton + ' absolute right-0'} onClick={(e) => {
            e.preventDefault()
            togglePasswordVisible()
          }}>👁️</button>
        </div>
        <label htmlFor="passphrase">Passphrase Confirm</label>
        <div className="flex flex-row relative">
          <input type={passwordType} className={styling.input.formInput + ' pr-8 w-full'} {...behavior.input.sensitiveData} {...register('passphrase2', {
              required: true,
          })} />
          <button type="button" className={styling.button.formButton + ' absolute right-0'} onClick={(e) => {
            e.preventDefault()
            togglePasswordVisible()
          }}>👁️</button>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <button className={styling.button.formButton + ' w-1/2'} type="submit">Change Passphrase</button>
        <button className={styling.button.formButton + ' w-1/2'} onClick={() => popPage()}>Cancel</button>
      </div>
    </form>
    <div>
      { message }
    </div>
  </div>
}
