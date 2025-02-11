export interface ContentItem {
  title: string;
  description: string;
  content: string;
}

export interface StepInterface {
  title?: string;
  selected?: boolean;
  webhookRetrieve?: string;
  webhookUpdate?: string;
  webhookExport?: string;
  generated_content?: Array<ContentItem> | null;
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

export type StepsToLoad = Record<string, number[]>;
