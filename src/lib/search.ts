import { PakEntry } from '../pak/Pak'
import { Pakman } from '../pak/Pakman'

export type SearchResult = SearchResultCommand
                         | PakEntry

// TODO: Order these.
export type SearchResultCommand = SearchResultThemeSwitcher
                                | SearchResultNewFile
                                | SearchResultNewNote
                                | SearchResultNewPassword
                                | SearchResultDemo
                                | SearchResultHelp
                                | SearchResultLock
                                | SearchResultUnlock
                                | SearchResultNewPak
                                | SearchResultOpenPak
                                | SearchResultClosePak
                                | SearchResultDeletePak

export interface SearchResultThemeSwitcher {
  ov: 'pakrypt.command:theme_switcher',
}

export interface SearchResultLock {
  ov: 'pakrypt.command:lock',
}

export interface SearchResultUnlock {
  ov: 'pakrypt.command:unlock',
}

export interface SearchResultNewPak {
  ov: 'pakrypt.command:newpak',
}

export interface SearchResultOpenPak {
  ov: 'pakrypt.command:openpak',
}

export interface SearchResultClosePak {
  ov: 'pakrypt.command:closepak',
}

export interface SearchResultDeletePak {
  ov: 'pakrypt.command:deletepak',
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

export default function search(query: string, pakman: Pakman): SearchResult[] {
  query = query.trim().toLowerCase()

  const result: SearchResult[] = []
  let explicitHelp = false

  if (/^(help)$/i.test(query)) {
    explicitHelp = true
    result.push({
      ov: 'pakrypt.command:help',
    })
  }

  if (pakman.ov == 'pakrypt.pakmanstate:unlocked') {
    if (pakman.pak.entries != null) {
      for (const entry of pakman.pak.entries) {
        if (query == '*' || entryMatchesQuery(entry, query)) {
          result.push(entry)
        }
      }
    }
  }

  if (query == '*' || /^(new? ?p?a?s?s?w?o?r?d?|pas?s?w?o?r?d?)$/i.test(query)) {
    if (pakman.ov == 'pakrypt.pakmanstate:unlocked') {
      result.push({
        ov: 'pakrypt.command:new_password',
      })
    }
  }

  if (query == '*' || /^(unl?o?c?k? ?p?a?k?|pak?)$/i.test(query)) {
    if (pakman.ov == 'pakrypt.pakmanstate:loaded') {
      result.push({
        ov: 'pakrypt.command:unlock',
      })
    }
  }

  if (query == '*' || /^(loc?k? ?p?a?k?|pak?)$/i.test(query)) {
    if (pakman.ov == 'pakrypt.pakmanstate:unlocked') {
      result.push({
        ov: 'pakrypt.command:lock',
      })
    }
  }

  if (query == '*' || /^(ope?n? ?p?a?k?|pak?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:openpak',
    })
  }

  if (query == '*' || /^(new? ?p?a?k?|pak?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:newpak',
    })
  }

  if (query == '*' || /^(clo?s?e? ?p?a?k?|pak?)$/i.test(query)) {
    if (pakman.ov != 'pakrypt.pakmanstate:unloaded') {
      result.push({
        ov: 'pakrypt.command:closepak',
      })
    }
  }

  if (query == '*' || /^(del?e?t?e? ?p?a?k?|pak?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:deletepak',
    })
  }

  if (query == '*' || /^(the?m?e?|dar?k?|lig?h?t?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:theme_switcher',
    })
  }

  if (!explicitHelp && (query == '*' || /^(hel?p?)$/i.test(query))) {
    result.push({
      ov: 'pakrypt.command:help',
    })
  }

  return result
}
