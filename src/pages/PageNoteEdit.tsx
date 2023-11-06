import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"

interface Inputs {
  title: string;
  subtitle: string;
  tags: string;
  note: string;
}

// TODO: Maybe move these class lists to somewhere common.
export const inputClasses = `
  border rounded-lg block w-full text-sm p-1
  text-[#223] bg-white/75 border-slate-200
  dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
`
// TODO: Maybe move these class lists to somewhere common.
export const buttonClasses = `
  rounded p-2
  bg-gray-200 dark:bg-gray-600
  drop-shadow
`

export function PageNoteEditExample() {
  const [editorOpen, setEditorOpen] = useState(true);
  const [codeBlockText, setCodeBlockText] = useState('');

  return <>
    {codeBlockText != '' && <div>
      <code className="whitespace-pre">{codeBlockText}</code>
    </div>}
    {!editorOpen && <button className={buttonClasses} onClick={() => {
        setCodeBlockText('');
        setEditorOpen(true);
    }}>Please Open the Editor!!!</button>}
    {editorOpen && <PageNoteEdit
      onUserSubmit={(data) => {
        setEditorOpen(false);
        setCodeBlockText(JSON.stringify(data, null, 2));
      }}
      onUserCancel={() => {
        setEditorOpen(false);
        setCodeBlockText('User Cancel :-(');
      }}
    />}
  </>
}

export default function PageNoteEdit({
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
      <input className={inputClasses} type="text" {...register("title", {
        required: true,

      })} />
      {errors.title && <div>{errors.title.message || 'Title is required.'}</div>}
    </div>
    <div className="p-1">
      <label className="block" htmlFor="subtitle">Subtitle</label>
      <input className={inputClasses} type="text" {...register("subtitle")} />
    </div>
    <div className="p-1">
      <label className="block" htmlFor="tags">Tags</label>
      <input className={inputClasses} type="text" {...register("tags")} />
    </div>
    <div className="p-1">
      <label className="block" htmlFor="note">Note</label>
      <textarea className={inputClasses} {...register("note")} />
    </div>
    <div className="p-1">
      <button type="submit" className={buttonClasses}>Submit</button>
      <button className={buttonClasses} onClick={onUserCancel}>Cancel</button>
    </div>
  </form>
}
