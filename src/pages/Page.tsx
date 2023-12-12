import PageMain from './PageMain'
import PageNewNote from './PageNewNote'
import PageNewPassword from './PageNewPassword'
import PageEditPassword from './PageEditPassword'
import PageDemo from './PageDemo'
import { ChoosePage } from '.'

export default function Page({
  page,
}: {
  page: ChoosePage,
}): JSX.Element {
  const ov = page.ov
  if (ov === 'pakrypt.page:main') {
    return <PageMain />
  } else if (ov === 'pakrypt.page:new_note') {
    return <PageNewNote />
  } else if (ov === 'pakrypt.page:new_password') {
    return <PageNewPassword />
  } else if (ov === 'pakrypt.page:edit_password') {
    return <PageEditPassword entry={ page.entry } />
  } else if (ov === 'pakrypt.page:demo') {
    return <PageDemo />
  }
  return ov // This will cause a type error when the if's above are not exhaustive.
}
