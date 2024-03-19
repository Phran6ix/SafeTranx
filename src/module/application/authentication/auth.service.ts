import * as argon2 from 'argon2'
import * as bcrypt from 'bcrypt'
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { LoginDTO } from "./dto/auth.dto";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
		private userService: UserService
	) { }

	async UserSignUp(payload: CreateUserDto): Promise<unknown> {
		const userExist = await this.userService.GetAUserByEmail(payload.email)
		console.log("UserExist =-->", userExist)
		if (userExist) {
			throw new HttpException("User already exist", HttpStatus.CONFLICT)
		}
		const salt = await bcrypt.genSalt(10)
		console.log("salt", salt)


		let password = await bcrypt.hash(payload.password, salt)
		this.userService.CreateUser({ ...payload, password })
		return
	}

	async UserSignIn(payload: LoginDTO) {
		const user = await this.userService.GetAUserByEmail(payload.email)
		if (!user) {
			throw new HttpException("User with this email does not exist", 404)
		}
		// if (!user.isActive) {
		// 	throw new HttpException("Your account is not verified", 403)
		// }
		const checkPassword = await bcrypt.compare(payload.password, user.password)
		if (!checkPassword) {
			throw new HttpException("Incorrect password", 400)
		}
		const tokens = await this.GenerateTokens(user.id)

		this.UpdateUserRefreshToken(user.id, tokens.refresh_token)
		user.lastLogin = new Date()
		user.save()

		return { user, tokens }
	}

	async GenerateTokens(userId: string): Promise<{ access_token: string, refresh_token: string }> {
		const [access_token, refresh_token] = await Promise.all([
			this.jwtService.signAsync({ id: userId }, {
				secret: this.configService.get<string>("JWT_SECRET"), expiresIn: "15m"
			}),
			this.jwtService.signAsync({ id: userId }, {
				secret: this.configService.get("JWT_SECRET_REFRESH"), expiresIn: "7d"
			})
		])

		return {
			access_token, refresh_token
		}
	}

	async UpdateUserRefreshToken(userId: string, refreshToken: string): Promise<void> {
		const hashedToken = await argon2.hash(refreshToken)

		await this.userService.UpdateUser(userId, { refreshToken: hashedToken })
		return
	}


	async RefreshTokens(userId: string, refreshToken: string): Promise<{ access_token: string, refresh_token: string }> {
		const user = await this.userService.GetAUserById(userId)
		if (!user || !user.refreshToken) {
			throw new HttpException("An Error occured, please sign in again", 403)
		}

		const validToken = await argon2.verify(user.refreshToken, refreshToken)
		if (!validToken) {
			throw new HttpException("Invalid token", 403)
		}

		const tokens = await this.GenerateTokens(userId)
		this.UpdateUserRefreshToken(user.id, tokens.refresh_token)
		return tokens
	}

	async GetCurrentUser(userId: string): Promise<{ user: User }> {
		const user = await this.userService.GetAUserById(userId)
		delete user.password
		return { user }
	}
}
