import { BadRequestErrorResponse, NotFoundErrorResponse } from '@/utils/errors/index.js';
import { DataInterceptor } from '@/utils/interceptors/index.js';
import { DataResponseFactory } from '@/utils/types/index.js';

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { UserService } from './user.service.js';

@ApiTags('users')
@Controller('users')
@UseInterceptors(DataInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBadRequestResponse({ description: 'Bad user input', type: () => BadRequestErrorResponse })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: () => DataResponseFactory(User),
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { user, message: 'User created successfully', success: true };
  }

  @Get()
  @ApiOkResponse({ type: () => DataResponseFactory(User, { isArray: true }) })
  async find() {
    const users = await this.userService.find();
    return { users };
  }

  @Get(':id')
  @ApiOkResponse({ type: () => DataResponseFactory(User) })
  @ApiNotFoundResponse({ description: 'User not found', type: () => NotFoundErrorResponse })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return { user };
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'User updated successfully',
    type: () => DataResponseFactory(User),
  })
  @ApiNotFoundResponse({ description: 'User not found', type: () => NotFoundErrorResponse })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return { user, message: 'User updated successfully!', success: true };
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User removed successfully',
    type: () => DataResponseFactory(User),
  })
  @ApiNotFoundResponse({ description: 'User not found', type: () => NotFoundErrorResponse })
  async remove(@Param('id') id: string) {
    const user = this.userService.remove(id);
    return { user, message: 'User removed successfully!', success: true };
  }
}
