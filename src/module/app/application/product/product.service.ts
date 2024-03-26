import { Repository } from "typeorm";
import { Product } from "./schema/product.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UserService } from "../user/user.service";
import { NotFoundError } from "rxjs";
import { Paginate } from "../../../../common/utils/helper";

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
		console.log('produc', product)
		await this.productRepo.save(product)
		return { product }
	}

	async GetAUserProducts(userId: string, page: number = 1): Promise<{ products: Product[] }> {
		const user = await this.userService.GetAUserById(userId)
		if (!user) {
			throw new NotFoundException("User with ID not found")
		}
		let paginate = Paginate(page)
		console.log(paginate)
		const products = await this.productRepo.find({
			relations: {
				user: true
			},
			where: {
				user
			},
			order: {
				created_at: "DESC"
			},
			skip: paginate.offset,
			take: paginate.limit
		})

		return { products }
	}

	async GetAProduct(productId: string): Promise<{ product: Product }> {
		const product = await this.productRepo.findOneBy({ id: productId })
		if (!product) {
			throw new NotFoundException("Product with this ID not found")
		}

		return { product }
	}

	async UpdateAProduct(productId: string, userId: string, payload: Omit<Partial<Product>, "id">): Promise<{ product: unknown }> {
		const product = await this.productRepo.findOneBy({
			user: {
				id: userId
			},
			id: productId
		})

		if (!productId) {
			throw new NotFoundException("Product cannot be updated")
		}
		await this.productRepo.update({ id: product.id }, { ...payload })
		return
	}

	async GetAllProducts(page: number = 1): Promise<{ products: Product[] }> {
		const paginate = Paginate(page)
		const products = await this.productRepo.find({
			relations: {
				user: true
			},
			take: paginate.limit,
			skip: paginate.offset,
			order: {
				created_at: "DESC"
			}
		})

		return { products }
	}

	async DeleteAUserProduct(productId: string, userId: string): Promise<void> {
		const user = await this.userService.GetAUserById(userId)
		if (!user) {
			throw new NotFoundException("User not found")
		}

		await this.productRepo.delete({ id: productId, user })
		return
	}
}
