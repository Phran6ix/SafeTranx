import { GenerateUser } from "../../authentication/utils/generate";
import { Product } from "../schema/product.schema";
import { faker } from "@faker-js/faker";
export const GenerateProductData = (): Product => {
	const user = GenerateUser()
	return { name: faker.commerce.productName(), description: faker.commerce.productDescription(), price: faker.commerce.price(), user } as Product
}
