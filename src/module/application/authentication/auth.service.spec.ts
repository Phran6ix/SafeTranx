import { Test } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { GenerateUser, GenerateUserDTO } from "./utils/generate";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "../../../configs/typeorm";
import { User } from "../user/schema/user.schema";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { HttpException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'

describe("Authentication", () => {
	let userMock = GenerateUser()

	let userService: UserService
	let authService: AuthService
	beforeEach(() => {
		jest.clearAllMocks()
	})
	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [TypeOrmModule.forRoot(typeormConfig), TypeOrmModule.forFeature([User]),

			JwtModule.registerAsync({
				imports: [ConfigModule],
				useFactory: async (configService: ConfigService) => ({
					secret: configService.get<string>("JWT_SECRET"),
					signOptions: {
						expiresIn: "1h"
					}
				}),
				inject: [ConfigService],
				global: true
			})
			],
			providers: [UserService, AuthService, ConfigService]
		}).compile()

		userService = module.get<UserService>(UserService)
		authService = module.get<AuthService>(AuthService)
	})

	describe("Test Sign Up", () => {
		let userDTO = GenerateUserDTO()
		test("should throw error if user already exists", async () => {
			jest.spyOn(userService, "GetAUserByEmail").mockResolvedValueOnce(userMock)


			await expect(authService.UserSignUp(userDTO)).rejects.toThrow(HttpException)
			expect(userService.GetAUserByEmail).toHaveBeenCalled()
			expect(userService.GetAUserByEmail).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserByEmail).toHaveBeenCalledWith(userDTO.email)
		})

		test("should not throw error if user does not exist", async () => {
			jest.spyOn(userService, "GetAUserByEmail").mockResolvedValueOnce(null)
			jest.spyOn(userService, "CreateUser").mockResolvedValueOnce(null)

			await authService.UserSignUp(userDTO)
			expect(userService.GetAUserByEmail).toHaveBeenCalledTimes(1)
			expect(userService.CreateUser).toHaveBeenCalledTimes(1)
			expect(userService.CreateUser).toHaveBeenCalledWith({
				...userDTO,
				password: expect.any(String)
			})
		})
	})
})
