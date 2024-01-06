import { useContext } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import NoteEditor from '../editors/NoteEditor'
import { CreateNote, NoteFields } from '../pak/Pak'
import styling from '../lib/styling'
import { PakmanSave } from '../pak/Pakman'
import PageNotUnlocked from './PageNotUnlocked'

export default function PageNewNote() {
  const pageContextState = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)

  if (pakman.ov != 'pakrypt.pakman_state:unlocked') {
    return <PageNotUnlocked />
  }

  const saveNote = async (data: NoteFields) => {
    const [pak] = CreateNote(pakman.pak, data)
    const [newPakman] = await PakmanSave(pakman, pak)
    setPakman(newPakman)
    setQuery(data.title) // TODO: If you use generic titles, you might get junk in the list. Can I set the query to the UUID?
    closePage()
  }

  function closePage() {
    pageContextState.popPage()
  }

  return <div className={styling.page.regular}>
    <NoteEditor
      showDelete={false}
      onUserSubmit={(data) => saveNote(data)}
      onUserDelete={() => {}}
      onUserCancel={() => closePage()}
    />
  </div>
}
