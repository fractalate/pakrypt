import { useContext } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import PasswordEditor from '../editors/PasswordEditor'
import { DeleteEntry, PakPassword, PasswordFields, UpdatePassword } from '../pak/Pak'
import styling from '../lib/styling'
import { PakmanSave } from '../pak/Pakman'

export default function PageEditPassword({
  entry,
}: {
  entry: PakPassword,
}) {
  const pageContextState = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  // Note: no setQuery on save here because it interferes with the flow: search for all of some kind of thing and edit them all, one after another.

  if (pakman.ov != 'pakrypt.pakmanstate:unlocked') {
    throw new Error('pakman is not unlocked.')
  }

  const savePassword = async (data: PasswordFields) => {
    const pak = UpdatePassword(pakman.pak, entry.id, data)
    const [nextPakman] = await PakmanSave(pakman, pak)
    setPakman(nextPakman)
    closePage()
  }

  const deletePassword = async () => {
    const pak = DeleteEntry(pakman.pak, entry.id)
    const [nextPakman] = await PakmanSave(pakman, pak)
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
    <PasswordEditor
      initialValues={entry}
      showDelete={true}
      onUserSubmit={(data) => savePassword(data)}
      onUserDelete={() => deletePassword()}
      onUserCancel={() => closePage()}
    />
  </div>
}
