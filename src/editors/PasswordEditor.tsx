import { SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import styling from '../lib/styling'
import behavior from '../lib/behavior'

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
  const [passwordType, setPasswordType] = useState('password' as 'password' | 'text')

  const togglePasswordVisible = () => {
    if (passwordType === 'password') {
      setPasswordType('text')
    } else if (passwordType === 'text') {
      setPasswordType('password')
    }
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onUserSubmit(data)
  }
  return <div className="
    w-full
  ">
    <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="block">Title</label>
        <input type="text" className={styling.input.formInput} {...behavior.input.title} {...register('title', {
          required: true,
        })} />
        <label htmlFor="subtitle" className="block">Subtitle</label>
        <input type="text" className={styling.input.formInput} {...behavior.input.title} {...register('subtitle')} />
        <label htmlFor="username" className="block">Username</label>
        <input type="text" className={styling.input.formInput} {...behavior.input.sensitiveData} {...register('username')} />
        <label htmlFor="password" className="block">Password</label>
        <div className="flex flex-row relative">
          <input type={passwordType} className={styling.input.formInput + ' pr-8 w-full'} {...behavior.input.sensitiveData} {...register('password')} />
          <button type="button" className={styling.button.formButton + ' absolute right-0'} onClick={(e) => {
            e.preventDefault()
            togglePasswordVisible()
          }}>👁️</button>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <button type="submit" className={styling.button.formButton + ' w-1/4'}>
          {showDelete ? 'Save' : 'Create'}
        </button>
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
