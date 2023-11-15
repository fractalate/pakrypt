import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";

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
    min-h-screen w-screen
    text-[#333] bg-[#FFE]
    dark:text-[#EED] dark:bg-[#323]
  ">
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-1">
        <label className="block" htmlFor="title">Title</label>
        <Input type="text" {...register("title", {
          required: true,
        })} />
      </div>
      <div className="p-1">
        <label className="block" htmlFor="subtitle">Subtitle</label>
        <Input type="text" {...register("subtitle")} />
      </div>
      <div className="p-1">
        <label className="block" htmlFor="username">Username</label>
        <Input type="text" {...register("username")} />
      </div>
      <div className="p-1">
        <label className="block" htmlFor="password">Password</label>
        <Input type="text" {...register("password")} />
      </div>
      <div className="p-1">
        <Button type="submit">Submit</Button>
        <Button onClick={() => {
          onUserCancel();
        }}>Cancel</Button>
      </div>
    </form>
  </div>
}
