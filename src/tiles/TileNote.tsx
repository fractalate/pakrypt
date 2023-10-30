import { ChangeEvent, useState } from "react";
import Tile from "./Tile";
import Overlay from "../components/Overlay";
import { LayoutStickyControls } from "../lib/layout";
import { textAndPaddingClasses } from "../components/InputOmnibar";

interface TODONote { // TODO: Moving this somewhere.
  ov: 'pakrypt.note:0';
  title: string;
  body: string;
}

interface TileNoteProps {
  note?: TODONote;
  onSave?: (note: TODONote) => any;
}

export function TileNote(props: TileNoteProps) {
  const canSave = (props.onSave != null);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(props.note != null ? props.note : {
    ov: 'pakrypt.note:0',
    title: '',
    body: '',
  } as TODONote);

  function openEditor() {
    setEditing(true);
  }

  function closeEditor() {
    setEditing(false);
  }

  function save() {
    if (props.onSave != null) {
      props.onSave(note);
    }
  }

  function onInputChanged(e: ChangeEvent<HTMLInputElement>) {
    setNote({
      ...note,
      [e.target.name]: e.target.value,
    })
  }

  return <Tile commandTile={props.note == null}>
    {(props.note == null) ? (
      <button onClick={openEditor}>New Note</button>
    ) : (
      <button onClick={openEditor}>{props.note.title}</button>
    )}
    {(editing) && <Overlay>
      <div className={LayoutStickyControls}>
        <button onClick={closeEditor}>Close</button>
        {(canSave) && <button onClick={save}>Save</button>}
      </div>
      <div>
        <label htmlFor="title">Title</label>
        <input name="title" className={`
          border rounded-lg block w-full text-sm p-1.5
          text-[#223] bg-white/75 border-slate-200
          dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
        `} onChange={onInputChanged}></input>
      </div>
      <div>
        <label htmlFor="body">Body</label>
        <input name="body" className={`
          border rounded-lg block w-full text-sm p-1.5
          text-[#223] bg-white/75 border-slate-200
          dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
        `} onChange={onInputChanged}></input>
      </div>
    </Overlay>}
  </Tile>
}
