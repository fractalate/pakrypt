import { useContext } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import PasswordEditor from '../editors/PasswordEditor'
import { CreatePassword, PasswordFields } from '../pak/Pak'
import styling from '../lib/styling'
import { PakmanSave } from '../pak/Pakman'

export default function PageNewPassword() {
  const pageContextState = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)

  if (pakman.ov != 'pakrypt.pakmanstate:unlocked') {
    throw new Error('pak is not unlocked.')
  }

  const savePassword = (data: PasswordFields) => {
    const [pak] = CreatePassword(pakman.pak, data)
    const [newPakman] = PakmanSave(pakman, pak)
    setPakman(newPakman)
    closePage()
  }

  function closePage() {
    pageContextState.popPage()
  }

  // TODO: no delete.
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
