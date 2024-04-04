import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentOrder } from "./paymentOrder.schema";
import { WALLET_STATUS } from "../../wallet/schema/wallet.enums";
import { Checkout } from "../../checkout/checkout.schema";

@Entity("PaymentEvent")
export class PaymentEvent {
	@PrimaryGeneratedColumn("uuid")
	eventId: string

	@Column({ type: String })
	buyerId: string

	@Column({ type: String })
	checkoutId: string

	@Column()
	paymentStatus: WALLET_STATUS

	@OneToOne(() => Checkout)
	@JoinColumn()
	checkout: Checkout

	@OneToMany(() => PaymentOrder, (order) => order.paymentEvent)
	paymentOrders: PaymentOrder[]
}

