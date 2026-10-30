import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostQuery } from './dto/list-post-query.dto';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
  ) {}

  // internal: base post, no relations, 404 if missing
  async findOneBase(id: number): Promise<Post> {
    const post = await this.postsRepo.findOneBy({ id });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }

  // public: post with relations for API responses
  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepo.findOne({
      where: { id },
      relations: { author: true, category: true },
    });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }

  async findAll(query: ListPostQuery): Promise<Paginated<Post>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sort: 'ASC' | 'DESC' =
      (query.sort ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

    const where: FindOptionsWhere<Post> = {};
    if (query.categoryId !== undefined) where.categoryId = query.categoryId;
    if (query.authorId !== undefined) where.authorId = query.authorId;
    if (query.search) where.title = Like(`%${query.search}%`);

    const [items, total] = await this.postsRepo.findAndCount({
      where,
      relations: { author: true, category: true },
      order: { createdAt: sort },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total, page, pageSize };
  }

  async create(dto: CreatePostDto, authorId: number): Promise<Post> {
    const created = this.postsRepo.create({ ...dto, authorId });
    const saved = await this.postsRepo.save(created);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.findOneBase(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('Not your post');
    }
    await this.postsRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.findOneBase(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('Not your post');
    }
    await this.postsRepo.remove(post);
  }
}
