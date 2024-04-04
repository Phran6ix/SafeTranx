import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm"
import { typeormConfig } from "../../../../configs/typeorm"
import { CartService } from "./cart.service"
import { CartController } from "./cart.controller"
import { Test } from "@nestjs/testing"
import { Repository } from "typeorm"
import { Cart } from "./schema/cart.schema"
import { UserService } from "../user/user.service"
import { ProductService } from "../product/product.service"
import { GenerateCartData } from "./utils/generate"
import { GenerateProductData } from "../product/utils/generate"
import { NotFoundException } from "@nestjs/common"
import { User } from "../user/schema/user.schema"
import { Product } from "../product/schema/product.schema"

let cartService: CartService;
let productService: ProductService;
let cartRepository: Repository<Cart>
let userService: UserService

const cartRepoToken = getRepositoryToken(Cart)

beforeAll(async () => {
	const module = await Test.createTestingModule({
		imports: [
			TypeOrmModule.forRoot(typeormConfig),
			TypeOrmModule.forFeature([User, Product]),
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
			CartService,
			{
				provide: cartRepoToken,
				useValue: {
					findOne: jest.fn(),
					save: jest.fn(),
				}
			},
			ConfigService,
			UserService,
			ProductService,
		],
		controllers: [CartController]
	}).compile()
	cartService = module.get<CartService>(CartService)
	cartRepository = module.get<Repository<Cart>>(cartRepoToken)
	userService = module.get<UserService>(UserService)
	productService = module.get<ProductService>(ProductService)
})

beforeEach(() => {
	jest.clearAllMocks()
})

describe("Cart Service", () => {
	const mockCart = GenerateCartData()
	describe("Get User Cart", () => {
		it("should return the cart ", async () => {
			jest.spyOn(cartRepository, "findOne").mockResolvedValueOnce(mockCart)

			const service = await cartService.GetuserCart("id")
			expect(service).toBeDefined()
			expect(service).toHaveProperty("cart")
			expect(cartRepository.findOne).toHaveBeenCalledTimes(1)
			expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { user: { id: "id" } } })
		})
	})

	describe("Add product to cart", () => {
		const product = GenerateProductData()
		test("it should throw an error if product not found", async () => {
			jest.spyOn(cartRepository, "findOne").mockResolvedValueOnce(mockCart)
			jest.spyOn(productService, "GetAProduct").mockRejectedValueOnce(new NotFoundException("Product not found"))

			await expect(cartService.AddProductToCart("carId", "productId")).rejects.toThrow(NotFoundException)
			expect(cartRepository.findOne).toHaveBeenCalledTimes(1)
			expect(productService.GetAProduct).toHaveBeenCalledTimes(1)
		})

		test("it should add product and call save method", async () => {
			jest.spyOn(productService, "GetAProduct").mockResolvedValueOnce({ product })
			jest.spyOn(cartRepository, "findOne").mockResolvedValueOnce(mockCart)

			await cartService.AddProductToCart("cartId", "productId")
			expect(productService.GetAProduct).toHaveBeenCalledTimes(1)
			expect(productService.GetAProduct).toHaveBeenCalledWith("productId")
			expect(productService.GetAProduct).toBeDefined()
			expect(cartRepository.findOne).toHaveBeenCalledTimes(1)
		})
	})

	describe("Remove product from cart", () => {
		test("it should successfully remove product from cart", async () => {
			const mockedCart = {
				cartId: "cartId",
				products: [
					{ id: "prod1" },
					{ id: "prod2" },
					{ id: "prod3" }
				]
			} as Cart

			jest.spyOn(cartRepository, "findOne").mockResolvedValueOnce(mockedCart)
			await cartService.RemoveProductFromCart("cartId", "prod1")

			expect(cartRepository.findOne).toHaveBeenNthCalledWith(1, { where: { cartId: "cartId" } })
			expect(mockedCart.products).toHaveLength(2)
			expect(mockedCart.products.map((product) => product.id)).not.toContain("prod1")
		})
	})
})
