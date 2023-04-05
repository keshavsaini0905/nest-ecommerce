import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/create-user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('/login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return await this.authService.loginUser(loginUserDto, response);
  }

  @Get('/logout')
  @Redirect(process.env.FRONTEND_HOME, HttpStatus.TEMPORARY_REDIRECT)
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout(response);
  }

  @Patch('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
