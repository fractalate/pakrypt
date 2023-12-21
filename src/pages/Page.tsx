import { ChoosePage } from '.'
import PageMain from './PageMain'
import PageNewNote from './PageNewNote'
import PageNewPassword from './PageNewPassword'
import PageEditPassword from './PageEditPassword'
import PageDemo from './PageDemo'
import PageOpenPak from './PageOpenPak'
import PageNewPak from './PageNewPak'
import PageDeletePak from './PageDeletePak'
import PageCopyPak from './PageCopyPak'
import PageChangePassphrase from './PageChangePassphrase'
import PageExportPak from './PageExportPak'

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
  } else if (ov === 'pakrypt.page:openpak') {
    return <PageOpenPak />
  } else if (ov === 'pakrypt.page:copypak') {
    return <PageCopyPak />
  } else if (ov === 'pakrypt.page:newpak') {
    return <PageNewPak />
  } else if (ov === 'pakrypt.page:deletepak') {
    return <PageDeletePak />
  } else if (ov === 'pakrypt.page:changepassphrase') {
    return <PageChangePassphrase />
  } else if (ov === 'pakrypt.page:exportpak') {
    return <PageExportPak />
  }
  return ov // This will cause a type error when the if's above are not exhaustive.
}
