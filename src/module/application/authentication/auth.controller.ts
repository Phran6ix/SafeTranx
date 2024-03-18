import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/createUser.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) { }

	@HttpCode(201)
	@Post()
	async HTTPSignUp(@Body() body: CreateUserDto) {
		return await this.authService.UserSignUp(body)
	}
}
