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
  const [ confirmingDeletePak, setConfirmingDeletePak ] = useState(null as null | string)

  const items = useMemo(() => {
    function Entry({ name }: { name: string }) {
      if (name === confirmingDeletePak) {
        return <div className="flex flex-row gap-1">
          <button className={styling.button.formButton + ' w-1/2'} onClick={() => {
            setConfirmingDeletePak(null)
          }}>Keep</button>
          <button className={styling.button.dangerButton + ' w-1/2'} onClick={() => {
            PakmanDelete(name)
            setQuery('')
            popPage()

            if (pakman.ov != 'pakrypt.pakman_state:nil') {
              if (pakman.name === name) {
                setPakman(PakmanClose())
              }
            }
          }}>Delete</button>
        </div>
      }

      return <div key={name} className="flex flex-row gap-1">
        <button className={styling.button.formButton + ' w-1/2'} onClick={() => {
          setConfirmingDeletePak(name)
        }}>{name}</button>
        <div className="w-1/2"></div>
      </div>
    }
    return paks.map((name) => <Entry key={name} name={name} />)
  }, [confirmingDeletePak, paks, popPage, setPakman, setQuery, pakman])

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => popPage()}>Cancel</button>
    { items.length == 0 && <div>
      No paks to delete.
    </div>}
    { items.length > 0 && <div>
      Please select a pak to delete.
    </div>}
    <div className="flex flex-col gap-2">
      { items }
    </div>
    <div>{ message }</div>
  </div>
}
