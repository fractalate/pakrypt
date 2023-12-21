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

  if (pakman.ov == 'pakrypt.pakmanstate:unloaded') {
    return <PageNotLoaded />
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // TODO: Handling bad cases?
    const [newPakman] = await PakmanRenameAndSave(pakman, data.name)
    setPakman(newPakman)
    setQuery('')
    popPage()
  }

  return <div className="
    min-h-screen w-screen
    text-[#333] bg-[#FFE]
    dark:text-[#EED] dark:bg-[#323]
  ">
    <button className={styling.button.formButton} onClick={() => popPage()}>X</button>
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input type="text" className={styling.input.formInput} {...register('name', {
          required: true,
      })} />
      <button className={styling.button.formButton} type="submit">Confirm Copy</button>
    </form>
  </div>
}
