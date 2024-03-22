import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "smtpexpress";
import { SendMailOptions } from "smtpexpress/dist/src/helpers/types";

@Injectable()
export class MailerService {
	constructor(private configService: ConfigService) { }
	private readonly client = createClient({
		projectId: this.configService.get<string>("SMTP_PROJECT_ID"),
		projectSecret: this.configService.get<string>("SMTP_PROJECT_SECRET")
	})

	async SendEmail(payload: SendMailOptions): Promise<{ message: string, statusCode: number, data: any }> {
		return this.client.sendApi.sendMail(payload)
	}
}
