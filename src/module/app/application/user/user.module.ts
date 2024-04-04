import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./schema/user.schema";
import { UserService } from "./user.service";

@Module({
	imports: [TypeOrmModule.forFeature([User],)],
	exports: [UserService, UserRepository],
	providers: [ UserService],
})

export class UserModule { }
