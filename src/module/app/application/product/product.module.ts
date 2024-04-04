import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./schema/product.schema";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { UserService } from "../user/user.service";
import { User } from "../user/schema/user.schema";

@Module({
	providers: [UserService, ProductService ],
	imports: [TypeOrmModule.forFeature([Product, User])],
	controllers: [ProductController],
	exports: []
})

export class ProductClass { }
