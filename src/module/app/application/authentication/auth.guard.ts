import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const authorization = request.headers['authorization']
		if (!authorization) {
			throw new UnauthorizedException("You are not signed in")
		}
		const [type, token] = authorization.split(" ")
		if (!authorization || type != "Bearer") {
			throw new UnauthorizedException("Invalid Token")
		}

		try {
			const jwtPayload = await this.jwtService.verify(token, { secret: this.configService.get<string>("JWT_SECRET") })
			request.user = jwtPayload
		} catch {
			throw new UnauthorizedException()
		}

		return true
	}
}
