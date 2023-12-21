import { useContext, useMemo, useState } from 'react'
import { ListPaks, PakmanLoadRaw } from '../pak/Pakman'
import styling from '../lib/styling'
import { PageContext } from '../Contexts'

function downloadString(filename: string, content: string) {
  const blob = new Blob([content])
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function PageExportPak() {
  const paks = useMemo(() => ListPaks(), [])
  const { popPage } = useContext(PageContext)
  const [ message, setMessage ] = useState('')

  const items = paks.map((name) => <div key={name}>
    <button className={styling.button.formButton} onClick={() => {
      const data = PakmanLoadRaw(name)
      if (data == null) {
        setMessage('Raw data not found. Sorry.')
      } else {
        downloadString(name + '.pak', data)
      }
    }}>{name}</button>
  </div>)

  return <div className="
    min-h-screen w-screen
    text-[#333] bg-[#FFE]
    dark:text-[#EED] dark:bg-[#323]
  ">
    <button className={styling.button.formButton} onClick={() => popPage()}>X</button>
    { items }
    { items.length == 0 && <div>
      No paks.
    </div>}
    { message }
  </div>
}
