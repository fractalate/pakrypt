import { ChoosePage } from '.'
import PageEditPassword from './PageEditPassword'
import PageDemo from './PageDemo'
import PageChangePassphrase from './PageChangePassphrase'
import PageCopyPak from './PageCopyPak'
import PageDeletePak from './PageDeletePak'
import PageExportPak from './PageExportPak'
import PageImportPak from './PageImportPak'
import PageMain from './PageMain'
import PageNewNote from './PageNewNote'
import PageNewPak from './PageNewPak'
import PageNewPassword from './PageNewPassword'
import PageOpenPak from './PageOpenPak'

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
  } else if (ov === 'pakrypt.page:importpak') {
    return <PageImportPak />
  }
  return ov // This will cause a type error when the if's above are not exhaustive.
}
