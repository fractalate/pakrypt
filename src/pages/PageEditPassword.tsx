import { useContext } from 'react'
import { PageContext } from '../Contexts'
import PasswordEditor from '../editors/PasswordEditor'
import { PakPassword, PasswordFields, UpdatePassword } from '../pak/Pak'
import styling from '../lib/styling'
import { PakContext } from '../pak/PakContext'

export default function PageEditPassword({
  entry,
}: {
  entry: PakPassword,
}) {
  const pageContextState = useContext(PageContext)
  const pak = useContext(PakContext)

  if (pak == null) {
    throw new Error('pak is null. Is this component a child component of PakContextProvider?')
  }

  const savePassword = (data: PasswordFields) => {
    // TODO: This does not cascade changes via React to the pages, pak is edited in-place.
    // This is an issue as you return from the edit password screen to the parent component.
    // In this case, the tile that was rendered to allow the user to edit the password won't
    // rerender. I think this needs some more thought.
    UpdatePassword(pak, entry.id, data)
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
    <PasswordEditor onUserSubmit={(data) => savePassword(data)} initialValues={entry} onUserCancel={() => closePage()} />
  </div>
}
