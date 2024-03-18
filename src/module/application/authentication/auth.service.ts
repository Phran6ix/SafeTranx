import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { LoginDTO } from "./dto/auth.dto";

@Injectable()
export class AuthService {
	constructor(private userService: UserService) { }

	async UserSignUp(payload: CreateUserDto): Promise<unknown> {
		const userExist = await this.userService.GetAUserByEmail(payload.email)
		console.log("UserExist =-->", userExist)
		if (userExist) {
			throw new HttpException("User already exist", HttpStatus.CONFLICT)
		}
		//TODO: HASH THE PASSWORD
		this.userService.CreateUser(payload)
		return
	}
	async UserSignIn(payload: LoginDTO) {
		const user = await this.userService.GetAUserByEmail(payload.email)
		if (!user) {
			throw new HttpException("User with this email does not exist", 404)
		}

		//TODO: check for user verification
		//TODO : check for hashed password
		//TODO : generate token

		return { user, token: "" }
	}

}
