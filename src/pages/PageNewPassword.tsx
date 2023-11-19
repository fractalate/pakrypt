import { useContext } from 'react'
import { PageContext } from '../Contexts'
import PasswordEditor from '../editors/PasswordEditor'
import { CreatePassword, PasswordFields } from '../pak/Pak'
import styling from '../lib/styling'
import { PakContext } from '../pak/PakContext'

export default function PageNewPassword() {
  const pageContextState = useContext(PageContext)
  const pak = useContext(PakContext)

  if (pak == null) {
    throw new Error('pak is null. Is this component a child component of PakContextProvider?')
  }

  const savePassword = (data: PasswordFields) => {
    // TODO: This does not cascade changes via React to the pages, pak is edited in-place.
    CreatePassword(pak, data)
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
    <PasswordEditor onUserSubmit={(data) => savePassword(data)} onUserCancel={() => closePage()} />
  </div>
}
