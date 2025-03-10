export interface ContentItem {
  title: string;
  description: string;
  content: string;
}

export interface StepInterface {
  title?: string;
  webhookRetrieve?: string;
  webhookUpdate?: string;
  webhookExport?: string;
  generated_content: ContentItem[] | null;
  original_content: string[] | null;
}

export interface CreateContentResponse {
  id: number;
  message: string;
  keyword: string;
  avatar: string;
  persona: string;
  id_avatar: string;
  id_persona: string;
  status: string;
}

export interface ContentDetailResponse {
  Keyword: string;
  Avatar: string;
  Persona: string;
  Título: string;
}

export type StepsToLoad = Record<string, number[]>;
