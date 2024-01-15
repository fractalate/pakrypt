import { useContext, useState } from 'react'
import { PageContext } from '../Contexts'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ListPaks, PakmanSaveRaw } from '../pak/Pakman'
import styling from '../lib/styling'
import behavior from '../lib/behavior'

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
        } else if (ListPaks().indexOf(data.name) >= 0) {
          setMessage('A pak with the name "' + data.name + '" already exists.')
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
    <button className={styling.button.formButton} onClick={() => popPage()}>Cancel</button>
    <div>Please specify a name and file to import.</div>
    <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <input type="text" className={styling.input.formInput} {...behavior.input.title} {...register('name', {
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
      </div>
      <div className="flex flex-row gap-2">
        <button className={styling.button.formButton + ' w-1/2'} type="submit">Import</button>
        <button className={styling.button.formButton + ' w-1/2'} onClick={() => popPage()}>Cancel</button>
      </div>
    </form>
    { message }
  </div>
}
