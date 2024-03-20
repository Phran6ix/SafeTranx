import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from "src/module/application/product/product.schema";
import { User } from "src/module/application/user/schema/user.schema";

export const typeormConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: 'postgres',
  port: 5432,
  username: 'safe_tranx',
  password: 'password',
  database: 'safe_tranx',
  entities: [User, Product],
  synchronize: true,
}
