import { Injectable } from "@nestjs/common";
import { CartService } from "../cart.service";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class CartEventListener {
	constructor(private readonly cartService: CartService) { }

	@OnEvent("create-cart", { async: true })
	async CreateUserCart(event: { user: string }) {
		console.log("create cart ")
		console.log(event)
		await this.cartService.CreateUserCart(event.user)

	}
}
