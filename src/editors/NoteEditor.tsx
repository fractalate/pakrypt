import { SubmitHandler, useForm } from "react-hook-form"
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Button from "../components/Button";

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
      <Input type="text" {...register("title", {
        required: true,

      })} />
      {errors.title && <div>{errors.title.message || 'Title is required.'}</div>}
    </div>
    <div className="p-1">
      <label className="block" htmlFor="subtitle">Subtitle</label>
      <Input type="text" {...register("subtitle")} />
    </div>
    <div className="p-1">
      <label className="block" htmlFor="tags">Tags</label>
      <Input type="text" {...register("tags")} />
    </div>
    <div className="p-1">
      <label className="block" htmlFor="note">Note</label>
      <TextArea {...register("note")} />
    </div>
    <div className="p-1">
      <Button type="submit">Submit</Button>
      <Button onClick={onUserCancel}>Cancel</Button>
    </div>
  </form>
}
