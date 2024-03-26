import * as argon2 from 'argon2'
import * as bcrypt from 'bcrypt'
import { BadRequestException, ConflictException, HttpCode, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { LoginDTO } from "./dto/auth.dto";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/schema/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailerService } from '../../mailer/smtpexpress.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
		private userService: UserService,
		private mailerServicer: MailerService,
		private eventEmitter: EventEmitter2,
		@Inject(CACHE_MANAGER) private cacheService: Cache
	) { }

	private async SendOTPToken(email: string): Promise<void> {
		let otp = Math.floor(Math.random() * 90000) + 100000

		const hashedOTP = argon2.hash('' + otp)
		await this.cacheService.set(`otp`, hashedOTP, 900000)

		//SEND THE OTP
		const mailPayload = {
			subject: "One Time Password",
			message: `Your one-time-password is ${otp}`,
			sender: {
				name: "Safe-Tranx",
				email: "no-reply@email.com"
			},
			recipients: email,

		}
		this.mailerServicer.SendEmail(mailPayload)
		return
	}

	async UserSignUp(payload: CreateUserDto): Promise<unknown> {
		const userExist = await this.userService.GetAUserByEmail(payload.email)
		if (userExist) {
			throw new HttpException("User already exist", HttpStatus.CONFLICT)
		}
		const salt = await bcrypt.genSalt(10)

		let password = await bcrypt.hash(payload.password, salt)
		let user = await this.userService.CreateUser({ ...payload, password })
		if (this.configService.get("NODE_ENV") != "test") this.SendOTPToken(user.email)
		return
	}

	async UserSignIn(payload: LoginDTO) {
		const user = await this.userService.GetAUserByEmail(payload.email)
		if (!user) {
			throw new HttpException("User with this email does not exist", 404)
		}
		if (!user.isActive) {
			throw new HttpException("Your account is not verified", 403)
		}
		const checkPassword = await bcrypt.compare(payload.password, user.password)
		if (!checkPassword) {
			throw new HttpException("Incorrect password", 400)
		}
		const tokens = await this.GenerateTokens(user.id)

		this.UpdateUserRefreshToken(user.id, tokens.refresh_token)
		this.userService.UpdateUser(user.id, { lastLogin: new Date() })

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


		try {
			await this.jwtService.verify(refreshToken, { secret: this.configService.get<string>("JWT_SECRET_REFRESH") })
		} catch {
			throw new UnauthorizedException()
		}

		const validToken = await argon2.verify(user.refreshToken, refreshToken)
		if (!validToken) {
			throw new HttpException("Session has expired, please sign in", 403)
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

	async ChangePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
		const user = await this.userService.GetAUserById(userId)
		if (!user) {
			throw new NotFoundException("User not found")
		}
		const validPassword = await bcrypt.compare(oldPassword, user.password)
		if (!validPassword) {
			throw new BadRequestException("Incorrect password")
		}
		if (oldPassword == newPassword) {
			throw new ConflictException("Old password cannot be the same as new password")
		}
		let salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(newPassword, salt)
		this.userService.UpdateUser(userId, { password: hashedPassword })

		return
	}

	async VerifyAccount(email: string, otp: string): Promise<void> {
		console.log(otp)
		console.log(email)
		const user = await this.userService.GetAUserByEmail(email)
		if (!user) {
			throw new NotFoundException("User with this email not found")
		}
		const storedOTP: string | null = await this.cacheService.get(`otp`)
		console.log(storedOTP)
		if (!storedOTP) {
			throw new HttpException("Invalid or expired token", HttpStatus.BAD_REQUEST)
		}

		//verify the OTP
		const validOTP = argon2.verify(storedOTP, otp)
		if (!validOTP) {
			throw new HttpException("Ivalid OTP", HttpStatus.BAD_REQUEST)
		}

		this.userService.UpdateUser(user.id, { isActive: true })
		this.eventEmitter.emit("create.wallet", { userId: user.id })
		return
	}

	async ResendOTP(email: string): Promise<void> {
		const user = await this.userService.GetAUserByEmail(email)
		if (!user) {
			throw new NotFoundException("User with this email does not exist")
		}

		await this.SendOTPToken(user.email)
		return
	}
}
