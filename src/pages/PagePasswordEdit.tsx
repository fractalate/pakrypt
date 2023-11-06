import { SubmitHandler, useForm } from "react-hook-form";
import { buttonClasses, inputClasses } from "./PageNoteEdit";
import { useState } from "react";

interface Inputs {
  title: string; 
  subtitle: string;
  username: string;
  password: string;
}

export function PagePasswordEditExample() {
  const [editorOpen, setEditorOpen] = useState(true);
  const [codeBlockText, setCodeBlockText] = useState('');

  return <>
    {codeBlockText != '' && <div>
      <code className="whitespace-pre">{codeBlockText}</code>
    </div>}
    {editorOpen && <PagePasswordEdit
      onUserSubmit={(data) => {
        setCodeBlockText(JSON.stringify(data, null, 2));
        setEditorOpen(false);
      }}
      onUserCancel={() => {
        setEditorOpen(false);
        setCodeBlockText('User cancelled it!');
      }}
    />}
    {!editorOpen && <button className={buttonClasses} onClick={() => {
      setEditorOpen(true);
      setCodeBlockText('');
    }}>Open PLS!</button>}
  </>
}

export default function PagePasswordEdit({
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

  // TODO: INtegrate the other fields.
  return <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-1">
        <label className="block" htmlFor="title">Title</label>
        <input className={inputClasses} type="text" {...register("title", {
          required: true,
        })} />
      </div>
      <div className="p-1">
        <button className={buttonClasses} type="submit">Submit</button>
        <button className={buttonClasses} onClick={() => {
          onUserCancel();
        }}>Cancel</button>
      </div>
    </form>
  </div>
}
