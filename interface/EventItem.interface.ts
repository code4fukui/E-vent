export interface JoinPost {
  body: string;
  user: string;
  url: string;
  images: string[];
}

export interface CommentPost {
  body: string;
  user: string;
  url: string;
  images: string[];
}

export interface EventItem {
  hash: string;
  title: string;
  date: Date;
  joinDeadline: Date;
  description: string;
  placement: string;
  thumbnailUrl: string;
  prevEventId?: string;
  permitted?: boolean;
  joinners?: JoinPost[];
  comments?: CommentPost[];
}
