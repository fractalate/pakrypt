import { useContext } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import styling from '../lib/styling'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PakmanRenameAndSave } from '../pak/Pakman'
import PageNotLoaded from './PageNotLoaded'

interface Inputs {
  name: string,
}

export default function PageCopyPak() {
  const { popPage } = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)
  const {
    handleSubmit,
    register,
  } = useForm<Inputs>()

  if (pakman.ov == 'pakrypt.pakman_state:unloaded') {
    return <PageNotLoaded />
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // TODO: Handling bad cases?
    // TODO: Warning about overwrites?
    const [newPakman] = await PakmanRenameAndSave(pakman, data.name)
    setPakman(newPakman)
    setQuery('')
    popPage()
  }

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => popPage()}>Cancel</button>
    <div>Please give a new name for the copy.</div>
    <form className="flex flex-col gap-2" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input type="text" className={styling.input.formInput} autoCapitalize="words" {...register('name', {
          required: true,
      })} />
    </form>
    <div className="flex flex-row gap-2">
      <button className={styling.button.formButton + ' w-1/2'} type="submit">Copy</button>
      <button className={styling.button.formButton + ' w-1/2'} onClick={() => popPage()}>Cancel</button>
    </div>
  </div>
}
