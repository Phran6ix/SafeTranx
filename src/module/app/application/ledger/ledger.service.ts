import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ledger } from "./schema/ledgers.schema";
import { Repository } from "typeorm";
import { Paginate } from "src/common/utils/helper";
import { CreditInsertLedgerDTO, DebitInsertLedgerDTO } from "./dto/insert-ledger.dto";


@Injectable()
export class LedgerService {
	constructor(
		@InjectRepository(Ledger)
		private readonly ledgerRepository: Repository<Ledger>
	) { }

	async GetLedger(filter: { page: number, limit?: number }): Promise<{ ledger: Ledger[] }> {
		let page = filter.page || 1
		let limit = filter.limit || 10
		const paginate = Paginate(page, limit)

		const ledger = await this.ledgerRepository.find({
			order: {
				date: "DESC"
			},
			skip: paginate.offset,
			take: paginate.limit,
			select: {
				id: true,
				amount: true,
				currency: true,
				date: true
			}
		})

		return { ledger }
	}

	async GetALedgerDocument({ ledgerId }: { ledgerId: string }): Promise<{ document: Ledger }> {
		const document = await this.ledgerRepository.findOne(
			{
				where:
					{ id: ledgerId }
			}
		)

		if (!document) {
			throw new NotFoundException("Document not found")
		}
		return { document }
	}

	async InsertCreditDocumentToLedger(data: CreditInsertLedgerDTO): Promise<void> {
		const entry = new Ledger()
		entry.payIn = data.payIn
		entry.amount = data.amount
		entry.walletCredited = data.walletCredited
		entry.currency = data.currency

		await this.ledgerRepository.save(entry)
		return
	}
	async InsertDebitDocumentToLedger(data: DebitInsertLedgerDTO): Promise<void> {
		const entry = new Ledger()
		entry.payOut = data.payOut
		entry.amount = data.amount
		entry.walletDebited = data.walletDebited
		entry.currency = data.currency

		await this.ledgerRepository.save(entry)
		return
	}
}
