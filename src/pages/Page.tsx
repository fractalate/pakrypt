import { useContext } from 'react'
import { PageContext } from '../contexts'
import PageMain from './PageMain'
import PageNewNote from './PageNewNote'
import PageNewPassword from './PageNewPassword'

export default function Page(): JSX.Element {
  const pageContextState = useContext(PageContext)
  const ov = pageContextState.page.ov
  if (ov === 'pakrypt.page:main') {
    return <PageMain />
  } else if (ov === 'pakrypt.page:newnote') {
    return <PageNewNote />
  } else if (ov === 'pakrypt.page:newpassword') {
    return <PageNewPassword />
  }
  return ov // This will cause a type error when the if's above are not exhaustive.
}
