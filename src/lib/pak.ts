// ov - object version
// id - identification
import { v4 as uuid } from 'uuid';

export interface Pak1r0 {
  ov: 'pakrypt.pak:1.0';
  id: string;
  entries?: Pak1r0_Entry[];
  blocks?: PakBlock1r0[];
}

export type Pak = Pak1r0;

export type Pak1r0_Entry = PakFile1r0
                         | PakNote1r0
                         | PakPassword1r0
                         ;

export interface PakFile1r0 {
  ov: 'pakrypt.file:1.0';
  id: string;
  title: string;
  blocks: PakFile1r0_BlockReference[];
  tags?: string[];
}

export interface PakFile1r0_BlockReference {
  ov: 'pakrypt.blockref:1.0',
  id: string; // Matches the id of the corresponding 'pakrypt.file:1.0' object.
  size: number;
  pakid?: string; // Matches the id of the containing 'pakrypt.pak:1.0' object.
}

export interface PakNote1r0 {
  ov: 'pakrypt.note:1.0';
  id: string;
  title: string;
  subtitle: string;
  note: string;
  tags?: string[];
}

export interface PakPassword1r0 {
  ov: 'pakrypt.password:1.0';
  id: string;
  title: string;
  subtitle: string;
  username: string;
  password: string;
  note?: string;
  tags?: string[];
}

export interface PakBlock1r0 {
  ov: 'parypt.block:1.0';
  id: string;
  data: string; // base64 encoded binary data.
}


export function NewPak1r0(): Pak1r0 {
  return {
    ov: 'pakrypt.pak:1.0',
    id: uuid(),
  };
}

function calculateSize(data: string): number {
  const encodedLength = data.replace(/=*$/, '').length;
  let remainder = encodedLength % 4; // Measured in bytes in the encoded data after the final full 4-byte block.
  if (remainder == 1) {
    throw new Error('Invalid base64 encoded data. Check the length of encoded segments.');
  } else if (remainder > 1) {
    --remainder; // Now it measures bytes in the decoded data.
  }
  const result = Math.floor(encodedLength / 4) * 3 + remainder;
  return result;
}

function addEntry(pak: Pak1r0, entry: Pak1r0_Entry) {
  if (pak.entries == null) {
    pak.entries = [];
  }
  pak.entries.push(entry);
}

function addBlock(pak: Pak1r0, block: PakBlock1r0) {
  if (pak.blocks == null) {
    pak.blocks = [];
  }
  pak.blocks.push(block);
}

export interface FileFields {
  title: string;
  data: string;  // base64 encoded binary data.
  tags?: string[];
}

export function CreateFile(pak: Pak1r0, file: FileFields): PakFile1r0 {
  const blockref: PakFile1r0_BlockReference = {
    ov: 'pakrypt.blockref:1.0',
    id: uuid(),
    size: calculateSize(file.data),
  };

  const entry: PakFile1r0 = {
    ov: 'pakrypt.file:1.0',
    id: uuid(),
    blocks: [blockref],
    title: file.title,
    tags: structuredClone(file.tags),
  };

  const block: PakBlock1r0 = {
    ov: 'parypt.block:1.0',
    id: blockref.id,
    data: file.data,
  }

  addBlock(pak, block);
  addEntry(pak, entry);

  return entry;
}

export interface NoteFields {
  title: string;
  subtitle: string;
  note: string;
  tags?: string[];
}

export function CreateNote(pak: Pak1r0, note: NoteFields): PakNote1r0 {
  const entry: PakNote1r0 = {
    ov: 'pakrypt.note:1.0',
    id: uuid(),
    ...structuredClone(note),
  };
  addEntry(pak, entry);
  return entry;
}

export interface PasswordFields {
  title: string;
  subtitle: string;
  username: string;
  password: string;
  note?: string;
  tags?: string[];
}

// TODO: Work on the return type here, it should be something, but not a particular version.
export function CreatePassword(pak: Pak, password: PasswordFields): PakPassword1r0 {
  if (pak.ov === 'pakrypt.pak:1.0') {
    return CreatePassword1r0(pak, password)
  }
  return pak.ov // so we return never when the ifs are exhaustive
}

export function CreatePassword1r0(pak: Pak1r0, password: PasswordFields): PakPassword1r0 {
  const entry: PakPassword1r0 = {
    ov: 'pakrypt.password:1.0',
    id: uuid(),
    ...structuredClone(password),
  };
  addEntry(pak, entry);
  return entry;
}

export function DeleteBlock(pak: Pak1r0, id: string) {
  if (pak.blocks == null) {
    return null;
  }
  const blocks = [];
  for (const block of pak.blocks) {
    if (block.id !== id) {
      blocks.push(block);
    }
  }
  pak.blocks = blocks.length == 0 ? undefined : blocks;
}

export function DeleteEntry(pak: Pak1r0, id: string): null | Pak1r0_Entry {
  if (pak.entries == null) {
    return null;
  }
  let result: null | Pak1r0_Entry = null;
  const entries = [];
  for (const entry of pak.entries) {
    if (entry.id === id) {
      result = entry; // Gross.
    } else {
      entries.push(entry);
    }
  }
  pak.entries = entries.length == 0 ? undefined : entries;
  if (result != null && result.ov == 'pakrypt.file:1.0') {
    for (const block of result.blocks) {
      DeleteBlock(pak, block.id);
    }
  }
  return result;
}
