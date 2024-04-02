import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Cart } from "./schema/cart.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "../user/user.service";
import { OnEvent } from "@nestjs/event-emitter";
import { Product } from "../product/schema/product.schema";
import { ro } from "@faker-js/faker";
import { ProductService } from "../product/product.service";

@Injectable()
export class CartService {
	constructor(
		@InjectRepository(Cart)
		private readonly cartRepository: Repository<Cart>,
		private readonly userService: UserService,
		private readonly productService: ProductService
	) { }

	async GetuserCart(userId: string): Promise<{ cart: Cart }> {
		const cart = await this.cartRepository.findOne({
			where: {
				user: {
					id: userId
				}
			},
		})

		return { cart }
	}

	async CreateUserCart(userId: string): Promise<void> {
		const user = await this.userService.GetAUserById(userId)
		if (!user) {
			throw new NotFoundException("user mot found")
		}

		const newCart = new Cart()
		newCart.user = user

		await this.cartRepository.save(newCart)
		return
	}

	async AddProductToCart(cartId: string, productId: string): Promise<{ cart: Cart }> {
		const cart = await this.cartRepository.findOne({
			where: {
				cartId
			}
		})
		const { product } = await this.productService.GetAProduct(productId)

		cart.products.push(product)

		await this.cartRepository.save(cart)

		return { cart }
	}

	async RemoveProductFromCart(cartId: string, productId: string): Promise<void> {
		const cart = await this.cartRepository.findOne({
			where: {
				cartId
			}
		})

		const updatedCartProduct = cart.products.filter((product: Product) => product.id != productId)
		cart.products = updatedCartProduct
		console.log(updatedCartProduct)

		await this.cartRepository.save(cart)
		return
	}

	async ClearProductsFromCart(cartId: string): Promise<void> {
		const cart = await this.cartRepository.findOne({
			where: {
				cartId
			}
		})

		cart.products = []
		await this.cartRepository.save(cart)
	}
}
