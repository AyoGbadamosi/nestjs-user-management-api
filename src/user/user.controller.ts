import {
    Controller,
    Post,
    Get,
    Put,
    Body,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { CreateUserDto, UpdateUserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/user.entity';
import { userRegisteredResponse } from 'src/user/user.utils';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        try {
            const newUser = await this.userService.create(createUserDto);
            return userRegisteredResponse(newUser);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'User registration failed. Please try again.',
                    message: err.message,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Partial<User>> {
        try {
            const user = await this.userService.findById(id);
            return userRegisteredResponse(user);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Could not retrieve user',
                    message: err.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('all/users')
    async findAllUsers(): Promise<Partial<User>[]> {
        try {
            const users = await this.userService.findAllUsers();
            return users.map(userRegisteredResponse);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Could not retrieve users',
                    message: err.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        try {
            const updatedUser = await this.userService.update(id, updateUserDto);
            return userRegisteredResponse(updatedUser);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Could not update user',
                    message: err.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
