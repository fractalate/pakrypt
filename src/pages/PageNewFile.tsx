import { useContext, useState } from 'react'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import FileEditor from '../editors/FileEditor'
import { CreateFile } from '../pak/Pak'
import styling from '../lib/styling'
import { PakmanUpdate } from '../pak/Pakman'
import PageNotUnlocked from './PageNotUnlocked'
import { Base64 } from 'js-base64'
import { toUserMessage } from '../pak/Text'

// See FileEditor.tsx Input interface.
interface FileFieldsNew {
  title: string,
  subtitle: string,
  data: undefined | null | Uint8Array, // How data comes into the editor.
  uploadfile: undefined | null | File, // How data comes out from editor.
}

export default function PageNewFile() {
  const pageContextState = useContext(PageContext)
  const [message, setMessage] = useState('')
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { setQuery } = useContext(QueryBarContext)

  if (pakman.ov != 'pakrypt.pakman_state:unlocked') {
    return <PageNotUnlocked />
  }

  const saveFile = async (input: FileFieldsNew) => {
    if (input.uploadfile == null) {
      return
    }
    const ab = await input.uploadfile.arrayBuffer()
    const data = Base64.fromUint8Array(new Uint8Array(ab))
    const obj = {
      title: input.title,
      subtitle: input.subtitle,
      data,
    }
    const [pak] = CreateFile(pakman.pak, obj)
    const [newPakman, result] = await PakmanUpdate(pakman, pak)

    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(newPakman)
      setQuery(obj.title) // XXX: If you use generic titles, you might get junk in the list. Can I set the query to the UUID?
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
    <div>Please provide the new file details.</div>
    <FileEditor
      showDelete={false}
      onUserSubmit={(data) => saveFile(data)}
      onUserDelete={() => {}}
      onUserCancel={() => closePage()}
    />
    { message }
  </div>
}
