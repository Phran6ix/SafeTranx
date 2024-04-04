import { IsNotEmpty } from "class-validator";

export class CreateEventDTO {
	@IsNotEmpty()
	buyerId: string

	@IsNotEmpty()
	checkoutId: string

	@IsNotEmpty()
	checkout : object

	order: object[]
}
