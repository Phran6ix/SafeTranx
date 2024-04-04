import { faker } from "@faker-js/faker";
import { Cart } from "../schema/cart.schema";
import { GenerateUser } from "../../authentication/utils/generate";
import { Product } from "../../product/schema/product.schema";
import { GenerateProductData } from "../../product/utils/generate";

const product = Array(4).fill(1).map(() => GenerateProductData())
export const GenerateCartData = (): Cart => {
	return {
		cartId: faker.string.uuid(),
		subTotal: faker.string.numeric(),
		discounts: [],
		products: [...product],
		user: GenerateUser()
	}
}
