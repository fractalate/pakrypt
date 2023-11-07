export default interface Pak {
  ov: string;
  id: string;
}

export interface Pak1r0 extends Pak {
  ov: 'pakrypt.pak:1.0';
  id: string;
  entries?: Pak1r0_Entry[];
  blocks?: PakBlock1r0[];
}

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
  id: string;
  pakid?: string;
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
  data: string;
}
