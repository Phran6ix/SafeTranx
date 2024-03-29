import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CURRENCY } from "../../wallet/schema/wallet.enums";

@Entity("Ledger")
export class Ledger {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({ type: String })
	walletCredited: string

	@Column({ type: String })
	walletDebited: string

	@Column({ type: String })
	amount: string

	@Column({ type: String })
	currency: CURRENCY

	@Column({ type: Boolean, nullable: true })
	payIn: boolean

	@Column({ type: Boolean, nullable: true })
	payOut: boolean

	@Column({ type: Date, default: new Date() })
	date: Date
}
