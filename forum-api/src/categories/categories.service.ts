import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}
  async onModuleInit() {
    const count = await this.categoriesRepo.count();
    if (count === 0) {
      await this.categoriesRepo.save([
        { name: 'General', slug: 'general' },
        { name: 'NestJS', slug: 'nestjs' },
        { name: 'React', slug: 'react' },
      ]);
    }
  }
  async findAll(): Promise<Category[]> {
    return this.categoriesRepo.find();
  }
  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }
}
