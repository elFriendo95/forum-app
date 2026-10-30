import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard, type JwtPayload } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get('posts/:postId/comments')
  findForPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ) {
    return this.commentsService.findForPost(postId, page, pageSize);
  }

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.commentsService.create(postId, dto, user.sub);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.commentsService.remove(id, user.sub);
  }
}
