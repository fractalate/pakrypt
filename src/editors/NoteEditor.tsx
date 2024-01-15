import { SubmitHandler, useForm } from 'react-hook-form'
import styling from '../lib/styling'
import { useState } from 'react'

interface Inputs {
  title: string,
  subtitle: string,
  note: string,
}

export default function NoteEditor({
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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: initialValues && initialValues.title || '',
      subtitle: initialValues && initialValues.subtitle || '',
      note: initialValues && initialValues.note || '',
    },
  })
  
  const [confirmDelete, setConfirmDelete] = useState(false)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onUserSubmit(data)
  }

  return <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
    <div className="flex flex-col gap-2">
      <label htmlFor="title" className="block">Title {errors.title && ('(' + (errors.title.message || 'Required') + ')')}</label>
      <input type="text" className={styling.input.formInput + ' w-full'}  autoCapitalize="words" {...register('title', {
        required: true,
      })} />
      <label htmlFor="subtitle" className="block">Subtitle</label>
      <input type="text" className={styling.input.formInput + ' w-full'} autoCapitalize="words" {...register('subtitle')} />
      <label htmlFor="note" className="block">Note</label>
      <textarea className={styling.textarea.formTextArea + ' w-full'} {...register('note')} />
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
