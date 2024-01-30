import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import { DeleteEntry, PakNote, NoteFields, UpdateNote } from '../pak/Pak'
import { PakmanUpdate } from '../pak/Pakman'
import styling from '../lib/styling'
import NoteEditor from '../editors/NoteEditor'
import { toUserMessage } from '../pak/Text'
import PageErrorNotUnlocked from './PageErrorNotUnlocked'

export default function PageEditNote({
  entry,
}: {
  entry: PakNote,
}) {
  const pageContextState = useContext(PageContext)
  const [message, setMessage] = useState('')
  const { pakman, setPakman } = useContext(PakmanStateContext)
  // Note: no setQuery on save here because it interferes with the flow: search for all of some kind of thing and edit them all, one after another.

  if (pakman.ov != 'pakrypt.pakman_state:unlocked') {
    return <PageErrorNotUnlocked />
  }

  const saveNote = async (data: NoteFields) => {
    const pak = UpdateNote(pakman.pak, entry.id, data)
    const [nextPakman, result] = await PakmanUpdate(pakman, pak)
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(nextPakman)
      closePage()
    } else {
      setMessage(toUserMessage(result))
    }
  }

  const deleteNote = async () => {
    const pak = DeleteEntry(pakman.pak, entry.id)
    const [nextPakman, result] = await PakmanUpdate(pakman, pak)
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(nextPakman)
      closePage()
    } else {
      setMessage(toUserMessage(result))
    }
  }

  function closePage() {
    pageContextState.popPage()
  }

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => closePage()}>Cancel</button>
    <div>Please provide updated details for the note.</div>
    <NoteEditor
      initialValues={entry}
      showDelete={true}
      onUserSubmit={(data) => saveNote(data)}
      onUserDelete={() => deleteNote()}
      onUserCancel={() => closePage()}
    />
    { message }
  </div>
}
