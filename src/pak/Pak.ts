// ov - object version
// id - identification
import { v4 as uuid } from 'uuid'

// 2023-11-26 -- Redo this so it's functional style copying of objects so the UI can work better.

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
  ov: 'parypt.block:1.0',
  id: string,
  data: string, // base64 encoded binary data.
}

export function NewPak(): Pak {
  return {
    ov: 'pakrypt.pak:1.0',
    id: uuid(),
  }
}

function calculateSize(data: string): number {
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

function addEntry(pak: Pak, entry: PakEntry) {
  if (pak.entries == null) {
    pak.entries = []
  }
  pak.entries.push(entry)
}

function replaceEntry(pak: Pak, entry: PakEntry) {
  if (pak.entries != null) {
    for (let i = 0; i < pak.entries.length; ++i) {
      if (pak.entries[i].id === entry.id) {
        pak.entries[i] = entry
      }
    }
  }
}

function addBlock(pak: Pak, block: PakBlock) {
  if (pak.blocks == null) {
    pak.blocks = []
  }
  pak.blocks.push(block)
}

export interface FileFields {
  title: string,
  data: string, // base64 encoded binary data.
  tags?: string[],
}

export function CreateFile(pak: Pak, file: FileFields): PakFile {
  const blockref: PakFile_BlockReference = {
    ov: 'pakrypt.blockref:1.0',
    id: uuid(),
    size: calculateSize(file.data),
  }

  const entry: PakFile = {
    ov: 'pakrypt.file:1.0',
    id: uuid(),
    blocks: [blockref],
    title: file.title,
    tags: structuredClone(file.tags),
  }

  const block: PakBlock = {
    ov: 'parypt.block:1.0',
    id: blockref.id,
    data: file.data,
  }

  addBlock(pak, block)
  addEntry(pak, entry)

  return entry
}

export interface NoteFields {
  title: string,
  subtitle: string,
  note: string,
  tags?: string[],
}

export function CreateNote(pak: Pak, note: NoteFields): PakNote {
  const entry: PakNote = {
    ov: 'pakrypt.note:1.0',
    id: uuid(),
    ...structuredClone(note),
  }
  addEntry(pak, entry)
  return entry
}

export interface PasswordFields {
  title: string,
  subtitle: string,
  username: string,
  password: string,
  note?: string,
  tags?: string[],
}

// TODO: Work on the return type here, it should be something, but not a particular version.
export function CreatePassword(pak: Pak, password: PasswordFields): [Pak, PakPassword] {
  if (pak.ov === 'pakrypt.pak:1.0') {
    return CreatePassword1r0(pak, password)
  }
  return pak.ov // so we return never when the ifs are exhaustive
}

export function CreatePassword1r0(pak: Pak, password: PasswordFields): [Pak, PakPassword] {
  pak = structuredClone(pak)
  const entry: PakPassword = {
    ov: 'pakrypt.password:1.0',
    id: uuid(),
    ...structuredClone(password),
  }
  addEntry(pak, entry)
  return [pak, entry]
}

export function UpdatePassword(pak: Pak, id: string, password: PasswordFields): Pak {
  pak = structuredClone(pak)
  if (pak.entries != null) {
    const entry: PakPassword = {
      ov: 'pakrypt.password:1.0',
      id,
      ...structuredClone(password),
    }
    replaceEntry(pak, entry)
  }
  return pak
}

export function DeleteBlock(pak: Pak, id: string): Pak {
  pak = structuredClone(pak)
  if (pak.blocks != null) {
    const blocks = []
    for (const block of pak.blocks) {
      if (block.id !== id) {
        blocks.push(block)
      }
    }
    pak.blocks = blocks.length == 0 ? undefined : blocks
  }
  return pak
}

export function DeleteEntry(pak: Pak, id: string): [Pak, null | PakEntry] {
  pak = structuredClone(pak)
  let result: null | PakEntry = null
  if (pak.entries != null) {
    const entries = []
    for (const entry of pak.entries) {
      if (entry.id === id) {
        result = entry
      } else {
        entries.push(entry)
      }
    }
    pak.entries = entries.length == 0 ? undefined : entries
    if (result != null && result.ov == 'pakrypt.file:1.0') {
      for (const block of result.blocks) {
        DeleteBlock(pak, block.id)
      }
    }
  }
  return [pak, result]
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
