import { ChoosePage } from '.'
import PageEditPassword from './PageEditPassword'
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
import PageEditNote from './PageEditNote'
import PageNewFile from './PageNewFile'
import PageEditFile from './PageEditFile'

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
  } else if (ov === 'pakrypt.page:edit_note') {
    return <PageEditNote entry={ page.entry } />
  } else if (ov === 'pakrypt.page:new_password') {
    return <PageNewPassword />
  } else if (ov === 'pakrypt.page:edit_password') {
    return <PageEditPassword entry={ page.entry } />
  } else if (ov === 'pakrypt.page:new_file') {
    return <PageNewFile />
  } else if (ov === 'pakrypt.page:edit_file') {
    return <PageEditFile entry={ page.entry } />
  } else if (ov === 'pakrypt.page:open_pak') {
    return <PageOpenPak />
  } else if (ov === 'pakrypt.page:copy_pak') {
    return <PageCopyPak />
  } else if (ov === 'pakrypt.page:new_pak') {
    return <PageNewPak />
  } else if (ov === 'pakrypt.page:delete_pak') {
    return <PageDeletePak />
  } else if (ov === 'pakrypt.page:change_passphrase') {
    return <PageChangePassphrase />
  } else if (ov === 'pakrypt.page:export_pak') {
    return <PageExportPak />
  } else if (ov === 'pakrypt.page:import_pak') {
    return <PageImportPak />
  }
  return ov // This will cause a type error when the if's above are not exhaustive.
}
