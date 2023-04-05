import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/resetPassword.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    createUser(createUserDto: CreateUserDto): Promise<import("../../entities/Users").Users>;
    loginUser(loginUserDto: LoginUserDto, response: Response): Promise<any>;
    logout(response: Response): Promise<void>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
}
