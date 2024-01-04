import { SubmitHandler, useForm } from 'react-hook-form'
import styling from '../lib/styling'
import { useState } from 'react'

interface Inputs {
  title: string,
  subtitle: string,
  username: string,
  password: string,
}

export default function PasswordEditor({
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
  } = useForm<Inputs>({
    defaultValues: {
      title: initialValues && initialValues.title || '',
      subtitle: initialValues && initialValues.subtitle || '',
      username: initialValues && initialValues.username || '',
      password: initialValues && initialValues.password || '',
    },
  })

  const [confirmDelete, setConfirmDelete] = useState(false)

  // TODO: Disable the Delete button when this is for a new password.

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onUserSubmit(data)
  }
  return <div className="
    w-full
  ">
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="p-1">
        <label htmlFor="title" className="block">Title</label>
        <input type="text" className={styling.input.formInput} {...register('title', {
          required: true,
        })} />
      </div>
      <div className="p-1">
        <label htmlFor="subtitle" className="block">Subtitle</label>
        <input type="text" className={styling.input.formInput} {...register('subtitle')} />
      </div>
      <div className="p-1">
        <label htmlFor="username" className="block">Username</label>
        <input type="text" className={styling.input.formInput} {...register('username')} />
      </div>
      <div className="p-1">
        <label htmlFor="password" className="block">Password</label>
        <input type="text" className={styling.input.formInput} {...register('password')} />
      </div>
      <div className="p-1 flex gap-2">
        <button className={styling.button.formButton + ' w-1/4'} type="submit">Submit</button>
        <button className={styling.button.formButton + ' w-1/4'} onClick={() => {
          onUserCancel()
        }}>Cancel</button>
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
  </div>
}
