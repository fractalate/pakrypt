// ov - object version
// id - identification
import { v4 as uuid } from 'uuid'

export interface Pak {
  ov: 'pakrypt.pak:1.0',
  id: string,
  entries?: PakEntry[],
  blocks?: PakBlock[],
}

export type PakEntry = (
  | PakFile
  | PakNote
  | PakPassword
)

export interface PakFile {
  ov: 'pakrypt.file:1.0',
  id: string,
  title: string,
  subtitle: string,
  blocks: PakFile_BlockReference[],
  tags?: string[],
}

export interface PakFile_BlockReference {
  ov: 'pakrypt.blockref:1.0',
  id: string, // Matches the id of the corresponding 'pakrypt.file:1.0' object.
  size: number,
  pakid?: string, // Matches the id of the containing 'pakrypt.pak:1.0' object.
}

export interface PakNote {
  ov: 'pakrypt.note:1.0',
  id: string,
  title: string,
  subtitle: string,
  note: string,
  tags?: string[],
}

export interface PakPassword {
  ov: 'pakrypt.password:1.0',
  id: string,
  title: string,
  subtitle: string,
  username: string,
  password: string,
  note?: string,
  tags?: string[],
}

export interface PakBlock {
  ov: 'pakrypt.block:1.0',
  id: string,
  data: string, // base64 encoded binary data.
}

export function NewPak(): Pak {
  return {
    ov: 'pakrypt.pak:1.0',
    id: uuid(),
  }
}

function calculateSizeEncodedByBase64(data: string): number {
  const encodedLength = data.replace(/=*$/, '').length
  let remainder = encodedLength % 4 // Measured in bytes in the encoded data after the final full 4-byte block.
  if (remainder == 1) {
    throw new Error('Invalid base64 encoded data. Check the length of encoded segments.')
  } else if (remainder > 1) {
    --remainder // Now it measures bytes in the decoded data.
  }
  const result = Math.floor(encodedLength / 4) * 3 + remainder
  return result
}

function addEntry(pak: Pak, entry: PakEntry): Pak {
  return {
    ov: 'pakrypt.pak:1.0',
    id: pak.id,
    entries: pak.entries == null ? [entry] : [...pak.entries, entry],
    blocks: pak.blocks,
  }
}

function replaceEntry(pak: Pak, entry: PakEntry): Pak {
  const entries = pak.entries == null ? undefined : [...pak.entries]
  if (entries != null) {
    for (let i = 0; i < entries.length; ++i) {
      if (entries[i].id === entry.id) {
        entries[i] = entry
      }
    }
  }
  return {
    ov: 'pakrypt.pak:1.0',
    id: pak.id,
    entries,
    blocks: pak.blocks,
  }
}

function removeEntry(pak: Pak, id: string): Pak {
  let entries = pak.entries
  if (entries != null) {
    entries = entries.filter((entry) => entry.id != id)
    if (entries.length == 0) {
      entries = undefined
    }
  }  
  return {
    ov: 'pakrypt.pak:1.0',
    id: pak.id,
    entries,
    blocks: pak.blocks,
  }
}

function addBlock(pak: Pak, block: PakBlock): Pak {
  return {
    ov: 'pakrypt.pak:1.0',
    id: pak.id,
    entries: pak.entries,
    blocks: pak.blocks == null ? [block] : [...pak.blocks, block],
  }
}

function removeBlock(pak: Pak, id: string): Pak {
  let blocks = pak.blocks
  if (blocks != null) {
    blocks = blocks.filter((block) => block.id != id)
    if (blocks.length == 0) {
      blocks = undefined
    }
  }  
  return {
    ov: 'pakrypt.pak:1.0',
    id: pak.id,
    entries: pak.entries,
    blocks,
  }
}

export interface FileFields {
  title: string,
  subtitle: string,
  data: string, // base64 encoded binary data.
  tags?: string[],
}

export function CreateFile(pak: Pak, file: FileFields): [Pak, PakFile] {
  const blockref: PakFile_BlockReference = {
    ov: 'pakrypt.blockref:1.0',
    id: uuid(),
    size: calculateSizeEncodedByBase64(file.data),
  }

  const entry: PakFile = {
    ov: 'pakrypt.file:1.0',
    id: uuid(),
    blocks: [blockref],
    title: file.title,
    subtitle: file.subtitle,
    tags: structuredClone(file.tags),
  }

  const block: PakBlock = {
    ov: 'pakrypt.block:1.0',
    id: blockref.id,
    data: file.data,
  }

  pak = addBlock(pak, block)
  pak = addEntry(pak, entry)

  return [pak, entry]
}

export function UpdateFile(pak: Pak, id: string, file: FileFields): Pak {
  if (pak.entries == null) {
    return pak
  }

  const blockref: PakFile_BlockReference = {
    ov: 'pakrypt.blockref:1.0',
    id: uuid(),
    size: calculateSizeEncodedByBase64(file.data),
  }

  const entry: PakFile = {
    ov: 'pakrypt.file:1.0',
    id: uuid(),
    blocks: [blockref],
    title: file.title,
    subtitle: file.subtitle,
    tags: structuredClone(file.tags),
  }

  const block: PakBlock = {
    ov: 'pakrypt.block:1.0',
    id: blockref.id,
    data: file.data,
  }

  pak = DeleteEntry(pak, id)
  pak = addBlock(pak, block)
  pak = addEntry(pak, entry)

  return pak
}

export interface NoteFields {
  title: string,
  subtitle: string,
  note: string,
  tags?: string[],
}

export function CreateNote(pak: Pak, note: NoteFields): [Pak, PakNote] {
  const entry: PakNote = {
    ov: 'pakrypt.note:1.0',
    id: uuid(),
    ...structuredClone(note),
  }
  pak = addEntry(pak, entry)
  return [pak, entry]
}

export function UpdateNote(pak: Pak, id: string, note: NoteFields): Pak {
  if (pak.entries == null) {
    return pak
  }
  const entry: PakNote = {
    ov: 'pakrypt.note:1.0',
    id,
    title: note.title,
    subtitle: note.subtitle,
    note: note.note,
    tags: note.tags == null ? note.tags : [...note.tags],
  }
  pak = replaceEntry(pak, entry)
  return pak
}

export interface PasswordFields {
  title: string,
  subtitle: string,
  username: string,
  password: string,
  note?: string,
  tags?: string[],
}

export function CreatePassword(pak: Pak, password: PasswordFields): [Pak, PakPassword] {
  const entry: PakPassword = {
    ov: 'pakrypt.password:1.0',
    id: uuid(),
    title: password.title,
    subtitle: password.subtitle,
    username: password.username,
    password: password.password,
    note: password.note,
    tags: password.tags == null ? password.tags : [...password.tags],
  }
  pak = addEntry(pak, entry)
  return [pak, entry]
}

export function UpdatePassword(pak: Pak, id: string, password: PasswordFields): Pak {
  if (pak.entries == null) {
    return pak
  }
  const entry: PakPassword = {
    ov: 'pakrypt.password:1.0',
    id,
    title: password.title,
    subtitle: password.subtitle,
    username: password.username,
    password: password.password,
    note: password.note,
    tags: password.tags == null ? password.tags : [...password.tags],
  }
  pak = replaceEntry(pak, entry)
  return pak
}

export function DeleteBlock(pak: Pak, id: string): Pak {
  return removeBlock(pak, id)
}

export function DeleteEntry(pak: Pak, id: string): Pak {
  if (pak.entries != null) {
    for (const entry of pak.entries) {
      if (entry.id === id && entry.ov === 'pakrypt.file:1.0') {
        for (const block of entry.blocks) {
          pak = removeBlock(pak, block.id)
        }
      }
    }
  }
  pak = removeEntry(pak, id)
  return pak
}

export function FindEntry(pak: Pak, id: string): null | PakEntry {
  if (pak.entries == null) {
    return null
  }
  for (const entry of pak.entries) {
    if (entry.id === id) {
      return entry
    }
  }
  return null
}

export function FindBlock(pak: Pak, id: string): null | PakBlock {
  if (pak.blocks == null) {
    return null
  }
  for (const block of pak.blocks) {
    if (block.id === id) {
      return block
    }
  }
  return null
}
