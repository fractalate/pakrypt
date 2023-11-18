import { PakPassword1r0 } from "../lib/pak";

export type ChoosePage = ChoosePageMain
                       | ChoosePageNewNote
                       | ChoosePageNewPassword
                       | ChoosePageEditPassword

interface ChoosePageMain {
  ov: 'pakrypt.page:main',
}

interface ChoosePageNewNote {
  ov: 'pakrypt.page:new_note',
}

interface ChoosePageNewPassword {
  ov: 'pakrypt.page:new_password',
}

interface ChoosePageEditPassword {
  ov: 'pakrypt.page:edit_password',
  entry: PakPassword1r0,
}

export type ChosenPage = [ChoosePage, string, JSX.Element];

export interface PageContextState {
  pages: ChosenPage[],
  pushPage: (page: ChoosePage) => void,
  popPage: () => void,
}
