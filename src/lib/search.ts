import { Pak, PakEntry } from '../pak/Pak'

export type SearchResult = SearchResultCommand
                         | PakEntry

export type SearchResultCommand = SearchResultThemeSwitcher
                                | SearchResultNewFile
                                | SearchResultNewNote
                                | SearchResultNewPassword
                                | SearchResultDemo
                                | SearchResultHelp

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

export interface SearchResultDemo {
  ov: 'pakrypt.command:demo',
}

export interface SearchResultHelp {
  ov: 'pakrypt.command:help',
}

function tagsMatchQuery(tags: string[], query: string): boolean {
  for (const tag of tags) {
    if (tag.toLowerCase().indexOf(query) >= 0) {
      return true
    }
  }
  return false
}

function getSubtitle(entry: PakEntry): string {
  if ('subtitle' in entry) {
    return entry.subtitle
  }
  return ''
}

function entryMatchesQuery(entry: PakEntry, query: string): boolean {
  if (query.length == 0) {
    return false
  }
  return entry.title.toLowerCase().indexOf(query) >= 0
    || getSubtitle(entry).toLowerCase().indexOf(query) >= 0
    || (entry.tags != null && tagsMatchQuery(entry.tags, query))
}

export default function search(query: string, pak?: null | Pak): SearchResult[] {
  query = query.trim().toLowerCase()

  const result: SearchResult[] = []

  if (query == '*' || /(hel?p?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:help',
    })
  }

  if (pak != null && pak.entries != null) {
    for (const entry of pak.entries) {
      if (query == '*' || entryMatchesQuery(entry, query)) {
        result.push(entry)
      }
    }
  }

  if (query == '*' || /(new?|pas?s?w?o?r?d?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:new_password',
    })
  }

  if (query == '*' || /(the?m?e?|dar?k?|lig?h?t?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:theme_switcher',
    })
  }

  return result
}
