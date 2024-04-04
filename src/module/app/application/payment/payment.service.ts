import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEvent } from "./schema/paymemtEvent.schema";
import { Repository } from "typeorm";
import { PaymentOrder } from "./schema/paymentOrder.schema";
import { CreateEventDTO } from "./dto/create-event.dto";
import { CreateOrderDTO } from "./dto/create-order.dto";

@Injectable()
export class PaymentService {
	constructor(
		@InjectRepository(PaymentEvent)
		private readonly paymentEventRepo: Repository<PaymentEvent>,

		@InjectRepository(PaymentOrder)
		private readonly paymentOrderRepo: Repository<PaymentOrder>
	) { }

	async CreatePaymentEvent(data: CreateEventDTO): Promise<{ event: PaymentEvent }> {
		const event = new PaymentEvent()
		event.checkoutId = data.checkoutId
		event.buyerId = data.buyerId
		event.checkout = data.checkout as any

		await this.paymentEventRepo.save(event)
		return { event }
	}

	async CreatePaymentOrder(data: CreateOrderDTO): Promise<{ order: PaymentOrder }> {
		const order = new PaymentOrder()
		order.currency = data.currency
		order.amount = data.amount
		order.product_id = data.product_id
		order.paymentEvent = data.paymentEvent

		await this.paymentOrderRepo.save(order)
		return { order }
	}

}
