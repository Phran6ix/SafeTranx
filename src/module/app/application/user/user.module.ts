import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./schema/user.schema";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
	imports: [TypeOrmModule.forFeature([User],)],
	exports: [UserService, UserRepository],
	providers: [UserRepository, UserService],
})

export class UserModule { }
