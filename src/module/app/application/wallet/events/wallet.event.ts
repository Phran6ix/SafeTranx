import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { WalletService } from "../wallet.service";

@Injectable()
export class WalletEventListener {
	constructor(private walletService: WalletService) { }

	@OnEvent("create.wallet", { async: true })
	async handleCreateWalletEvent(event: { userId: string }) {
		console.log("Wallet Creation Event has been triggered")
		console.log(event)
		await this.walletService.CreateAWallet(event.userId)

	}
}
