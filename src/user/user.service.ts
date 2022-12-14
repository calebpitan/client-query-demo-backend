import { PostgresErrorCodes } from '@/utils/errors/index.js';
import { AppLogger } from '@/utils/logger/index.js';
import { ID } from '@/utils/types/index.js';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sprintf } from 'sprintf-js';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.save(this.userRepository.create(createUserDto));
      return user;
    } catch (e) {
      const err = e as any;
      if (err.code === PostgresErrorCodes.UNIQUE_CONSTRAINT) {
        const message = 'User with one or more of the unique fields already exists';
        this.logger.log(err);
        this.logger.log(sprintf(`${message} %j`, createUserDto));

        throw new BadRequestException(message, { cause: err });
      }
    }
  }

  async find() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: ID) {
    const user = await this.userRepository.findOne({ where: { id: id as number } });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async update(id: ID, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = await this.userRepository.save({ ...user, ...updateUserDto });
    return updatedUser;
  }

  async remove(id: ID) {
    const user = await this.findOne(id);
    const result = await this.userRepository.softDelete({ id } as FindOptionsWhere<User>);
    this.logger.log(result);
    return user;
  }
}
