import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Token, User } from '@prisma/client'
import { Request } from 'express'
import { TokenType } from 'generated/prisma'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'

import { AuthService } from '../auth.service'

import { ConfirmationDto } from './dto/confirmation.dto'

@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	public async newVerification(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.prismaService.token.findUnique({
			where: { token: dto.token, type: TokenType.VERIFICATION }
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Verification token not found. Please ensure you have the correct token.'
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				'The verification token has expired. Please request a new token.'
			)
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)

		if (!existingUser) {
			throw new NotFoundException(
				'User with the specified email address was not found. Please make sure you entered the correct email.'
			)
		}

		await this.prismaService.user.update({
			where: { id: existingUser.id },
			data: { isVerified: true }
		})

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.VERIFICATION }
		})

		return this.authService.saveSession(req, existingUser)
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return true
	}

	private async generateVerificationToken(email: string): Promise<Token> {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.VERIFICATION }
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: { id: existingToken.id, type: TokenType.VERIFICATION }
			})
		}

		const verificationToken = await this.prismaService.token.create({
			data: { email, token, expiresIn, type: TokenType.VERIFICATION }
		})

		return verificationToken
	}
}
