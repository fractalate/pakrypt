import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import PasswordEditor from '../editors/PasswordEditor'
import { CreatePassword, PasswordFields } from '../pak/Pak'
import styling from '../lib/styling'
import { PakmanUpdate } from '../pak/Pakman'
import PageNotUnlocked from './PageErrorNotUnlocked'
import { toUserMessage } from '../pak/Text'

export default function PageNewPassword() {
  const pageContextState = useContext(PageContext)
  const [message, setMessage] = useState('')
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)

  if (pakman.ov != 'pakrypt.pakman_state:unlocked') {
    return <PageNotUnlocked />
  }

  const savePassword = async (data: PasswordFields) => {
    const [pak] = CreatePassword(pakman.pak, data)
    const [newPakman, result] = await PakmanUpdate(pakman, pak)

    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(newPakman)
      setQuery(data.title) // XXX: If you use generic titles, you might get junk in the list.
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
    <div>Please provide the new password details.</div>
    <PasswordEditor
      showDelete={false}
      onUserSubmit={(data) => savePassword(data)}
      onUserDelete={() => {}}
      onUserCancel={() => closePage()}
    />
    { message }
  </div>
}
