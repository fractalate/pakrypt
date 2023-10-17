import { randomId } from "../lib/rand";

export default function InputText(props: { id?: string, placeholder?: string }) {
  const id = props.id || randomId();
  return <div>
    <label htmlFor={id}
      className="block mb-2 text-sm font-medium">First name</label>
    <input type="text" id={id}
      className="border text-sm rounded-lg block w-full p-2.5"
      {...props}
    />
  </div>;
}
