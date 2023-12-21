import { PakNote, PakPassword } from '../pak/Pak'

export type ChoosePage = (
  | ChoosePageMain
  | ChoosePageDemo
  | ChoosePageNewNote
  | ChoosePageNewPassword
  | ChoosePageEditPassword
  | ChoosePageOpenPak
  | ChoosePageCopyPak
  | ChoosePageNewPak
  | ChoosePageDeletePak
  | ChoosePageExportPak
  | ChoosePageChangePassphrase
)

interface ChoosePageMain {
  ov: 'pakrypt.page:main',
}

interface ChoosePageDemo {
  ov: 'pakrypt.page:demo',
}

interface ChoosePageNewNote {
  ov: 'pakrypt.page:new_note',
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

interface ChoosePageOpenPak {
  ov: 'pakrypt.page:openpak',
}

interface ChoosePageCopyPak {
  ov: 'pakrypt.page:copypak',
}

interface ChoosePageNewPak {
  ov: 'pakrypt.page:newpak',
}

interface ChoosePageDeletePak {
  ov: 'pakrypt.page:deletepak',
}

interface ChoosePageExportPak {
  ov: 'pakrypt.page:exportpak',
}

interface ChoosePageChangePassphrase {
  ov: 'pakrypt.page:changepassphrase',
}

export type ChosenPage = [ChoosePage, string, JSX.Element];

export interface PageContextState {
  pages: ChosenPage[],
  pushPage: (page: ChoosePage) => void,
  popPage: () => void,
  replacePage: (page: ChoosePage) => void,
}
