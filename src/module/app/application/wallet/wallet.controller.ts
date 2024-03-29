import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { AuthGuard } from "../authentication/auth.guard";
import { AuthUser } from "../../../../decorators/auth-user";

@Controller("Wallet")
export class WalletController {
	constructor(
		private readonly walletService: WalletService
	) { }

	@Get("/my-wallet")
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async GetMyWallet(@AuthUser() user_id: string) {
		const service = await this.walletService.GetUserWallet(user_id)
		return { message: "Wallet has been fetched successfully", data: service }
	}
}
