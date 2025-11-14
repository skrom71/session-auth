import {
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/client'

import { ROLES_KEY } from '../decorators/roles.decorator'

export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		const request = context.switchToHttp().getRequest()

		if (!roles) return true

		if (!roles.includes(request.user.role)) {
			throw new ForbiddenException(
				'Insufficient permissions. You do not have access rights to this resource.'
			)
		}

		return true
	}
}
