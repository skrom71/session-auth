import { ConfigService } from '@nestjs/config'

import { TypeOptions } from '../auth/provider/provider.constants'
import { FigmaProvider } from '../auth/provider/services/figma.provider'
import { GoogleProvider } from '../auth/provider/services/google.provider'

export const getProvidersConfig = async (
	configService: ConfigService
): Promise<TypeOptions> => ({
	baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
	services: [
		new GoogleProvider({
			client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>(
				'GOOGLE_CLIENT_SECRET'
			),
			scopes: ['email', 'profile']
		}),
		new FigmaProvider({
			client_id: configService.getOrThrow<string>('FIGMA_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>(
				'FIGMA_CLIENT_SECRET'
			),
			scopes: ['current_user:read']
		})
	]
})
