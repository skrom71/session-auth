import { Module } from '@nestjs/common'
import { MailModule } from 'src/mail/mail.module'
import { UserModule } from 'src/user/user.module'

import { TwoFactorAuthService } from './two-factor-auth.service'

@Module({
	imports: [MailModule],
	providers: [TwoFactorAuthService],
	exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
