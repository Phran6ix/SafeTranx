import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentOrder } from "./paymentOrder.schema";
import { WALLET_STATUS } from "../../wallet/schema/wallet.enums";

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

	@OneToMany(() => PaymentOrder, (order) => order.paymentEvent)
	paymentOrders: PaymentOrder[]
}

