import { IsNotEmpty } from "class-validator";

export class CreateProductDTO {
	@IsNotEmpty()
	name: string


	@IsNotEmpty()
	description: string

	@IsNotEmpty()
	price: string

}
