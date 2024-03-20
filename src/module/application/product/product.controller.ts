import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "../authentication/auth.guard";
import { AuthUser } from "src/decorators/auth-user";
import { CreateProductDTO } from "./dto/create-product.dto";

@Controller("Product")
export class ProductController {
	constructor(private productService: ProductService) { }

	@UseGuards(AuthGuard)
	@Post("/create-product")
	async CreateProduct(@AuthUser() user: string, @Body() body: CreateProductDTO) {
		const product = await this.productService.CreateProduct(user, body)
		return { message: "Product has been created successfully", data: product }
	}
}
