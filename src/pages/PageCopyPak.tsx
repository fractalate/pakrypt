import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ListPaks, PakmanCopy } from '../pak/Pakman'
import PageNotLoaded from './PageNotLoaded'
import styling from '../lib/styling'
import behavior from '../lib/behavior'
import { toUserMessage } from '../pak/Text'

interface Inputs {
  name: string,
}

export default function PageCopyPak() {
  const { popPage } = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const [message, setMessage] = useState('')
  const { setQuery } = useContext(QueryBarContext)
  const {
    handleSubmit,
    register,
  } = useForm<Inputs>()

  if (pakman.ov === 'pakrypt.pakman_state:unloaded') {
    return <PageNotLoaded />
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (ListPaks().indexOf(data.name) >= 0) {
      setMessage('A pak with the name "' + data.name + '" already exists.')
      return
    }

    const [newPakman, result] = await PakmanCopy(pakman, data.name)
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(newPakman)
      setQuery('')
      popPage()
    } else {
      setMessage(toUserMessage(result))
    }
  }

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => popPage()}>Cancel</button>
    <div>Please give a new name for the copy.</div>
    <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <input type="text" className={styling.input.formInput} {...behavior.input.title} {...register('name', {
            required: true,
        })} />
      </div>
      <div className="flex flex-row gap-2">
        <button className={styling.button.formButton + ' w-1/2'} type="submit">Copy</button>
        <button className={styling.button.formButton + ' w-1/2'} onClick={() => popPage()}>Cancel</button>
      </div>
    </form>
    {message}
  </div>
}
