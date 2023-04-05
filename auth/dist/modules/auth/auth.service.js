"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Users_1 = require("../../entities/Users");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(dataSource, jwtService) {
        this.dataSource = dataSource;
        this.jwtService = jwtService;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
    async createUser(createUserDto) {
        try {
            const usersRepository = this.dataSource.getRepository(Users_1.Users);
            const newUser = usersRepository.create(createUserDto);
            newUser.password = await this.hashPassword(createUserDto.password);
            const saved = await usersRepository.save(newUser);
            delete saved.password;
            return saved;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('invalid details');
        }
    }
    async loginUser(loginUserDto, response) {
        const usersRepository = this.dataSource.getRepository(Users_1.Users);
        const user = await usersRepository.findOne({
            where: { email: loginUserDto.email },
        });
        if (!user) {
            console.log({ user });
            throw new common_1.NotFoundException('invalid credentials');
        }
        if (await bcrypt.compare(loginUserDto.password, user.password)) {
            delete user.password;
            const jwt = await this.jwtService.signAsync({
                email: loginUserDto.email,
                id: user.id,
            });
            response.cookie('access_token', jwt, { httpOnly: true });
            return user;
        }
        else {
            throw new common_1.UnauthorizedException('invalid credentials');
        }
    }
    async logout(response) {
        try {
            response.clearCookie('access_token', { httpOnly: true });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('unauthorized request');
        }
    }
    async resetPassword(resetPasswordDto) {
        try {
            const usersRepository = await this.dataSource.getRepository(Users_1.Users);
            const user = await usersRepository.findOne({
                where: {
                    email: resetPasswordDto.email,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('credentials does not match');
            }
            const newHashedPassword = await this.hashPassword(resetPasswordDto.password);
            await usersRepository.update(user.id, {
                password: newHashedPassword,
            });
            return {
                status: common_1.HttpStatus.OK,
                message: 'Password Updated',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('bad request please check the details you provided');
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map