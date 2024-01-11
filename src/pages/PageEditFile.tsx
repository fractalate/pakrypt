import { useCallback, useContext, useMemo } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import { DeleteEntry, UpdateFile, PakFile, FindBlock } from '../pak/Pak'
import { PakmanSave } from '../pak/Pakman'
import styling from '../lib/styling'
import FileEditor from '../editors/FileEditor'
import { Base64 } from 'js-base64'

// See FileEditor.tsx Input interface.
interface FileFieldsEdit {
  title: string,
  subtitle: string,
  data: undefined | null | Uint8Array, // How data comes into the editor.
  uploadfile: undefined | null | File, // How data comes out from editor.
}

export default function PageEditFile({
  entry,
}: {
  entry: PakFile,
}) {
  const pageContextState = useContext(PageContext)
  const { pakman, setPakman } = useContext(PakmanStateContext)
  // Note: no setQuery on save here because it interferes with the flow: search for all of some kind of thing and edit them all, one after another.

  if (pakman.ov != 'pakrypt.pakman_state:unlocked') {
    throw new Error('pakman is not unlocked.')
  }

  const [initialData, initialDataBase64] = useMemo(() => {
    let result = new Uint8Array()
    for (const block of entry.blocks) {
      const b = FindBlock(pakman.pak, block.id)
      if (b == null) {
        throw Error('Block not found ' + block.id + '.')
      }
      result = new Uint8Array([...result, ...Base64.toUint8Array(b.data)])
    }
    return [result, Base64.fromUint8Array(result)]
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
    const [nextPakman] = await PakmanSave(pakman, pak)
    setPakman(nextPakman)
    closePage()
  }, [initialDataBase64, closePage, entry, pakman, setPakman])

  const deleteFile = async () => {
    const pak = DeleteEntry(pakman.pak, entry.id)
    const [nextPakman] = await PakmanSave(pakman, pak)
    setPakman(nextPakman)
    closePage()
  }

  const initialValuesEntry = useMemo(() => {
    return {
      title: entry.title,
      subtitle: entry.subtitle,
      data: initialData,
      uploadfile: undefined,
    }
  }, [initialData, entry])

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
  </div>
}
