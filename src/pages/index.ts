interface PageContextState {
  pages: ChosenPage[],
  pushPage: (page: ChoosePage) => void,
  popPage: () => void,
}

type ChoosePage = ChoosePageMain
                | ChoosePageNewNote
                | ChoosePageNewPassword

interface ChoosePageMain {
  ov: 'pakrypt.page:main',
}

interface ChoosePageNewNote {
  ov: 'pakrypt.page:newnote',
}

interface ChoosePageNewPassword {
  ov: 'pakrypt.page:newpassword',
}

type ChosenPage = [ChoosePage, string, JSX.Element];
