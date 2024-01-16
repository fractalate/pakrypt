import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import styling from '../lib/styling'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PakmanChangePassphrase } from '../pak/Pakman'
import PageNotUnlocked from './PageNotUnlocked'

interface Inputs {
  passphrase: string,
  passphrase2: string,
}

export default function PageChangePassphrase() {
  const { popPage } = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const [ message, setMessage ] = useState('')
  const { setQuery } = useContext(QueryBarContext)
  const {
    handleSubmit,
    register,
    watch,
  } = useForm<Inputs>()

  // TODO: Find some other way to detect when the field changes. onChange maybe?
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
    if (data.passphrase === data.passphrase2) {
      // TODO: Handling bad cases?
      const [newPakman] = await PakmanChangePassphrase(pakman, data.passphrase)
      setPakman(newPakman)
      setQuery('')
      popPage()
    } else {
      setMessage('Passphrases do not match! Try again.')
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
        <input type="password" className={styling.input.formInput} {...register('passphrase', {
            required: true,
        })} />
        <label htmlFor="passphrase">Passphrase Confirm</label>
        <input type="password" className={styling.input.formInput} {...register('passphrase2', {
            required: true,
        })} />
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
