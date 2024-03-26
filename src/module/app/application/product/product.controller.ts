import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "../authentication/auth.guard";
import { AuthUser } from "../../../../decorators/auth-user";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";

@Controller("Product")
export class ProductController {
	constructor(private productService: ProductService) { }

	@UseGuards(AuthGuard)
	@Post("/create-product")
	async CreateProduct(@AuthUser() user_id: string, @Body() body: CreateProductDTO) {
		const product = await this.productService.CreateProduct(user_id, body)
		return { message: "Product has been created successfully", data: product }
	}

	@Get("/all_products")
	async GetAllProducts(@Query("page") page: string) {
		const products = await this.productService.GetAllProducts(+page)
		return { message: "All products have been fetched successfully", data: products }
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get("/user/my-products")
	async GetMyProducts(@AuthUser() user_id: string, @Query("page") page: number) {
		const products = await this.productService.GetAUserProducts(user_id, page)
		return { message: "User products have been fetched successfully", data: products }
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get("/user/products/:user_id")
	async GetAUserProducts(@Param("user_id") user_id: string, @Query("page") page: number) {
		const products = await this.productService.GetAUserProducts(user_id, page)
		return { message: "User products have been fetched successfully", data: products }
	}
	@UseGuards(AuthGuard)
	@Patch("/user/update-products")
	async UpdateAUserProducts(@AuthUser() user_id: string, @Query("productId") productId: string, @Body() body: UpdateProductDTO) {
		const product = await this.productService.UpdateAProduct(productId, user_id, body)
		return { message: "Product has been updated successfully", data: product }
	}

	@Get("/product/:id")
	@UseGuards(AuthGuard)
	async GetAProduct(@Param("id") id: string) {
		const product = await this.productService.GetAProduct(id)
		return { message: "Product has been fetched successfully", data: product }
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete("/product/:id")
	@UseGuards(AuthGuard)
	async DeleteAProduct(@AuthUser() user_id: string, @Query("productId") productId: string) {
		const product = await this.productService.DeleteAUserProduct(productId, user_id)
		return { message: "Product has been deleted succesfully", data: product }
	}
}
