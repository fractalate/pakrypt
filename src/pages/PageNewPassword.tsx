import { useContext } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import PasswordEditor from '../editors/PasswordEditor'
import { CreatePassword, PasswordFields } from '../pak/Pak'
import styling from '../lib/styling'
import { PakmanSave } from '../pak/Pakman'
import PageNotUnlocked from './PageNotUnlocked'

export default function PageNewPassword() {
  const pageContextState = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)

  if (pakman.ov != 'pakrypt.pakmanstate:unlocked') {
    return <PageNotUnlocked />
  }

  const savePassword = async (data: PasswordFields) => {
    const [pak] = CreatePassword(pakman.pak, data)
    const [newPakman] = await PakmanSave(pakman, pak)
    setPakman(newPakman)
    setQuery(data.title) // TODO: If you use generic titles, you might get junk in the list. Can I set the query to the UUID?
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
      onUserSubmit={(data) => savePassword(data)}
      onUserDelete={() => {}}
      onUserCancel={() => closePage()}
    />
  </div>
}
