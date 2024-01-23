import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import PasswordEditor from '../editors/PasswordEditor'
import { DeleteEntry, PakPassword, PasswordFields, UpdatePassword } from '../pak/Pak'
import styling from '../lib/styling'
import { PakmanUpdate } from '../pak/Pakman'
import { toUserMessage } from '../pak/Text'

export default function PageEditPassword({
  entry,
}: {
  entry: PakPassword,
}) {
  const pageContextState = useContext(PageContext)
  const [message, setMessage] = useState('')
  const { pakman, setPakman } = useContext(PakmanStateContext)
  // Note: no setQuery on save here because it interferes with the flow: search for all of some kind of thing and edit them all, one after another.

  if (pakman.ov != 'pakrypt.pakman_state:unlocked') {
    throw new Error('pakman is not unlocked.')
  }

  const savePassword = async (data: PasswordFields) => {
    const pak = UpdatePassword(pakman.pak, entry.id, data)
    const [nextPakman, result] = await PakmanUpdate(pakman, pak)
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(nextPakman)
      closePage()
    } else {
      setMessage(toUserMessage(result))
    }
  }

  const deletePassword = async () => {
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
    <div>Please provide updated details for the password.</div>
    <PasswordEditor
      initialValues={entry}
      showDelete={true}
      onUserSubmit={(data) => savePassword(data)}
      onUserDelete={() => deletePassword()}
      onUserCancel={() => closePage()}
    />
    { message }
  </div>
}
