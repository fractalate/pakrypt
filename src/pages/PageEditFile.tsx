import { useCallback, useContext, useMemo, useState } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import { DeleteEntry, UpdateFile, PakFile, FindBlock } from '../pak/Pak'
import { PakmanUpdate } from '../pak/Pakman'
import styling from '../lib/styling'
import FileEditor from '../editors/FileEditor'
import { Base64 } from 'js-base64'
import { toUserMessage } from '../pak/Text'

// See FileEditor.tsx Input interface.
interface FileFieldsEdit {
  title: string,
  subtitle: string,
  uploadfile: undefined | null | File, // How data comes out from editor.
}

export default function PageEditFile({
  entry,
}: {
  entry: PakFile,
}) {
  const pageContextState = useContext(PageContext)
  const [message, setMessage] = useState('')
  const { pakman, setPakman } = useContext(PakmanStateContext)

  if (pakman.ov != 'pakrypt.pakman_state:unlocked') {
    throw new Error('pakman is not unlocked.')
  }

  const initialDataBase64 = useMemo(() => {
    let result = new Uint8Array()
    for (const block of entry.blocks) {
      const b = FindBlock(pakman.pak, block.id)
      if (b == null) {
        throw Error('Block not found ' + block.id + '.')
      }
      result = new Uint8Array([...result, ...Base64.toUint8Array(b.data)])
    }
    return Base64.fromUint8Array(result)
  }, [pakman.pak, entry.blocks])

  const closePage = useCallback(() => {
    pageContextState.popPage()
  }, [pageContextState])

  const saveFile = useCallback(async (input: FileFieldsEdit) => {
    const obj = {
      title: input.title,
      subtitle: input.subtitle,
      data: initialDataBase64,
    }

    if (input.uploadfile != null) {
      const ab = await input.uploadfile.arrayBuffer()
      obj.data = Base64.fromUint8Array(new Uint8Array(ab))
    }

    const pak = UpdateFile(pakman.pak, entry.id, obj)
    const [nextPakman, result] = await PakmanUpdate(pakman, pak)
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(nextPakman)
      closePage()
    } else {
      setMessage(toUserMessage(result))
    }
  }, [initialDataBase64, closePage, entry, pakman, setPakman])

  const deleteFile = async () => {
    const pak = DeleteEntry(pakman.pak, entry.id)
    const [nextPakman, result] = await PakmanUpdate(pakman, pak)
    if (result.ov === 'pakrypt.pakman_save_result:success') {
      setPakman(nextPakman)
      closePage()
    } else {
      setMessage(toUserMessage(result))
    }
  }

  const initialValuesEntry = useMemo(() => {
    return {
      title: entry.title,
      subtitle: entry.subtitle,
      uploadfile: undefined,
    }
  }, [entry])

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => closePage()}>Cancel</button>
    <div>Please provide updated details for the file.</div>
    <FileEditor
      initialValues={initialValuesEntry}
      showDelete={true}
      onUserSubmit={(data) => saveFile(data)}
      onUserDelete={() => deleteFile()}
      onUserCancel={() => closePage()}
    />
    { message }
  </div>
}
