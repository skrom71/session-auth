import { BaseOAuthService } from './base-oauth.services'
import { TypeProviderOptions } from './types/provider-options.types'
import { TypeUserInfo } from './types/user-info.types'

export class FigmaProvider extends BaseOAuthService {
	public constructor(options: TypeProviderOptions) {
		super({
			name: 'figma',
			authorize_url: 'https://www.figma.com/oauth',
			access_url: 'https://api.figma.com/v1/oauth/token',
			profile_url: 'https://api.figma.com/v1/me', // Figma profile endpoint
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	public async extractUserInfo(data: FigmaProfile): Promise<TypeUserInfo> {
		return super.extractUserInfo({
			email: data.email,
			name: data.handle || data.name,
			picture: data.img_url
		})
	}
}

interface FigmaProfile extends Record<string, any> {
	id: string
	email: string
	handle?: string
	name?: string
	img_url?: string
	access_token: string
	refresh_token?: string
}
