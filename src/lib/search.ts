import { Pak, Pak1r0_Entry } from './pak'

export type SearchResult = SearchResultCommand
                         | Pak1r0_Entry

export type SearchResultCommand = SearchResultThemeSwitcher
                                | SearchResultNewFile
                                | SearchResultNewNote
                                | SearchResultNewPassword

export interface SearchResultThemeSwitcher {
  ov: 'pakrypt.command:theme_switcher',
}

export interface SearchResultNewFile {
  ov: 'pakrypt.command:new_note',
}

export interface SearchResultNewNote {
  ov: 'pakrypt.command:new_file',
}

export interface SearchResultNewPassword {
  ov: 'pakrypt.command:new_password',
}

export default function search(query: string, _pak?: null | Pak): SearchResult[] {
  const result: SearchResult[] = []

  result.push({
    ov: 'pakrypt.command:theme_switcher',
  })

  if (query.length > 0) {
    result.push({
      ov: 'pakrypt.command:new_file',
    })
    result.push({
      ov: 'pakrypt.command:new_note',
    })
    result.push({
      ov: 'pakrypt.command:new_password',
    })
    result.push({
      ov: 'pakrypt.password:1.0',
      id: 'myid',
      title: 'My Site is Cool',
      subtitle: '',
      username: 'My User',
      password: 'My Pass',
    })
  }

  return result
}
