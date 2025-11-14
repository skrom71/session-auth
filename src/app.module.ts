import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { IS_DEV_ENV } from './libs/utils/is-dev.util'
import { MailModule } from './mail/mail.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		AuthModule,
		UserModule,
		PrismaModule,
		MailModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
