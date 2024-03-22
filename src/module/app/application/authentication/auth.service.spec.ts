import { Test } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { GenerateUser, GenerateUserDTO } from "./utils/generate";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/schema/user.schema";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { HttpException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { typeormConfig } from "src/configs/typeorm";
import { MailerService } from "../../mailer/smtpexpress.service";
import { CacheModule } from "@nestjs/cache-manager";

describe("Authentication", () => {
	let userMock = GenerateUser()

	let userService: UserService
	let authService: AuthService
	let mailerService: MailerService
	let cacheService: Cache

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
			providers: [UserService, AuthService, ConfigService, MailerService, CacheModule]
		}).compile()

		userService = module.get<UserService>(UserService)
		authService = module.get<AuthService>(AuthService)
		mailerService = module.get<MailerService>(MailerService)
		cacheService = module.get<CacheModule>(CacheModule)
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

			jest.spyOn(mailerService, "SendEmail").mockResolvedValueOnce(null)
			jest.spyOn(cacheService, "set")

			await authService.UserSignUp(userDTO)
			expect(userService.GetAUserByEmail).toHaveBeenCalledTimes(1)
			expect(userService.CreateUser).toHaveBeenCalledTimes(1)
			expect(userService.CreateUser).toHaveBeenCalledWith({
				...userDTO,
				password: expect.any(String)
			})
		})
	})

	describe("User Sign In", () => {
		const userSignInDTO = {
			email: userMock.email,
			password: "password"
		}
		test("it should throw error if user with email does not exist", async () => {
			jest.spyOn(userService, "GetAUserByEmail").mockResolvedValueOnce(null)

			await expect(authService.UserSignIn(userSignInDTO)).rejects.toThrow(HttpException)
			expect(userService.GetAUserByEmail).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserByEmail).toHaveBeenCalledWith(userSignInDTO.email)
		})

		test("it should throw an error if the user is verified", async () => {
			const unverifiedUser = GenerateUser({ isActive: false })
			console.log("under", unverifiedUser)

			jest.spyOn(userService, "GetAUserByEmail").mockResolvedValueOnce(unverifiedUser)

			await expect(authService.UserSignIn(userSignInDTO)).rejects.toThrow()

			expect(userService.GetAUserByEmail).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserByEmail).toHaveBeenCalledWith(userSignInDTO.email)

		})

		test("it should throw error if password is incorrect", async () => {
			const verifiedUser = GenerateUser({ isActive: true })

			jest.spyOn(userService, "GetAUserByEmail").mockResolvedValueOnce(userMock)

			const bcryptCompare = jest.fn().mockResolvedValueOnce(false);
			(bcrypt.compare as jest.Mock) = bcryptCompare

			await expect(authService.UserSignIn(userSignInDTO)).rejects.toThrow()
			expect(userService.GetAUserByEmail).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserByEmail).toHaveBeenCalledWith(userSignInDTO.email)
		})

		test("it should return access token and refresh token to show a successful sign in", async () => {
			const verifiedUser = GenerateUser({ isActive: true })
			jest.spyOn(userService, "GetAUserByEmail").mockResolvedValueOnce(verifiedUser)
			jest.spyOn(userService, "UpdateUser").mockResolvedValueOnce({ raw: 1, generatedMaps: [] })

			const bcryptCompare = jest.fn().mockResolvedValueOnce(true);
			(bcrypt.compare as jest.Mock) = bcryptCompare

			const tokens = { access_token: "access", refresh_token: "refresh" }
			jest.spyOn(authService, "GenerateTokens").mockResolvedValueOnce(tokens)

			const service = await authService.UserSignIn(userSignInDTO)
			expect(service).toEqual({ user: verifiedUser, tokens: { access_token: expect.any(String), refresh_token: expect.any(String) } })
			expect(userService.GetAUserByEmail).toHaveBeenCalledWith(userSignInDTO.email)
			expect(userService.GetAUserByEmail).toHaveBeenCalledTimes(1)
			expect(userService.UpdateUser).toHaveBeenCalledTimes(1)
			expect(userService.UpdateUser).toHaveBeenCalledWith("1", { lastLogin: expect.any(Date) })
		})
	})

	describe("User change password", () => {
		const userChangePasswordDTO = { oldPassword: "old", newPassword: "new passwod" }
		test("should throw an error if user with id does not exist", async () => {
			jest.spyOn(userService, "GetAUserById").mockResolvedValueOnce(null)

			await expect(authService.ChangePassword("1", userChangePasswordDTO.oldPassword, userChangePasswordDTO.newPassword)).rejects.toThrow()
			expect(userService.GetAUserById).toHaveBeenCalledWith("1")
			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
		})

		test("it should throw an error if user exist but incorrect password", async () => {
			(bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValueOnce(false)

			jest.spyOn(userService, "GetAUserById").mockResolvedValueOnce(userMock)
			await expect(authService.ChangePassword("1", userChangePasswordDTO.oldPassword, userChangePasswordDTO.newPassword)).rejects.toThrow()

			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserById).toHaveBeenCalledWith("1")
		})

		test("it should throw an error if the passwords are the same", async () => {

			(bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValueOnce(true)

			jest.spyOn(userService, "GetAUserById").mockResolvedValueOnce(userMock)
			await expect(authService.ChangePassword("1", "same", "same")).rejects.toThrow()

			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserById).toHaveBeenCalledWith("1")
		})

		test("it should successfully change the passwords", async () => {

			(bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValueOnce(true)

			jest.spyOn(userService, "GetAUserById").mockResolvedValueOnce(userMock)

			const service = await authService.ChangePassword("id", userChangePasswordDTO.oldPassword, userChangePasswordDTO.newPassword)

			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserById).toHaveBeenCalledWith("id")
			expect(userService.UpdateUser).toHaveBeenCalledTimes(1)
			expect(userService.UpdateUser).toHaveBeenCalledWith("id", { password: expect.any(String) })
		})
	})
})
