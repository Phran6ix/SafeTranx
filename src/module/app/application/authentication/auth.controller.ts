import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { LoginDTO } from "./dto/auth.dto";
import { AuthGuard } from "./auth.guard";
import { AuthUser } from "src/decorators/auth-user";
import { ChangePasswordDTO } from "./dto/change-password.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) { }

	@HttpCode(HttpStatus.CREATED)
	@Post("/register")
	async SignUp(@Body() body: CreateUserDto) {
		const user = await this.authService.UserSignUp(body)
		return {
			message: "User has been created successfully",
			user
		}
	}

	@HttpCode(HttpStatus.OK)
	@Post("/login")
	async Login(@Body() body: LoginDTO) {
		return await this.authService.UserSignIn(body)
	}

	@UseGuards(AuthGuard)
	@Get("/me")
	async GetCurrentUser(@AuthUser() user: string) {
		const currentUser = await this.authService.GetCurrentUser(user['id'])
		return { message: "User has been fetched successfully", data: currentUser }
	}

	@Get("/refresh-token/:id/:token")
	async RefreshToken(@Param() param: any) {
		console.log(param)
		const tokens = await this.authService.RefreshTokens(param.id, param.token)

		return {
			message: "Tokens have been successfully refreshed", data: { ...tokens }
		}

	}

	@UseGuards(AuthGuard)
	@Patch("/change-password")
	async ChangePassword(@AuthUser() user: string, @Body() body: ChangePasswordDTO) {
		await this.authService.ChangePassword(user, body.oldPassword, body.newPassword)
		return { message: "Passwords have been changed successfully" }
	}

	@Get("/verify-account/:token")
	async VerifyAccount(@Param("token") token: string, @Query("email") email: string) {
		await this.authService.VerifyAccount(email, token)
		return { message: "Account has been verified successfully", data: null }
	}

	@Get("/resend-otp")
	async ResendOTP(@Query("email") email:string) {
		await this.authService.ResendOTP(email)
		return {message: "OTP has been sent successfully"}
	}
}
