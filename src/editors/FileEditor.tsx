import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import { downloadContent } from '../lib/download'
import styling from '../lib/styling'
import behavior from '../lib/behavior'

interface Inputs {
  title: string,
  subtitle: string,
  data: undefined | null | Uint8Array, // How data comes into the editor.
  uploadfile: undefined | null | File, // How data comes out from editor.
}

export default function FileEditor({
  initialValues,
  showDelete,
  onUserSubmit,
  onUserDelete,
  onUserCancel,
}: {
  initialValues?: Inputs,
  showDelete: boolean,
  onUserSubmit: (data: Inputs) => void,
  onUserDelete: () => void,
  onUserCancel: () => void,
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: initialValues && initialValues.title || '',
      subtitle: initialValues && initialValues.subtitle || '',
    },
  })
  
  const [confirmDelete, setConfirmDelete] = useState(false)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onUserSubmit(data)
  }

  return <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
    <div className="flex flex-col gap-2">
      <label htmlFor="title" className="block">Title {errors.title && ('(' + (errors.title.message || 'Required') + ')')}</label>
      <input type="text" className={styling.input.formInput + ' w-full'} {...behavior.input.title} {...register('title', {
        required: true,
      })} />
      <label htmlFor="subtitle" className="block">Subtitle</label>
      <input type="text" className={styling.input.formInput + ' w-full'} {...behavior.input.title} {...register('subtitle')} />
      <label htmlFor="uploadfile">File</label>
      <Controller
        name="uploadfile"
        control={control}
        render={({field}) => <input
          type="file"
          onChange={(e) => field.onChange(e?.target?.files?.[0])}
        />}
      />
      {initialValues != null && initialValues.data != null && <>
        <label>Download File</label>
        <button className={styling.button.formButton} onClick={() => {
          if (initialValues.data != null) {
            downloadContent(initialValues.title, initialValues.data)
          }
        }}>Download</button>
      </>}
    </div>
    <div className="flex flex-row gap-2">
      <button type="submit" className={styling.button.formButton + ' w-1/4'}>Submit</button>
      <button className={styling.button.formButton + ' w-1/4'} onClick={onUserCancel}>Cancel</button>
      {showDelete && <>
        {!confirmDelete && <>
          <button className={styling.button.formButton + ' w-1/4'} onClick={(e) => {
            e.preventDefault()
            setConfirmDelete(true)
          }}>Delete</button>
          <div className={'w-1/4'}></div>
        </>}
        {confirmDelete && <>
          <button className={styling.button.formButton + ' w-1/4'} onClick={(e) => {
            e.preventDefault()
            setConfirmDelete(false)
          }}>Keep</button>
          <button className={styling.button.dangerButton + ' w-1/4'} onClick={(e) => {
            e.preventDefault()
            onUserDelete()
          }}>Confirm</button>
        </>}
      </>}
    </div>
  </form>
}
