type FileCreate = {
  name?: string;
  content: string;
  language?: string;
};

type PasteCreate = {
  files: FileCreate[];
  password?: string;
  max_views?: number;
  expires_at?: string;
};
