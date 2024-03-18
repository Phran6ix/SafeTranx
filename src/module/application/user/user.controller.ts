import { Controller, Get, Inject, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(private userService: UserService) { }
	@Get()
	async GetAllUsers() {
		return { users: await this.userService.GetAllUsers() }
	}

	@Get(":id")
	async GetAUserById(@Param() params: { id: string; }) {
		return await this.userService.GetAUserById(params.id)
	}

}

