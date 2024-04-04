import { IsEnum, IsNotEmpty } from "class-validator"
import { CURRENCY } from "../../wallet/schema/wallet.enums"

export class CreditInsertLedgerDTO {
	@IsNotEmpty()
	walletCredited: string

	@IsNotEmpty()
	amount: string

	@IsNotEmpty()
	@IsEnum(CURRENCY)
	currency: string

	@IsNotEmpty()
	payIn: true
}

export class DebitInsertLedgerDTO {

	@IsNotEmpty()
	walletDebited: string

	@IsNotEmpty()
	amount: string

	@IsNotEmpty()
	@IsEnum(CURRENCY)
	currency: string

	@IsNotEmpty()
	payOut: true
}
