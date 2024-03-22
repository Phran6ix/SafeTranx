import { Repository } from "typeorm";
import { Product } from "./product.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UserService } from "../user/user.service";
import { NotFoundError } from "rxjs";

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private productRepo: Repository<Product>,
		private userService: UserService,
	) {
	}

	async CreateProduct(userId: string, data: CreateProductDTO): Promise<{ product: Product }> {
		const user = await this.userService.GetAUserById(userId)
		if (!user) {
			throw new NotFoundException("User with this id not found")
		}


		const product = new Product()
		product.user = user;
		product.name = data.name;
		product.description = data.description
		product.price = data.price

		await this.productRepo.save(product)
		return { product }
	}

}
