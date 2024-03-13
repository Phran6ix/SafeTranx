import { Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IUser } from "../interface/user.interface";

@Schema({timestamps: true, versionKey: false, _id: false})
export class User  implements IUser{
	@Prop({required: true, unique: true, index: true})
    userId: string;

	@Prop({required: true})
    firstname: string;

	@Prop({required: true})
    lastname: string;

	@Prop({required: true, unique: true, index: true})
    email: string;

	@Prop({required: true})
    password: string;

	@Prop({type: Boolean, default:false})
	is_verified: boolean
	
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)

