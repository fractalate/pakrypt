import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'

export default function PageErrorNotUnlocked() {
  const pageContextState = useContext(PageContext)

  function closePage() {
    pageContextState.popPage()
  }

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => closePage()}>Cancel</button>
    <div>The pak is not unlocked. Press the button to close.</div>
  </div>
}
