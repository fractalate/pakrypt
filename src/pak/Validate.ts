// The types here replicate those defined elsewhere because the logic outlined
// here checks objects for these specific structures. When these are out of
// alignment with the other definitions, then the object that is validated should
// then be incompatible with the type definitions used elsewhere, indicating that
// validation logic must be expanded to handle the new structures.

interface ValidatedTypePak {
  ov: 'pakrypt.pak:1.0',
  id: string,
  entries?: ValidatedTypePakEntry[],
  blocks?: ValidatedTypePakBlock[],
}

type ValidatedTypePakEntry = (
  | ValidatedTypePakFile
  | ValidatedTypePakNote
  | ValidatedTypePakPassword
)

interface ValidatedTypePakFile {
  ov: 'pakrypt.file:1.0',
  id: string,
  title: string,
  subtitle: string,
  blocks: ValidatedTypePakFile_BlockReference[],
  tags?: string[],
}

interface ValidatedTypePakFile_BlockReference {
  ov: 'pakrypt.blockref:1.0',
  id: string,
  size: number,
  pakid?: string,
}

interface ValidatedTypePakNote {
  ov: 'pakrypt.note:1.0',
  id: string,
  title: string,
  subtitle: string,
  note: string,
  tags?: string[],
}

interface ValidatedTypePakPassword {
  ov: 'pakrypt.password:1.0',
  id: string,
  title: string,
  subtitle: string,
  username: string,
  password: string,
  note?: string,
  tags?: string[],
}

interface ValidatedTypePakBlock {
  ov: 'pakrypt.block:1.0',
  id: string,
  data: string,
}

export function validatePak(pak: unknown): pak is ValidatedTypePak {
  if (pak == null || typeof pak !== 'object' || Array.isArray(pak)) {
    return false
  }

  // TODO: Check more fields
  return 'ov' in pak && pak.ov === 'pakrypt.pak:1.0'
}

interface ValidatedTypePakmanLocalOptions {
  ov: 'pakrypt.pakman_local_options:1.0',
  pakmanStore: null | ValidatedTypePakmanLocalOptionsPakmanStore,
}
interface ValidatedTypePakmanLocalOptionsPakmanStore {
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
