export interface JoinPost {
  body: string;
  user: string;
}

export interface CommentPost {
  body: string;
  user: string;
}

export interface EventItem {
  hash: string;
  title: string;
  date: Date;
  joinDeadline: Date;
  description: string;
  placement: string;
  thumbnailUrl: string;
  joinners?: JoinPost[];
  comments?: CommentPost[];
}
