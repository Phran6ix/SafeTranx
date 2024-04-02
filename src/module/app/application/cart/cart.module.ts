import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./schema/cart.schema";
import { UserService } from "../user/user.service";
import { ProductService } from "../product/product.service";
import { User } from "../user/schema/user.schema";
import { Product } from "../product/schema/product.schema";

@Module({
	controllers: [CartController],
	providers: [CartService, UserService, ProductService],
	imports: [TypeOrmModule.forFeature([Cart, Product, User])]

})
export class CartModule { }
