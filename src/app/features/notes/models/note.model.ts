export interface Note {
  id: number;
  title: string;
  content: string;
  color: string | null;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  reminder: string | null;
  labels: Label[];
}

export interface Label {
  id: number;
  name: string;
}