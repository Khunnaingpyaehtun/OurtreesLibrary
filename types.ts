
export interface Book {
  id: number;
  title: string;
  author: string;
  ddc: string;
  isFeatured: boolean;
  status?: string; // Optional now, as we don't display it
  year: string;
  coverUrl: string;
  pdfUrl: string;
}

export interface BookRequest {
  id: number;
  title: string;
  author: string;
  requester: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string; // In a real app, hash this. For offline Pi, plain text is acceptable if secured physically.
  role: 'admin' | 'user';
  joinedDate: string;
  readHistory: number[]; // Array of Book IDs
  currentlyReading: number[]; // Array of Book IDs
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredBooks: number;
}

export interface DDCCategory {
  code: string;
  label: string;
  iconName: string;
  color: string;
}

export type Tab = "home" | "browse" | "list" | "requests" | "profile" | "admin_dashboard";

export interface LoginForm {
  username: string;
  password: string;
}

export interface NewBookForm {
  title: string;
  author: string;
  ddc: string;
  isFeatured: boolean;
  year: string;
  coverUrl: string;
  pdfUrl: string;
}

export interface NewRequestForm {
  title: string;
  author: string;
  requester: string;
}
