import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostsModule, AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
