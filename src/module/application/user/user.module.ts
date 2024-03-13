import {  Module } from "@nestjs/common";
import { UserSchema, User } from "./schema/user.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
})

export class UserModule {}
