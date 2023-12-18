import { useContext, useMemo, useState } from 'react'
import { ListPaks, PakmanLoad } from '../pak/Pakman'
import styling from '../lib/styling'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'

export default function PageOpenPak() {
  const paks = useMemo(() => ListPaks(), [])
  const { setPakman } = useContext(PakmanStateContext)
  const { popPage, replacePage } = useContext(PageContext)
  const [ message, setMessage ] = useState('')
  const { setQuery } = useContext(QueryBarContext)

  const items = paks.map((name) => <div key={name}>
    <button className={styling.button.formButton} onClick={() => {
      const [pakman, result] = PakmanLoad(name)
      if (result.ov == 'pakrypt.pakmanloadresult:success') {
        setPakman(pakman)
        setQuery('')
        popPage()
      } else {
        setMessage(result.ov)
        if (result.ov == 'pakrypt.pakmanloadresult:notfound') {
          setMessage('Pak not found. Sorry.')
        } else if (result.ov == 'pakrypt.pakmanloadresult:corrupt') {
          setMessage('Pak is corrupt. Sorry.')
        }
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
      <button className={styling.button.formButton} onClick={() => {
        replacePage({
          ov: 'pakrypt.page:newpak',
        })
      }}>New Pak</button>
    </div>}
    { message }
  </div>
}
