interface PageContextState {
  page: ChoosePage,
  setPage: (page: ChoosePage) => void,
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
