import { SubmitHandler, useForm } from "react-hook-form"

interface Inputs {
  title: string;
  subtitle: string;
  tags: string;
  note: string;
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
      <label className="block" htmlFor="title">Title</label>
      <input type="text" {...register("title", {
        required: true,

      })} />
      {errors.title && <div>{errors.title.message || 'Title is required.'}</div>}
    </div>
    <div className="p-1">
      <label className="block" htmlFor="subtitle">Subtitle</label>
      <input type="text" {...register("subtitle")} />
    </div>
    <div className="p-1">
      <label className="block" htmlFor="tags">Tags</label>
      <input type="text" {...register("tags")} />
    </div>
    <div className="p-1">
      <label className="block" htmlFor="note">Note</label>
      <textarea {...register("note")} />
    </div>
    <div className="p-1">
      <button type="submit">Submit</button>
      <button onClick={onUserCancel}>Cancel</button>
    </div>
  </form>
}
