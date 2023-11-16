import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
  title: string; 
  subtitle: string;
  username: string;
  password: string;
}

export default function PasswordEditor({
  onUserCancel,
  onUserSubmit,
}: {
  onUserSubmit: (data: Inputs) => void,
  onUserCancel: () => void,
}) {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onUserSubmit(data);
  }
  return <div className="
    w-full
  ">
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-1">
        <label className="block" htmlFor="title">Title</label>
        <input type="text" {...register("title", {
          required: true,
        })} />
      </div>
      <div className="p-1">
        <label className="block" htmlFor="subtitle">Subtitle</label>
        <input type="text" {...register("subtitle")} />
      </div>
      <div className="p-1">
        <label className="block" htmlFor="username">Username</label>
        <input type="text" {...register("username")} />
      </div>
      <div className="p-1">
        <label className="block" htmlFor="password">Password</label>
        <input type="text" {...register("password")} />
      </div>
      <div className="p-1">
        <button type="submit">Submit</button>
        <button onClick={() => {
          onUserCancel();
        }}>Cancel</button>
      </div>
    </form>
  </div>
}
