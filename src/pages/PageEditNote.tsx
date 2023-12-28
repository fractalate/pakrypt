import { useContext } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import { DeleteEntry, PakNote, NoteFields, UpdateNote } from '../pak/Pak'
import { PakmanSave } from '../pak/Pakman'
import styling from '../lib/styling'
import NoteEditor from '../editors/NoteEditor'

export default function PageEditNote({
  entry,
}: {
  entry: PakNote,
}) {
  const pageContextState = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  // Note: no setQuery on save here because it interferes with the flow: search for all of some kind of thing and edit them all, one after another.

  if (pakman.ov != 'pakrypt.pakmanstate:unlocked') {
    throw new Error('pakman is not unlocked.')
  }

  const saveNote = async (data: NoteFields) => {
    const pak = UpdateNote(pakman.pak, entry.id, data)
    const [nextPakman] = await PakmanSave(pakman, pak)
    setPakman(nextPakman)
    closePage()
  }

  const deleteNote = async () => {
    console.log(entry)
    console.log(pakman)
    const pak = DeleteEntry(pakman.pak, entry.id)
    console.log(pak)
    const [nextPakman] = await PakmanSave(pakman, pak)
    console.log(nextPakman)
    setPakman(nextPakman)
    closePage()
  }

  function closePage() {
    pageContextState.popPage()
  }

  return <div className="
    min-h-screen w-screen
    text-[#333] bg-[#FFE]
    dark:text-[#EED] dark:bg-[#323]
  ">
    <button className={styling.button.formButton} onClick={() => closePage()}>X</button>
    <NoteEditor
      initialValues={entry}
      onUserSubmit={(data) => saveNote(data)}
      onUserDelete={() => deleteNote()}
      onUserCancel={() => closePage()}
    />
  </div>
}
