import { useContext, useMemo, useState } from 'react'
import { ListPaks, PakmanExport } from '../pak/Pakman'
import styling from '../lib/styling'
import { PageContext } from '../Contexts'
import { downloadContent } from '../lib/download'
import { toUserMessage } from '../pak/Text'

export default function PageExportPak() {
  const paks = useMemo(() => ListPaks(), [])
  const { popPage } = useContext(PageContext)
  const [ message, setMessage ] = useState('')

  const items = paks.map((name) => <div key={name} className="flex flex-col">
    <button className={styling.button.formButton + ' w-1/2'} onClick={() => {
      const [data, result] = PakmanExport(name)
      if (result.ov === 'pakrypt.pakman_export_result:success') {
        downloadContent(name + '.pak', data)
      } else {
        setMessage(toUserMessage(result))
      }
    }}>{name}</button>
    <div className="w-1/2"></div>
  </div>)

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => popPage()}>Cancel</button>
    { items.length == 0 && <div>
      No paks to export.
    </div>}
    { items.length > 0 && <div>
      Please select a pak to export.
    </div>}
    <div className="flex flex-col gap-2">
      { items }
    </div>
    <div>{ message }</div>
  </div>
}
