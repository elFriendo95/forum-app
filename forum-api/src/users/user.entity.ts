import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
export type Role = 'user' | 'admin';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  passwordHash: string;
  @Column({ default: 'user' })
  role: Role;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
