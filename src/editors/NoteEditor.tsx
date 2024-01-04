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

  // TODO: Disable the Delete button when this is for a new password.

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onUserSubmit(data)
  }

  return <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
    <div className="p-1">
      <label htmlFor="title" className="block">Title</label>
      <input type="text" className={styling.input.formInput + ' w-full'} {...register('title', {
        required: true,
      })} />
      {errors.title && <div>{errors.title.message || 'Title is required.'}</div>}
    </div>
    <div className="p-1">
      <label htmlFor="subtitle" className="block">Subtitle</label>
      <input type="text" className={styling.input.formInput + ' w-full'} {...register('subtitle')} />
    </div>
    <div className="p-1">
      <label htmlFor="note" className="block">Note</label>
      <textarea className={styling.textarea.formTextArea + ' w-full'} {...register('note')} />
    </div>
    <div className="p-1  flex gap-2">
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
