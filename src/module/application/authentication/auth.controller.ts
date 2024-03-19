import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { LoginDTO } from "./dto/auth.dto";
import { AuthGuard } from "./auth.guard";
import { AuthUser } from "src/decorators/auth-user";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post("/register")
	@HttpCode(HttpStatus.CREATED)
	async SignUp(@Body() body: CreateUserDto) {
		const user = await this.authService.UserSignUp(body)
		return "User has been created successfully"
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

}
