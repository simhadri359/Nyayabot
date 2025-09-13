export type Role = 'user' | 'model';

export interface InlineDataPart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface TextPart {
  text: string;
}

export type Part = InlineDataPart | TextPart;

export interface Message {
  id: string;
  role: Role;
  parts: Part[];
  timestamp: string;
}
