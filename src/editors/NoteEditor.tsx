import { SubmitHandler, useForm } from 'react-hook-form'
import styling from '../lib/styling'

interface Inputs {
  title: string,
  subtitle: string,
  tags: string,
  note: string,
}

export default function NoteEditor({
  onUserSubmit,
  onUserCancel,
}: {
  onUserSubmit: (data: Inputs) => void,
  onUserCancel: () => void,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onUserSubmit(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>
    <div className="p-1">
      <label htmlFor="title" className="block">Title</label>
      <input type="text" className={styling.input.formInput + ' w-full'} {...register("title", {
        required: true,
      })} />
      {errors.title && <div>{errors.title.message || 'Title is required.'}</div>}
    </div>
    <div className="p-1">
      <label htmlFor="subtitle" className="block">Subtitle</label>
      <input type="text" className={styling.input.formInput + ' w-full'} {...register("subtitle")} />
    </div>
    <div className="p-1">
      <label htmlFor="tags" className="block">Tags</label>
      <input type="text" className={styling.input.formInput + ' w-full'}  {...register("tags")} />
    </div>
    <div className="p-1">
      <label htmlFor="note" className="block">Note</label>
      <textarea className={styling.textarea.formTextArea + ' w-full'} {...register("note")} />
    </div>
    <div className="p-1">
      <button type="submit" className={styling.button.formButton + ' w-full'}>Submit</button>
      <button className={styling.button.formButton} onClick={onUserCancel}>Cancel</button>
    </div>
  </form>
}
