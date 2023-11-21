import { PakNote1r0, PakPassword1r0 } from '../pak/Pak'

export type ChoosePage = ChoosePageMain
                       | ChoosePageDemo
                       | ChoosePageNewNote
                       | ChoosePageNewPassword
                       | ChoosePageEditPassword

interface ChoosePageMain {
  ov: 'pakrypt.page:main',
}

interface ChoosePageDemo {
  ov: 'pakrypt.page:demo',
}

interface ChoosePageNewNote {
  ov: 'pakrypt.page:new_note',
  onSave?: (entry: PakNote1r0) => void,
  onCancel?: () => void,
}

interface ChoosePageNewPassword {
  ov: 'pakrypt.page:new_password',
  onSave?: (entry: PakPassword1r0) => void,
  onCancel?: () => void,
}

interface ChoosePageEditPassword {
  ov: 'pakrypt.page:edit_password',
  entry: PakPassword1r0,
  onSave?: (entry: PakPassword1r0) => void,
  onCancel?: () => void,
}

export type ChosenPage = [ChoosePage, string, JSX.Element];

export interface PageContextState {
  pages: ChosenPage[],
  pushPage: (page: ChoosePage) => void,
  popPage: () => void,
}
