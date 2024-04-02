import { Test } from "@nestjs/testing"
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm"
import { Wallet } from "./schema/wallet.schema"
import { WalletService } from "./wallet.service"
import { WalletController } from "./wallet.controller"
import { Repository } from "typeorm"
import { HttpException } from "@nestjs/common"
import { GenerateTestWalletData } from "./utils/generate"
import { WALLET_STATUS } from "./schema/wallet.enums"
import { typeormConfig } from "../../../../configs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { async } from "rxjs"


describe("Wallet Service", () => {
	let walletRepo: Repository<Wallet>;
	let walletService: WalletService
	let walletRepoToken = getRepositoryToken(Wallet)
	beforeEach(() => {
		jest.clearAllMocks()
	})

	beforeAll(async () => {

		const module = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot(typeormConfig),

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
				}),
			],
			providers: [
				WalletService,
				{
					provide: walletRepoToken,
					useValue: {
						findOneBy: jest.fn(),
						save: jest.fn(),
						update: jest.fn(() => { console.log("jenojnro") })
					}
				},
				ConfigService
			],
			controllers: [WalletController]
		}).compile()

		walletRepo = module.get<Repository<Wallet>>(walletRepoToken)
		walletService = module.get<WalletService>(WalletService)
	})

	describe("Get user wallet", () => {
		test("it should throw a 404 if user does not have a wallet", async () => {
			const userId = "userId"
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(null)

			await expect(walletService.GetUserWallet(userId)).rejects.toThrow(HttpException)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
			expect(walletRepo.findOneBy).toHaveBeenCalledWith({ userId })
		})

		test("it should throw a forbidden error if the wallet is blocked", async () => {
			const userId = "userId"
			const walletData = GenerateTestWalletData({ status: WALLET_STATUS.BLOCKED })

			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(walletData)

			await expect(walletService.GetUserWallet(userId)).rejects.toThrow(HttpException)

			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
			expect(walletRepo.findOneBy).toHaveBeenCalledWith({ userId })
		})

		test("it should throw a forbidden error if the wallet is suspended", async () => {
			const userId = "userId"
			const walletData = GenerateTestWalletData({ status: WALLET_STATUS.SUSPENDED })

			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(walletData)

			await expect(walletService.GetUserWallet(userId)).rejects.toThrow(HttpException)

			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
			expect(walletRepo.findOneBy).toHaveBeenCalledWith({ userId })
		})

		test("it should return the wallet object if wallet iexist and is active", async () => {
			const userId = "userId"
			const walletData = GenerateTestWalletData({ status: WALLET_STATUS.ACTIVE })

			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(walletData)
			const service = await walletService.GetUserWallet(userId)
			expect(service).toStrictEqual({ wallet: walletData })

			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
			expect(walletRepo.findOneBy).toHaveBeenCalledWith({ userId })
		})
	})

	describe("Create wallet", () => {
		test("it should a 403 error if user already has a wallet", async () => {
			const userId = "userId"
			let existingWallet = GenerateTestWalletData()
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(existingWallet)

			await expect(walletService.CreateAWallet(userId)).rejects.toThrow(HttpException)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
			expect(walletRepo.findOneBy).toHaveBeenCalledWith({ userId })
		})

		test("it should create a wallet successfully ", async () => {
			const userId = "userId"
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(null)
			let wallet = GenerateTestWalletData({ userId })
			jest.spyOn(walletRepo, "save").mockResolvedValueOnce(wallet)
			const service = await walletService.CreateAWallet(userId)

			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
			expect(walletRepo.findOneBy).toHaveBeenCalledWith({ userId })

			expect(walletRepo.save).toHaveBeenCalledTimes(1)
		})
	})

	describe("Debit Wallet Balance", () => {
		let payload = { amount: "100", currency: "NGN", description: "For test" }
		test("it should throw if wallet does not exist", async () => {
			const userId: string = "userId"

			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(null)
			await expect(walletService.DebitWalletBalance({ userId, ...payload })).rejects.toThrow(HttpException)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
		})

		test("it should an error if the wallet is not active", async () => {
			let userId = "id"
			let wallet = GenerateTestWalletData({ status: WALLET_STATUS.BLOCKED, balance: "99" })
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(wallet)
			await expect(walletService.DebitWalletBalance({ userId, ...payload })).rejects.toThrow(HttpException)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
		})

		test("it should an error if the wallet has insufficient balance", async () => {
			let userId = "id"
			let wallet = GenerateTestWalletData({ status: WALLET_STATUS.ACTIVE, balance: "99" })
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(wallet)
			await expect(walletService.DebitWalletBalance({ userId, ...payload })).rejects.toThrow(HttpException)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
		})

		test("it should an error if the wallet is active and has sufficient balance", async () => {
			let userId = "id"
			let wallet = GenerateTestWalletData({ status: WALLET_STATUS.ACTIVE, balance: "200.8452" })
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(wallet)
			jest.spyOn(walletRepo, "update").mockResolvedValueOnce({ raw: "1", generatedMaps: [] })

			await expect(walletService.DebitWalletBalance({ userId, ...payload })).resolves.toBeUndefined()

			expect(walletRepo.update).toHaveBeenCalledTimes(1)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)

		})

	})

	describe("Credit Wallet Balance", () => {
		let payload = { amount: "100", currency: "NGN", description: "For test" }
		test("it should throw if wallet does not exist", async () => {
			const userId: string = "userId"

			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(null)
			await expect(walletService.DebitWalletBalance({ userId, ...payload })).rejects.toThrow(HttpException)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
		})

		test("it should an error if the wallet is not active", async () => {
			let userId = "id"
			let wallet = GenerateTestWalletData({ status: WALLET_STATUS.BLOCKED, balance: "99" })
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(wallet)
			await expect(walletService.DebitWalletBalance({ userId, ...payload })).rejects.toThrow(HttpException)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
		})

		test("it should an error if the wallet has insufficient balance", async () => {
			let userId = "id"
			let wallet = GenerateTestWalletData({ status: WALLET_STATUS.ACTIVE, balance: "99" })
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(wallet)

			await expect(walletService.DebitWalletBalance({ userId, ...payload })).rejects.toThrow(HttpException)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)
		})

		test("it should not throw error if the wallet is active and has sufficient balance", async () => {
			let userId = "id"
			let wallet = GenerateTestWalletData({ status: WALLET_STATUS.ACTIVE, balance: "200.8452" })
			jest.spyOn(walletRepo, "findOneBy").mockResolvedValueOnce(wallet)
			jest.spyOn(walletRepo, "update").mockResolvedValueOnce({ raw: "q", generatedMaps: [] })

			await expect(walletService.DebitWalletBalance({ userId, ...payload })).resolves.toBeUndefined()

			expect(walletRepo.update).toHaveBeenCalledTimes(1)
			expect(walletRepo.findOneBy).toHaveBeenCalledTimes(1)

		})

	})
})
