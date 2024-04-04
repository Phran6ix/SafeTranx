import { Controller, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { LedgerService } from "./ledger.service";

@Controller("Ledger")
export class LedgerController {
	constructor(
		private ledgerService: LedgerService
	) { }

	@Get("/all-entries")
	@HttpCode(HttpStatus.OK)
	async GetAllLedgerEntries(@Query("page") page: string) {
		const service = await this.ledgerService.GetLedger({ page: +page })
		return { message: "Ledger has been fetched successfully", data: service }
	}

	@Get("/entry/:id")
	@HttpCode(HttpStatus.OK)
	async GetALedgerEntry(@Param("id") id: string) {
		const service = await this.ledgerService.GetALedgerDocument({ ledgerId: id })
		return { message: "Ledger entry has been fetched successfully", data: service }
	}
}

