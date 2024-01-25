export interface ValidatedTypePak {
  ov: 'pakrypt.pak:1.0',
  id: string,
  entries?: ValidatedTypePakEntry[],
  blocks?: ValidatedTypePakBlock[],
}

export type ValidatedTypePakEntry = (
  | ValidatedTypePakFile
  | ValidatedTypePakNote
  | ValidatedTypePakPassword
)

export interface ValidatedTypePakFile {
  ov: 'pakrypt.file:1.0',
  id: string,
  title: string,
  subtitle: string,
  blocks: ValidatedTypePakFile_BlockReference[],
  tags?: string[],
}

export interface ValidatedTypePakFile_BlockReference {
  ov: 'pakrypt.blockref:1.0',
  id: string,
  size: number,
  pakid?: string,
}

export interface ValidatedTypePakNote {
  ov: 'pakrypt.note:1.0',
  id: string,
  title: string,
  subtitle: string,
  note: string,
  tags?: string[],
}

export interface ValidatedTypePakPassword {
  ov: 'pakrypt.password:1.0',
  id: string,
  title: string,
  subtitle: string,
  username: string,
  password: string,
  note?: string,
  tags?: string[],
}

export interface ValidatedTypePakBlock {
  ov: 'pakrypt.block:1.0',
  id: string,
  data: string, // base64 encoded binary data.
}

export function validatePak(pak: unknown): pak is ValidatedTypePak {
  if (pak == null || typeof pak !== 'object' || Array.isArray(pak)) {
    return false
  }

  // TODO: Check more fields
  return 'ov' in pak && pak.ov === 'pakrypt.pak:1.0'
}

export interface ValidatedTypePakmanLocalOptions {
  ov: 'pakrypt.pakman_local_options:1.0',
  pakmanStore: null | ValidatedTypePakmanLocalOptionsPakmanStore,
}
export interface ValidatedTypePakmanLocalOptionsPakmanStore {
  ov: 'pakrypt.pakman_local_options.pakman_store:1.0',
  url: string,
  key: string,
}

export function validateLocalOptions(options: unknown): options is ValidatedTypePakmanLocalOptions {
  if (options == null || typeof options !== 'object' || Array.isArray(options)) {
    return false
  }

  // TODO: Check more fields
  return 'ov' in options && options.ov === 'pakrypt.pakman_local_options:1.0'
}
