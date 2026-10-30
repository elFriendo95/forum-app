import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  authorId: number;

  @Column()
  postId: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
