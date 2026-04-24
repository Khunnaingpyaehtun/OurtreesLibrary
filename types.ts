export interface Book {
  id: number;
  title: string;
  author: string;
  ddc: string;
  isFeatured: boolean;
  views: number; // New property to track most read
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
  password: string;
  gender?: string;
  region?: string;
  age?: string;
  bornYear?: string;
  libraryName?: string;
  role: "admin" | "user";
  joinedDate: string;
  readHistory: number[];
  currentlyReading: number[];
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

export type Tab =
  | "home"
  | "browse"
  | "list"
  | "requests"
  | "profile"
  | "admin_dashboard";

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
