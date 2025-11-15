import { Module } from '@nestjs/common'
import { MailModule } from 'src/mail/mail.module'
import { UserModule } from 'src/user/user.module'

import { MailService } from '../../mail/mail.service'
import { UserService } from '../../user/user.service'

import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	imports: [MailModule, UserModule],
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService]
})
export class PasswordRecoveryModule {}
