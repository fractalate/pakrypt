import { PakNote, PakPassword } from '../pak/Pak'

export type ChoosePage = (
  | ChoosePageMain

  | ChoosePageNewPak
  | ChoosePageOpenPak
  | ChoosePageCopyPak
  | ChoosePageDeletePak
  | ChoosePageExportPak
  | ChoosePageImportPak
  | ChoosePageChangePassphrase

  | ChoosePageNewNote
  | ChoosePageEditNote
  | ChoosePageNewPassword
  | ChoosePageEditPassword
)

interface ChoosePageMain {
  ov: 'pakrypt.page:main',
}

interface ChoosePageNewPak {
  ov: 'pakrypt.page:new_pak',
}

interface ChoosePageOpenPak {
  ov: 'pakrypt.page:open_pak',
}

interface ChoosePageCopyPak {
  ov: 'pakrypt.page:copy_pak',
}

interface ChoosePageDeletePak {
  ov: 'pakrypt.page:delete_pak',
}

interface ChoosePageExportPak {
  ov: 'pakrypt.page:export_pak',
}

interface ChoosePageImportPak {
  ov: 'pakrypt.page:import_pak',
}

interface ChoosePageChangePassphrase {
  ov: 'pakrypt.page:change_passphrase',
}

interface ChoosePageNewNote {
  ov: 'pakrypt.page:new_note',
  onSave?: (entry: PakNote) => void,
  onCancel?: () => void,
}

interface ChoosePageEditNote {
  ov: 'pakrypt.page:edit_note',
  entry: PakNote,
  onSave?: (entry: PakNote) => void,
  onCancel?: () => void,
}

interface ChoosePageNewPassword {
  ov: 'pakrypt.page:new_password',
  onSave?: (entry: PakPassword) => void,
  onCancel?: () => void,
}

interface ChoosePageEditPassword {
  ov: 'pakrypt.page:edit_password',
  entry: PakPassword,
  onSave?: (entry: PakPassword) => void,
  onCancel?: () => void,
}

export type ChosenPage = [ChoosePage, string, JSX.Element];

export interface PageContextState {
  pages: ChosenPage[],
  pushPage: (page: ChoosePage) => void,
  popPage: () => void,
  replacePage: (page: ChoosePage) => void,
}
