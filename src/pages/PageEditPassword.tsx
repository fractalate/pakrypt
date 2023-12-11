import { useContext } from 'react'
import { PageContext } from '../Contexts'
import PasswordEditor from '../editors/PasswordEditor'
import { DeleteEntry, PakPassword, PasswordFields, UpdatePassword } from '../pak/Pak'
import styling from '../lib/styling'
import { PakContext } from '../pak/PakContext'

export default function PageEditPassword({
  entry,
}: {
  entry: PakPassword,
}) {
  const pageContextState = useContext(PageContext)
  const { pak, setPak } = useContext(PakContext)

  if (pak == null) {
    throw new Error('pak is null. Is this component a child component of PakContextProvider?')
  }

  const savePassword = (data: PasswordFields) => {
    setPak(UpdatePassword(pak, entry.id, data))
    closePage()
  }

  const deletePassword = () => {
    setPak(DeleteEntry(pak, entry.id))
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
    <PasswordEditor
      initialValues={entry}
      onUserSubmit={(data) => savePassword(data)}
      onUserDelete={() => deletePassword()}
      onUserCancel={() => closePage()}
    />
  </div>
}
