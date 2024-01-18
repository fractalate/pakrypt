import { PakEntry } from '../pak/Pak'
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

function entryMatchesQuery(entry: PakEntry, query: string): boolean {
  if (query.length == 0) {
    return false
  }
  return entry.title.toLowerCase().indexOf(query) >= 0
    || getSubtitle(entry).toLowerCase().indexOf(query) >= 0
    || (entry.tags != null && tagsMatchQuery(entry.tags, query))
}

export default function search(query: string, pakman: Pakman): SearchResult[] {
  const showEverything = query === '*' || query === ' '

  query = query.trim().toLowerCase()

  const result: SearchResult[] = []
  let explicitHelp = false
  let explicitVersion = false

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

  if (pakman.ov == 'pakrypt.pakman_state:unlocked') {
    if (pakman.pak.entries != null) {
      for (const entry of pakman.pak.entries) {
        if (showEverything || entryMatchesQuery(entry, query)) {
          result.push(entry)
        }
      }
    }
  }

  if (showEverything || /^(new? ?p?a?s?s?w?o?r?d?|pas?s?w?o?r?d?)$/i.test(query)) {
    if (pakman.ov == 'pakrypt.pakman_state:unlocked') {
      result.push({
        ov: 'pakrypt.command:new_password',
      })
    }
  }

  if (showEverything || /^(new? ?n?o?t?e?|not?e?)$/i.test(query)) {
    if (pakman.ov == 'pakrypt.pakman_state:unlocked') {
      result.push({
        ov: 'pakrypt.command:new_note',
      })
    }
  }

  if (showEverything || /^(new? ?f?i?l?e?|fil?e?)$/i.test(query)) {
    if (pakman.ov == 'pakrypt.pakman_state:unlocked') {
      result.push({
        ov: 'pakrypt.command:new_file',
      })
    }
  }

  if (showEverything || /^(unl?o?c?k? ?p?a?k?|pak?)$/i.test(query)) {
    if (pakman.ov == 'pakrypt.pakman_state:loaded') {
      result.push({
        ov: 'pakrypt.command:unlock',
      })
    }
  }

  if (showEverything || /^(loc?k? ?p?a?k?|pak?)$/i.test(query)) {
    if (pakman.ov == 'pakrypt.pakman_state:unlocked') {
      result.push({
        ov: 'pakrypt.command:lock',
      })
    }
  }

  if (showEverything || /^(ope?n? ?p?a?k?|pak?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:open_pak',
    })
  }

  if (showEverything || /^(cop?y? ?p?a?k?|pak?)$/i.test(query)) {
    if (pakman.ov !== 'pakrypt.pakman_state:unloaded') {
      result.push({
        ov: 'pakrypt.command:copy_pak',
      })
    }
  }

  if (showEverything || /^(new? ?p?a?k?|pak?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:new_pak',
    })
  }

  if (showEverything || /^(clo?s?e? ?p?a?k?|pak?)$/i.test(query)) {
    if (pakman.ov != 'pakrypt.pakman_state:unloaded') {
      result.push({
        ov: 'pakrypt.command:close_pak',
      })
    }
  }

  if (showEverything || /^(del?e?t?e? ?p?a?k?|pak?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:delete_pak',
    })
  }

  if (showEverything || /^(exp?o?r?t? ?p?a?k?|pak?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:export_pak',
    })
  }

  if (showEverything || /^(imp?o?r?t? ?p?a?k?|pak?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:import_pak',
    })
  }

  if (showEverything || /^(cha?n?g?e? ?p?a?s?s?p?h?r?a?s?e?|pas?s?p?h?r?a?s?e?)$/i.test(query)) {
    if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
      result.push({
        ov: 'pakrypt.command:change_passphrase',
      })
    }
  }

  if (showEverything || /^(the?m?e?|dar?k?|lig?h?t?)$/i.test(query)) {
    result.push({
      ov: 'pakrypt.command:theme_switcher',
    })
  }

  if (!explicitHelp && (showEverything || /^(hel?p?)$/i.test(query))) {
    result.push({
      ov: 'pakrypt.command:help',
    })
  }

  if (!explicitVersion && (showEverything || /^(ver?s?i?o?n?)$/i.test(query))) {
    result.push({
      ov: 'pakrypt.command:version',
    })
  }

  if (query === 'enable debug menu') {
    result.push({
      ov: 'pakrypt.command:debug_menu',
    })
  }

  return result
}
