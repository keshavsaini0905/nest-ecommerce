import { HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { Users } from 'src/entities/Users';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/resetPassword.dto';
export declare class AuthService {
    private dataSource;
    private jwtService;
    constructor(dataSource: DataSource, jwtService: JwtService);
    hashPassword(password: string): Promise<string>;
    createUser(createUserDto: CreateUserDto): Promise<Users>;
    loginUser(loginUserDto: LoginUserDto, response: Response): Promise<Users>;
    logout(response: Response): Promise<void>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
}
