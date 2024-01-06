import { useContext, useState } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { PakmanSaveRaw } from '../pak/Pakman'

interface Inputs {
  name: string,
  uploadfile: undefined | null | File,
}

export default function PageImportPak() {
  const { popPage } = useContext(PageContext)
  const [ message, setMessage ] = useState('')
  const {
    control,
    handleSubmit,
    register,
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.uploadfile == null) {
      setMessage('Please select a file.')
    } else if (data.name == null) {
      setMessage('Please set a name.')
    } else {
      const reader = new FileReader()

      reader.onload = (e) => {
        let pakdata = e?.target?.result
        if (pakdata == null || pakdata == '') {
          setMessage('No data loaded.')
        } else {
          if (pakdata instanceof ArrayBuffer) {
            pakdata = new TextDecoder().decode(pakdata)
          }
          PakmanSaveRaw(data.name, pakdata)
          popPage()
        }
      }

      reader.readAsText(data.uploadfile)
    }
  }

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => popPage()}>X</button>
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input type="text" className={styling.input.formInput} {...register('name', {
          required: true,
      })} />
      <label htmlFor="uploadfile">File</label>
      <Controller
        name="uploadfile"
        control={control}
        render={({field}) => <input
          type="file"
          onChange={(e) => field.onChange(e?.target?.files?.[0])}
        />}
      />
      <br />
      <button className={styling.button.formButton} type="submit">Import</button>
    </form>
    { message }
  </div>
}
