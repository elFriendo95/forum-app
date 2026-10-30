import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'forum.db',
      autoLoadEntities: true,
      synchronize: true, // dev only — remove in prod
    }),
    CategoriesModule,
    UsersModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
