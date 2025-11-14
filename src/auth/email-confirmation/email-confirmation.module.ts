import { forwardRef, Module } from '@nestjs/common'
import { MailModule } from 'src/mail/mail.module'
import { UserModule } from 'src/user/user.module'

import { AuthModule } from '../auth.module'

import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
	imports: [MailModule, UserModule, forwardRef(() => AuthModule)],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
