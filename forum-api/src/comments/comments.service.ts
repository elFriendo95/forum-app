import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '../posts/posts.service';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly postService: PostsService,
  ) {}
  async findForPost(
    postId: number,
    page = 1,
    pageSize = 20,
  ): Promise<Paginated<Comment>> {
    await this.postService.findOneBase(postId);
    const [items, total] = await this.commentRepo.findAndCount({
      where: { postId },
      relations: { author: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize };
  }
  async create(
    postId: number,
    dto: CreateCommentDto,
    authorId: number,
  ): Promise<Comment> {
    await this.postService.findOneBase(postId);
    const created = this.commentRepo.create({
      body: dto.body,
      postId: postId,
      authorId: authorId,
    });
    const saved = await this.commentRepo.save(created);
    // save() doesn't populate relations — reload with author
    const withAuthor = await this.commentRepo.findOne({
      where: { id: saved.id },
      relations: { author: true },
    });
    return withAuthor!;
  }
  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found`);
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenException('Not your comment');
    }
    await this.commentRepo.remove(comment);
  }
}
