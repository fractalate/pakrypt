import { useContext, useState } from 'react'
import styling from '../lib/styling'
import { PakmanStateContext } from '../Contexts'
import { PakmanUpdateLocalOptions } from '../pak/Pakman'
import { SubmitHandler, useForm } from 'react-hook-form'

interface Inputs {
  url: string,
  key: string,
}

export default function TileDebug() {
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const [message, setMessage] = useState('')
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()

  if (pakman.ov !== 'pakrypt.pakman_state:unlocked') {
    return <></>
  }

  const removeLocals = async () => {
    const [newPakman, result] = await PakmanUpdateLocalOptions(pakman, null)
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(newPakman)
    } else {
      setMessage(result.ov)
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const [newPakman, result] = await PakmanUpdateLocalOptions(pakman, {
      ov: 'pakrypt.pakman_local_options:1.0',
      pakmanStore: {
        ov: 'pakrypt.pakman_local_options.pakman_store:1.0',
        url: data.url,
        key: data.key,
      },
    })
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(newPakman)
    } else {
      setMessage(result.ov)
    }
  }

  const printPakman = async () => {
    console.log('pakman:', pakman)
  }

  return <div className={styling.tile.tileComponentCommand + ' flex flex-col'}>
    <form className="flex flex-col gap-2" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="url">Url</label>
      <input type="password" className={styling.input.formInput + ' w-100'} {...register('url', {
          required: true,
      })} />
      <label htmlFor="key">key</label>
      <input type="password" className={styling.input.formInput + ' w-100'} {...register('key', {
          required: true,
      })} />
      <button type="submit" className={styling.button.formButton}>Adds Locals</button>
      <button className={styling.button.formButton} onClick={() => removeLocals()}>Remove Locals</button>
      <button className={styling.button.formButton} onClick={() => printPakman()}>Print Pakman</button>
    </form>
    <br/>
    {message}
  </div>
}
