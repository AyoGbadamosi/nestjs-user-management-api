import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from 'src/user/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const existingEmail = await this.findByEmail(createUserDto.email);
        if (existingEmail) {
            throw new HttpException(
                `The email already exists`,
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const user = this.userRepository.create({
                ...createUserDto,
                password: hashedPassword,
            });
            return this.userRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException(
                'Error creating user. Please try again.',
            );
        }
    }
    async findById(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }
}
