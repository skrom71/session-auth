import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { createClient } from 'redis'

import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	const redisClient = createClient({ url: config.getOrThrow('REDIS_URI') })
	await redisClient.connect()

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge:
					parseInt(config.getOrThrow<string>('SESSION_MAX_AGE')) *
					24 *
					60 *
					60 *
					1000,
				httpOnly:
					config.getOrThrow<string>('SESSION_HTTP_ONLY') === 'true',
				secure: config.getOrThrow<string>('SESSION_SECURE') === 'true',
				sameSite: 'lax'
			},
			store: new RedisStore({ client: redisClient })
		})
	)

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap()
