interface PasteResponse {
  id: string;
  created_at: string;
  expires_at: string | null;
  views: number;
  max_views: number | null;
  files: FileResponse[];
  security: string | null;
}

interface FileResponse {
  name: string;
  content: string;
  language: string | null;
  lines: number;
  characters: number;
  annotations: AnnotationResponse[];
}

interface AnnotationResponse {
  content: string;
  head: AnnotationArea;
  tail: AnnotationArea;
}

interface AnnotationArea {
  line: number;
  char: number;
}

interface VersionResponse {
  version: string;
}
