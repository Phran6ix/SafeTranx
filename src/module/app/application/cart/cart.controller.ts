import { Controller, Delete, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AuthGuard } from "../authentication/auth.guard";
import { AuthUser } from "src/decorators/auth-user";

@Controller("Cart")
export class CartController {
	constructor(private cartService: CartService) { }

	@UseGuards(AuthGuard)
	@Get("/my-cart")
	async GetUserCart(@AuthUser() userId: string) {
		const cart = await this.cartService.GetuserCart(userId)
		return { message: "Cart has been fetched successfully", data: cart }
	}

	@UseGuards(AuthGuard)
	@Patch("/add-product")
	async AddProductToCart(@AuthUser() userId: string, @Query("product") product: string) {
		const cart = await this.cartService.AddProductToCart(userId, product)
		return { message: "Product has been added to cart", data: cart }
	}

	@UseGuards(AuthGuard)
	@Delete("/delete-product")
	async RemoveProductFromCart(@Query("cartId") cartId: string, @Query("product") product: string) {
		const cart = await this.cartService.RemoveProductFromCart(cartId, product)
		return { message: "Product has been removed from cart", data: cart }
	}

	@UseGuards(AuthGuard)
	@Delete("/clear-cart")
	async ClearCart(@Query("cartId") cartId: string) {
		await this.cartService.ClearProductsFromCart(cartId)
		return { message: "Cart has been cleared", data: null }
	}
}
