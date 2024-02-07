import { IsFileEntry, IsNoteEntry, IsPasswordEntry, PakEntry } from '../pak/Pak'
import { Pakman } from '../pak/Pakman'

export type SearchResult = (
  | SearchResultCommand
  | PakEntry
)

export type SearchResultCommand = (
  | SearchResultLock
  | SearchResultUnlock

  | SearchResultNewFile
  | SearchResultNewNote
  | SearchResultNewPassword

  | SearchResultNewPak
  | SearchResultOpenPak
  | SearchResultClosePak
  | SearchResultCopyPak
  | SearchResultDeletePak
  | SearchResultExportPak
  | SearchResultImportPak
  | SearchResultChangePassphrase

  | SearchResultHelp
  | SearchResultVersion
  | SearchResultThemeSwitcher

  | SearchResultDebugMenu
)

export interface SearchResultLock {
  ov: 'pakrypt.command:lock',
}

export interface SearchResultUnlock {
  ov: 'pakrypt.command:unlock',
}

export interface SearchResultNewFile {
  ov: 'pakrypt.command:new_file',
}

export interface SearchResultNewNote {
  ov: 'pakrypt.command:new_note',
}

export interface SearchResultNewPassword {
  ov: 'pakrypt.command:new_password',
}

export interface SearchResultNewPak {
  ov: 'pakrypt.command:new_pak',
}

export interface SearchResultOpenPak {
  ov: 'pakrypt.command:open_pak',
}

export interface SearchResultClosePak {
  ov: 'pakrypt.command:close_pak',
}

export interface SearchResultCopyPak {
  ov: 'pakrypt.command:copy_pak',
}

export interface SearchResultDeletePak {
  ov: 'pakrypt.command:delete_pak',
}

export interface SearchResultExportPak {
  ov: 'pakrypt.command:export_pak',
}

export interface SearchResultImportPak {
  ov: 'pakrypt.command:import_pak',
}

export interface SearchResultChangePassphrase {
  ov: 'pakrypt.command:change_passphrase',
}

export interface SearchResultHelp {
  ov: 'pakrypt.command:help',
}

export interface SearchResultVersion {
  ov: 'pakrypt.command:version',
}

export interface SearchResultThemeSwitcher {
  ov: 'pakrypt.command:theme_switcher',
}

export interface SearchResultDebugMenu {
  ov: 'pakrypt.command:debug_menu',
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

function entryMatchesQuery(entry: PakEntry, query: string, wildMatch: boolean, justFiles: boolean, justNotes: boolean, justPasswords: boolean): boolean {
  if (justFiles && !IsFileEntry(entry)) {
    return false
  }
  if (justNotes && !IsNoteEntry(entry)) {
    return false
  }
  if (justPasswords && !IsPasswordEntry(entry)) {
    return false
  }
  if (wildMatch) {
    return true
  }
  if (query.length == 0) {
    return false
  }
  return entry.title.toLowerCase().indexOf(query) >= 0
    || getSubtitle(entry).toLowerCase().indexOf(query) >= 0
    || (entry.tags != null && tagsMatchQuery(entry.tags, query))
}

export default function search(query: string, pakman: Pakman): SearchResult[] {
  const justFiles = /^\s*files?($|\s)/i.test(query)
  const justNotes = /^\s*notes?($|\s)/i.test(query)
  const justPasswords = /^\s*passw?o?r?d?s?($|\s)/i.test(query)
  if (justFiles) {
    query = query.replace(/^\s*files?/i, '')
    if (query.length == 0) {
      query = '*'
    }
  } else if (justNotes) {
    query = query.replace(/^\s*notes?/i, '')
    if (query.length == 0) {
      query = '*'
    }
  } else if (justPasswords) {
    query = query.replace(/^\s*passw?o?r?d?s?/i, '')
    if (query.length == 0) {
      query = '*'
    }
  }
  // If you're not searching for a particular kind of entry, it'll
  // include command tiles.
  const includeCommands = !justFiles && !justNotes && !justPasswords
  // The help tile calls out * and space to search everything, but it
  // uses an underscore to show the space; be kind and allow underscore
  // to find everything too. The regex matches a single * or _.
  const wildMatch = /^\s*[_*]\s*$/i.test(query) || query === ' '

  query = query.trim().toLowerCase()

  const result: SearchResult[] = []
  let explicitHelp = false
  let explicitVersion = false

  if (includeCommands) {
    if (/^(help)$/i.test(query)) {
      explicitHelp = true
      result.push({
        ov: 'pakrypt.command:help',
      })
    }

    if (/^(version)$/i.test(query)) {
      explicitVersion = true
      result.push({
        ov: 'pakrypt.command:version',
      })
    }
  }

  if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
    if (pakman.pak.entries != null) {
      for (const entry of pakman.pak.entries) {
        if (entryMatchesQuery(entry, query, wildMatch, justFiles, justNotes, justPasswords)) {
          result.push(entry)
        }
      }
    }
  }

  if (includeCommands) {
    if (wildMatch || /^(new? ?p?a?s?s?w?o?r?d?|pas?s?w?o?r?d?)$/i.test(query)) {
      if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
        result.push({
          ov: 'pakrypt.command:new_password',
        })
      }
    }

    if (wildMatch || /^(new? ?n?o?t?e?|not?e?)$/i.test(query)) {
      if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
        result.push({
          ov: 'pakrypt.command:new_note',
        })
      }
    }

    if (wildMatch || /^(new? ?f?i?l?e?|fil?e?)$/i.test(query)) {
      if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
        result.push({
          ov: 'pakrypt.command:new_file',
        })
      }
    }

    if (wildMatch || /^(unl?o?c?k? ?p?a?k?|pak?)$/i.test(query)) {
      if (pakman.ov === 'pakrypt.pakman_state:locked') {
        result.push({
          ov: 'pakrypt.command:unlock',
        })
      }
    }

    if (wildMatch || /^(loc?k? ?p?a?k?|pak?)$/i.test(query)) {
      if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
        result.push({
          ov: 'pakrypt.command:lock',
        })
      }
    }

    // "open pak" or "open a pak"
    if (wildMatch || /^(ope?n? ?a? ?p?a?k?|pak?)$/i.test(query)) {
      result.push({
        ov: 'pakrypt.command:open_pak',
      })
    }

    // "close pak" or "close a pak"
    if (wildMatch || /^(cop?y? ?a? ?p?a?k?|pak?)$/i.test(query)) {
      if (pakman.ov !== 'pakrypt.pakman_state:nil') {
        result.push({
          ov: 'pakrypt.command:copy_pak',
        })
      }
    }

    if (wildMatch || /^(new? ?p?a?k?|pak?)$/i.test(query)) {
      result.push({
        ov: 'pakrypt.command:new_pak',
      })
    }

    if (wildMatch || /^(clo?s?e? ?p?a?k?|pak?)$/i.test(query)) {
      if (pakman.ov != 'pakrypt.pakman_state:nil') {
        result.push({
          ov: 'pakrypt.command:close_pak',
        })
      }
    }

    // "delete pak" or "delete a pak"
    if (wildMatch || /^(del?e?t?e? ?a? ?p?a?k?|pak?)$/i.test(query)) {
      result.push({
        ov: 'pakrypt.command:delete_pak',
      })
    }

    // "export pak" or "export a pak"
    if (wildMatch || /^(exp?o?r?t? ?a? ?p?a?k?|pak?)$/i.test(query)) {
      result.push({
        ov: 'pakrypt.command:export_pak',
      })
    }

    // "import pak" or "import a pak"
    if (wildMatch || /^(imp?o?r?t? ?a? ?p?a?k?|pak?)$/i.test(query)) {
      result.push({
        ov: 'pakrypt.command:import_pak',
      })
    }

    if (wildMatch || /^(cha?n?g?e? ?p?a?s?s?p?h?r?a?s?e?|pas?s?p?h?r?a?s?e?)$/i.test(query)) {
      if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
        result.push({
          ov: 'pakrypt.command:change_passphrase',
        })
      }
    }

    if (wildMatch || /^(the?m?e?|dar?k?|lig?h?t?)$/i.test(query)) {
      result.push({
        ov: 'pakrypt.command:theme_switcher',
      })
    }

    if (!explicitHelp && (wildMatch || /^(hel?p?)$/i.test(query))) {
      result.push({
        ov: 'pakrypt.command:help',
      })
    }

    if (!explicitVersion && (wildMatch || /^(ver?s?i?o?n?)$/i.test(query))) {
      result.push({
        ov: 'pakrypt.command:version',
      })
    }

    if (query === 'enable debug menu') {
      result.push({
        ov: 'pakrypt.command:debug_menu',
      })
    }
  }

  return result
}
