import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'

export default function PageErrorNotOpen() {
  const pageContextState = useContext(PageContext)

  function closePage() {
    pageContextState.popPage()
  }

  return <div className={styling.page.regular}>
    <button className={styling.button.formButton} onClick={() => closePage()}>Cancel</button>
    <div>The Pak is not open. Press the button to go back.</div>
  </div>
}
