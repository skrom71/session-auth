import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { getProvidersConfig } from 'src/config/providers.config'
import { getRecaptchaConfig } from 'src/config/recaptcha.config'
import { UserModule } from 'src/user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { ProviderModule } from './provider/provider.module'
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';

@Module({
	imports: [
		UserModule,
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService]
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		}),
		forwardRef(() => EmailConfirmationModule),
		PasswordRecoveryModule,
		TwoFactorAuthModule
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService]
})
export class AuthModule {}
