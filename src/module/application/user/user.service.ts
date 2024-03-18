import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./schema/user.schema";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepo: Repository<User>
	) { }

	async CreateUser(user: CreateUserDto): Promise<void> {
		await this.userRepo.save(user)
		return
	}
	async GetAllUsers(): Promise<User[]> {
		return await this.userRepo.find()
	}

	async GetAUserByEmail(email: string): Promise<User | null> {
		return await this.userRepo.findOneBy({ email })
	}

	async GetAUserById(id: string): Promise<User | null> {
		return await this.userRepo.findOneBy({ id })
	}

}