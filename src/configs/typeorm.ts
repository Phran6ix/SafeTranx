import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from "src/module/app/application/product/schema/product.schema";
import { User } from "src/module/app/application/user/schema/user.schema";

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
