import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./schema/product.schema";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { UserService } from "../user/user.service";
import { UserRepository } from "../user/user.repository";

@Module({
	providers: [UserService, ProductService, UserRepository],
	imports: [TypeOrmModule.forFeature([Product])],
	controllers: [ProductController],
	exports: []
})

export class ProductClass { }
