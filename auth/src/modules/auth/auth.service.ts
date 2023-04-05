import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { Users } from 'src/entities/Users';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const usersRepository = this.dataSource.getRepository(Users);
      const newUser = usersRepository.create(createUserDto);
      newUser.password = await this.hashPassword(createUserDto.password);
      const saved = await usersRepository.save(newUser);
      delete saved.password;
      return saved;
    } catch (error) {
      throw new InternalServerErrorException('invalid details');
    }
  }

  async loginUser(loginUserDto: LoginUserDto, response: Response) {
    const usersRepository = this.dataSource.getRepository(Users);
    const user = await usersRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      console.log({ user });
      throw new NotFoundException('invalid credentials');
    }

    if (await bcrypt.compare(loginUserDto.password, user.password)) {
      delete user.password;
      const jwt = await this.jwtService.signAsync({
        email: loginUserDto.email,
        id: user.id,
      });

      response.cookie('access_token', jwt, { httpOnly: true });

      return user;
    } else {
      throw new UnauthorizedException('invalid credentials');
    }
  }

  async logout(response: Response) {
    try {
      response.clearCookie('access_token', { httpOnly: true });
    } catch (error) {
      throw new UnauthorizedException('unauthorized request');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const usersRepository = await this.dataSource.getRepository(Users);
      const user = await usersRepository.findOne({
        where: {
          email: resetPasswordDto.email,
        },
      });

      if (!user) {
        throw new NotFoundException('credentials does not match');
      }
      const newHashedPassword = await this.hashPassword(
        resetPasswordDto.password,
      );

      await usersRepository.update(user.id, {
        password: newHashedPassword,
      });

      return {
        status: HttpStatus.OK,
        message: 'Password Updated',
      };
    } catch (error) {
      throw new BadRequestException(
        'bad request please check the details you provided',
      );
    }
  }
}
