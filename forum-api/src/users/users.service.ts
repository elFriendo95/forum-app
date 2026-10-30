import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}
  findById(id: number): Promise<User | null> {
    return this.usersRepo.findOneBy({ id });
  }
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ email });
  }
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true,
        createdAt: true,
      },
    });
  }
  findByUsername(username: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ username });
  }
  create(data: {
    username: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }
}
