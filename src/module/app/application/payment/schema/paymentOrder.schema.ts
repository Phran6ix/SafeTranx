import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentEvent } from "./paymemtEvent.schema";
import { CURRENCY } from "../../wallet/schema/wallet.enums";

@Entity("PaymentOrder")
export class PaymentOrder {
	@PrimaryGeneratedColumn("uuid")
	order_id: string

	@Column({type: String})
	product_id: string

	@Column({type: String})
	amount: string

	@Column({type: String})
	currency: CURRENCY

	@Column({type: Boolean, default: false})
	walletUpdated: boolean

	@Column({type: Boolean, default: false})
	ledgerUpdated: boolean

	@Column({type:Date, default: new Date()})
	dateInitiated: Date

	@ManyToOne(() => PaymentEvent, (event) => event.paymentOrders)
	paymentEvent: PaymentEvent
}
