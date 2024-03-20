import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.schema";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { UserService } from "../user/user.service";

@Module({
	providers: [UserService, ProductService],
	imports: [TypeOrmModule.forFeature([Product])],
	controllers: [ProductController],
	exports: []
})

export class ProductClass { }
