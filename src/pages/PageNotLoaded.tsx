import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'

export default function PageNotLoaded() {
  const pageContextState = useContext(PageContext)

  function closePage() {
    pageContextState.popPage()
  }

  return <div className={styling.page.regular}>
    The Pak is not loaded. Press the button to close.
    <button className={styling.button.formButton} onClick={() => closePage()}>X</button>
  </div>
}
