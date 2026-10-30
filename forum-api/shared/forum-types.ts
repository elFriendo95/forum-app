export type Role = 'user' | 'admin';
export type SortOrder = 'asc' | 'desc';
//entities
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}
export interface Category {
  id: number;
  name: string;
  slug: string;
}
export interface Post {
  id: number;
  title: string;
  body: string;
  authorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}
export interface Comment {
  id: number;
  body: string;
  authorId: number;
  postId: number;
  createdAt: string;
}
//publics
export type PublicUser = Omit<User, 'passwordHash'>;

export type PostWithAuthor = Post & {
  author: PublicUser;
  category: Category;
};
export type CommentWithAuthor = Comment & { author: PublicUser };
//DTOs
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}
export interface LoginDto {
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  user: PublicUser;
}
export interface CreatePostDto {
  title: string;
  body: string;
  categoryId: number;
}
export type UpdatePostDto = Partial<CreatePostDto>;
export interface CreateCommentDto {
  body: string;
}
//Query

export interface ListPostQuery {
  categoryId?: number;
  authorId?: number;
  sort?: SortOrder;
  search?: string;
  page?: number;
  pageSize?: number;
}
//helper

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

//paginated posts
export type PaginatedPosts = Paginated<PostWithAuthor>;
