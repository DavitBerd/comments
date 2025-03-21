export interface Comment {
  id: string;
  username: string;
  avatarUrl: string;
  text: string;
  repostCount: number;
  replies?: Comment[];
}
