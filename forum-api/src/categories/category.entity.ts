import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/post.entity';
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
