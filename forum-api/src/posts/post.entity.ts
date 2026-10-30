import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  authorId: number; // placeholder until User entity exists

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (cat) => cat.posts)
  category: Category;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
