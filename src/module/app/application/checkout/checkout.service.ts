import { Injectable } from "@nestjs/common";
import { CartService } from "../cart/cart.service";
import { PaymentEvent } from "../payment/schema/paymemtEvent.schema";
import { Checkout } from "./checkout.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentOrder } from "../payment/schema/paymentOrder.schema";
import { CURRENCY } from "../wallet/schema/wallet.enums";

@Injectable()
export class CheckoutService {
	constructor(
		private cartService: CartService,
		@InjectRepository(Checkout)
		private readonly checkoutRepository: Repository<Checkout>

	) { }

	async CheckoutCart(cartId: string) {
		const { cart } = await this.cartService.GetCartById(cartId)
		const checkout = new Checkout()
		checkout.userId = cart.user.id

	}

}
