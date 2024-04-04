import { Test } from "@nestjs/testing"
import { UserService } from "../user/user.service"
import { ProductService } from "./product.service"
import { Product } from "./schema/product.schema"
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm"
import { ProductController } from "./product.controller"
import { HttpException } from "@nestjs/common"
import { GenerateUser } from "../authentication/utils/generate"
import { Repository } from "typeorm"
import { typeormConfig } from "../../../../configs/typeorm"
import { User } from "../user/schema/user.schema"
import { AuthModule } from "../authentication/auth.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AppModule } from "../../app.module"
import { JwtModule } from "@nestjs/jwt"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { CacheModule } from "@nestjs/cache-manager"
import { faker } from "@faker-js/faker"
import { GenerateProductData } from "./utils/generate"

describe("Product Spec", () => {
	// let productRepo
	let userService: UserService
	let productRepo: Repository<Product>

	let productService: ProductService;

	const product_repo_token = getRepositoryToken(Product)
	beforeEach(() => {
		jest.clearAllMocks()
	})

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UserService,
				ProductService,
				ConfigService,
				{
					provide: product_repo_token,
					useValue: {
						findOneBy: jest.fn(),
						save: jest.fn(),
						find: jest.fn()
					}
				}],

			imports: [
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
				EventEmitterModule.forRoot(),
				CacheModule.register(),
				TypeOrmModule.forRoot(typeormConfig),
				TypeOrmModule.forFeature([User]),
			],
			controllers: [ProductController],
			exports: []
		}).compile()

		userService = module.get<UserService>(UserService)
		productService = module.get<ProductService>(ProductService)
		productRepo = module.get<Repository<Product>>(product_repo_token)
	})


	describe("Create a product", () => {
		const data = { name: "name", description: "description", price: "100" }
		test("it should return a 404 if user with the id does not exist", async () => {
			jest.spyOn(userService, "GetAUserById").mockResolvedValue(null)

			await expect(productService.CreateProduct("1", data)).rejects.toThrow(HttpException)

			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserById).toHaveBeenCalledWith("1")
		})
		test("it should create a product", async () => {
			let user = GenerateUser()
			jest.spyOn(userService, "GetAUserById").mockResolvedValue(user)

			const service = await productService.CreateProduct("1", data)

			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserById).toHaveBeenCalledWith("1")
			// expect(productRepo.save).toHaveBeenCalledTimes(1)
			expect(productRepo.save).toHaveBeenCalledWith({ user, ...data })
			expect(service).toEqual({ product: { user, ...data } })
		})
	})

	describe("Get a User Products", () => {
		let user = GenerateUser()
		let products = []
		for (let i = 0; i < 10; i++) {
			products.push(GenerateProductData())
		}

		test("it should throw a 404 error if user with id does not exist", async () => {
			jest.spyOn(userService, "GetAUserById").mockResolvedValueOnce(null)

			await expect(productService.GetAUserProducts(user.id)).rejects.toThrow(HttpException)
			expect(userService.GetAUserById).toHaveBeenCalledWith(user.id)
			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
			expect(productRepo.find).not.toHaveBeenCalled()
		})
		test("it should return an empty array if user does not have products", async () => {
			jest.spyOn(userService, "GetAUserById").mockResolvedValueOnce(user)
			jest.spyOn(productRepo, "find").mockResolvedValueOnce([])

			const service = await productService.GetAUserProducts(user.id)

			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserById).toHaveBeenCalledWith(user.id)
			expect(productRepo.find).toHaveBeenCalledTimes(1)
			expect(service).toEqual({ products: [] })
		})

		test("it should product list if user has has products", async () => {
			jest.spyOn(userService, "GetAUserById").mockResolvedValueOnce(user)
			jest.spyOn(productRepo, "find").mockResolvedValueOnce(products)

			const service = await productService.GetAUserProducts(user.id)

			expect(userService.GetAUserById).toHaveBeenCalledTimes(1)
			expect(userService.GetAUserById).toHaveBeenCalledWith(user.id)
			expect(productRepo.find).toHaveBeenCalledTimes(1)
			expect(service).toStrictEqual({ products })
		})
	})

	describe("Get A Product", () => {
		let user = GenerateUser()
		const product = GenerateProductData()
		test("it should throw a error if the product does not exist", async () => {
			jest.spyOn(productRepo, "findOneBy").mockResolvedValueOnce(null)

			await expect(productService.GetAProduct("1")).rejects.toThrow(HttpException)
			expect(productRepo.findOneBy).toHaveBeenCalledTimes(1)
			expect(productRepo.findOneBy).toHaveBeenCalledWith({ id: "1" })
		})

		test("it should return product details if the product exist", async () => {
			jest.spyOn(productRepo, "findOneBy").mockResolvedValueOnce(product as Product)

			const service = await productService.GetAProduct("1")
			expect(productRepo.findOneBy).toHaveBeenCalledTimes(1)
			expect(productRepo.findOneBy).toHaveBeenCalledWith({ id: "1" })
			expect(service).toEqual({ product })
		})
	})
})

