import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import styling from '../lib/styling'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PakmanNew, PakmanSave } from '../pak/Pakman'

interface Inputs {
  name: string,
  passphrase: string,
}

export default function PageNewPak() {
  const { popPage } = useContext(PageContext)
  const { setPakman } = useContext(PakmanStateContext)
  const [ message ] = useState('')
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // TODO: Handling bad cases?
    let [newPakman] = await PakmanNew(data.name, data.passphrase)
    const [newPakman2] = await PakmanSave(newPakman, newPakman.pak)
    newPakman = newPakman2
    setPakman(newPakman)
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
      <label htmlFor="passphrase">Passphrase</label>
      <input type="password" className={styling.input.formInput} {...register('passphrase', {
          required: true,
      })} />
      <button className={styling.button.formButton} type="submit">Create</button>
    </form>
    { message }
  </div>
}
