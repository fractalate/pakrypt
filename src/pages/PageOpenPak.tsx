import { useContext, useMemo, useState } from 'react'
import { ListPaks, PakmanOpen } from '../pak/Pakman'
import styling from '../lib/styling'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'
import { toUserMessage } from '../pak/Text'

export default function PageOpenPak() {
  const paks = useMemo(() => ListPaks(), [])
  const { setPakman } = useContext(PakmanStateContext)
  const { popPage, replacePage } = useContext(PageContext)
  const [ message, setMessage ] = useState('')
  const { setQuery } = useContext(QueryBarContext)

  const items = paks.map((name) => <div key={name} className="flex flex-col">
    <button className={styling.button.formButton + ' w-1/2'} onClick={() => {
      const [pakman, result] = PakmanOpen(name)
      if (result.ov === 'pakrypt.pakman_open_result:success') {
        setPakman(pakman)
        setQuery('')
        popPage()
      } else {
        setMessage(toUserMessage(result))
      }
    }}>{name}</button>
  </div>)

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => popPage()}>Cancel</button>
    { items.length == 0 && <div>
      No paks to open.
    </div>}
    { items.length > 0 && <>
      <div>
        Please select a pak to open.
      </div>
      <div className="flex flex-col gap-2">
        { items }
      </div>
    </>}
    {message && <div>{ message }</div>}
    { items.length == 0 && <button className={styling.button.formButton} onClick={() => {
      replacePage({
        ov: 'pakrypt.page:new_pak',
      })
    }}>New Pak</button>}
  </div>
}
