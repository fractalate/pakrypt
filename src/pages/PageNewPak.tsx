import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ListPaks, PakmanNew } from '../pak/Pakman'
import styling from '../lib/styling'
import behavior from '../lib/behavior'
import { toUserMessage } from '../pak/Text'

interface Inputs {
  name: string,
  passphrase: string,
  passphrase2: string,
}

export default function PageNewPak() {
  const { popPage } = useContext(PageContext)
  const { setPakman } = useContext(PakmanStateContext)
  const [ message, setMessage ] = useState('')
  const { setQuery } = useContext(QueryBarContext)
  const [passwordType, setPasswordType] = useState('password' as 'password' | 'text')

  const {
    handleSubmit,
    register,
    watch,
  } = useForm<Inputs>()

  const togglePasswordVisible = () => {
    if (passwordType === 'password') {
      setPasswordType('text')
    } else if (passwordType === 'text') {
      setPasswordType('password')
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.passphrase !== data.passphrase2) {
      setMessage('Passphrases do not match! Try again.')
      setOpassphrase(data.passphrase)
      setOpassphrase2(data.passphrase2)
      return
    } else if (ListPaks().indexOf(data.name) >= 0) {
      setMessage('A pak with the name "' + data.name + '" already exists.')
      setOpassphrase(data.passphrase) // These need to be set so the message shows.
      setOpassphrase2(data.passphrase2) // These need to be set so the message shows.
      return
    }

    const [newPakman, result] = await PakmanNew(data.name, data.passphrase)
    if (result.ov === 'pakrypt.pakman_new_result:success') {
      setPakman(newPakman)
      setQuery('')
      popPage()
    } else {
      setMessage(toUserMessage(result))
      setOpassphrase(data.passphrase) // These need to be set so the message shows.
      setOpassphrase2(data.passphrase2) // These need to be set so the message shows.
    }
}

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

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => popPage()}>Cancel</button>
    <div>Please provide the new pak details.</div>
    <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <input type="text" className={styling.input.formInput} {...behavior.input.title} {...register('name', {
            required: true,
        })} />
        <label htmlFor="passphrase">Passphrase</label>
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
        <button className={styling.button.formButton + ' w-1/2'} type="submit">Create</button>
        <button className={styling.button.formButton + ' w-1/2'} onClick={() => popPage()}>Cancel</button>
      </div>
    </form>
    { message }
  </div>
}
