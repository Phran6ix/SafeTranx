import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from "../module/application/product/product.schema";
import { User } from "../module/application/user/schema/user.schema";

export const typeormConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: 'localhost',
  port: 5432,
  username: 'safe_tranx',
  password: 'password',
  database: 'safe_tranx',
  entities: [User, Product],
  synchronize: true,
}
