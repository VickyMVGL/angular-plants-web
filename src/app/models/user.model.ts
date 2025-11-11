export interface User {
  id: number;
  username: string;
  password?: string; // opcional cuando se exponga al frontend
  name: string;
  role: 'admin' | 'user' | string;
}
