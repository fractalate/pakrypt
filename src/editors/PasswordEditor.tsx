import { SubmitHandler, useForm } from 'react-hook-form'
import styling from '../lib/styling'

interface Inputs {
  title: string,
  subtitle: string,
  username: string,
  password: string,
}

export default function PasswordEditor({
  initialValues,
  onUserCancel,
  onUserSubmit,
}: {
  initialValues?: Inputs,
  onUserSubmit: (data: Inputs) => void,
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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onUserSubmit(data)
  }
  return <div className="
    w-full
  ">
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <div className="p-1">
        <button className={styling.button.formButton} type="submit">Submit</button>
        <button className={styling.button.formButton} onClick={() => {
          onUserCancel()
        }}>Cancel</button>
      </div>
    </form>
  </div>
}
