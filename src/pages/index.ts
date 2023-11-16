type ChoosePage = ChoosePageMain
                | ChoosePageNewNote
                | ChoosePageNewPassword

interface ChoosePageMain {
  ov: 'pakrypt.page:main',
}

interface ChoosePageNewNote {
  ov: 'pakrypt.page:new_note',
}

interface ChoosePageNewPassword {
  ov: 'pakrypt.page:new_password',
}

type ChosenPage = [ChoosePage, string, JSX.Element];

interface PageContextState {
  pages: ChosenPage[],
  pushPage: (page: ChoosePage) => void,
  popPage: () => void,
}
