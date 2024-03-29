import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEvent } from "./schema/paymemtEvent.schema";
import { Repository } from "typeorm";
import { PaymentOrder } from "./schema/paymentOrder.schema";

@Injectable()
export class PaymentService {
	constructor(
		@InjectRepository(PaymentEvent)
		private readonly paymentEventRepo: Repository<PaymentEvent>,

		@InjectRepository(PaymentOrder)
		private readonly paymentOrderRepo: Repository<PaymentOrder>
	) { }

	
}
