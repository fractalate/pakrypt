import { useContext, useMemo, useState } from 'react'
import { ListPaks, PakmanLoadRaw } from '../pak/Pakman'
import styling from '../lib/styling'
import { PageContext } from '../Contexts'
import { downloadContent } from '../lib/download'

export default function PageExportPak() {
  const paks = useMemo(() => ListPaks(), [])
  const { popPage } = useContext(PageContext)
  const [ message, setMessage ] = useState('')

  const items = paks.map((name) => <div key={name} className="flex flex-col">
    <button className={styling.button.formButton + ' w-1/2'} onClick={() => {
      const data = PakmanLoadRaw(name)
      if (data == null) {
        setMessage('Raw data not found. Sorry.')
      } else {
        downloadContent(name + '.pak', data)
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
