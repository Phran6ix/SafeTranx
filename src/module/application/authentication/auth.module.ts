import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { UserRepository } from "../user/user.repository";
import { UserModule } from "../user/user.module";
import { User } from "../user/schema/user.schema";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
// import { UserRepository } from "../user/user.repository";

@Module({
	imports: [JwtModule.registerAsync({
		imports: [ConfigModule],
		useFactory: async (configService: ConfigService) => ({
			secret: configService.get<string>("JWT_SECRET"),
			signOptions: {
				expiresIn: "1h"
			}
		}),
		inject: [ConfigService],
		global: true
	}), TypeOrmModule.forFeature([User])
	],
	exports: [],
	providers: [
		AuthGuard,
		AuthService,
		UserService,
		UserRepository
	],
	controllers: [AuthController]
})
export class AuthModule { }
