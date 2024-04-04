import { IsEnum, IsNotEmpty } from "class-validator";
import { min } from "rxjs";
import { CURRENCY } from "../../wallet/schema/wallet.enums";
import { PaymentEvent } from "../schema/paymemtEvent.schema";

export class CreateOrderDTO {
	@IsNotEmpty()
	product_id: string

	@IsNotEmpty()
	amount: string

	@IsNotEmpty()
	@IsEnum(CURRENCY)
	currency: string

	@IsNotEmpty()
	paymentEvent: PaymentEvent
}
