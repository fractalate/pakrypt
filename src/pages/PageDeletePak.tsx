import { useContext, useMemo, useState } from 'react'
import { ListPaks, PakmanClose, PakmanDelete } from '../pak/Pakman'
import styling from '../lib/styling'
import { PageContext, PakmanStateContext, QueryBarContext } from '../Contexts'

export default function PageDeletePak() {
  const paks = useMemo(() => ListPaks(), [])
  const { pakman, setPakman } = useContext(PakmanStateContext)
  const { popPage } = useContext(PageContext)
  const [ message ] = useState('')
  const { setQuery } = useContext(QueryBarContext)

  // TODO: These need confirms.
  const items = paks.map((name) => <div key={name}>
    <button className={styling.button.formButton} onClick={() => {
      PakmanDelete(name)
      setQuery('')
      popPage()

      if (pakman.ov != 'pakrypt.pakmanstate:unloaded') {
        if (pakman.name === name) {
          setPakman(PakmanClose())
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
    </div>}
    { message }
  </div>
}
