import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostQuery } from './dto/list-post-query.dto';
import { JwtAuthGuard, type JwtPayload } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: ListPostQuery) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePostDto, @CurrentUser() user: JwtPayload) {
    return this.postsService.create(dto, user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postsService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.postsService.remove(id, user.sub);
  }
}
