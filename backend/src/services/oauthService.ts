import axios from 'axios';
import { PrismaClient } from '@prisma/client';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

export interface OAuthUserProfile {
  provider: 'google' | 'facebook' | 'github';
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  displayName?: string;
}

class OAuthService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Google OAuth
  async getGoogleAuthUrl(state: string): Promise<string> {
    const config = this.getGoogleConfig();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async getGoogleAccessToken(code: string): Promise<OAuthTokenResponse> {
    const config = this.getGoogleConfig();
    
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
    });

    return response.data;
  }

  async getGoogleUserProfile(accessToken: string): Promise<OAuthUserProfile> {
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { id, email, given_name, family_name, picture, name } = response.data;

    return {
      provider: 'google',
      providerId: id,
      email,
      firstName: given_name || '',
      lastName: family_name || '',
      avatar: picture,
      displayName: name,
    };
  }

  // Facebook OAuth
  async getFacebookAuthUrl(state: string): Promise<string> {
    const config = this.getFacebookConfig();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'email public_profile',
      state,
    });

    return `https://www.facebook.com/v12.0/dialog/oauth?${params.toString()}`;
  }

  async getFacebookAccessToken(code: string): Promise<OAuthTokenResponse> {
    const config = this.getFacebookConfig();
    
    const response = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
      params: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
      },
    });

    return response.data;
  }

  async getFacebookUserProfile(accessToken: string): Promise<OAuthUserProfile> {
    const response = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,email,first_name,last_name,picture',
        access_token: accessToken,
      },
    });

    const { id, email, first_name, last_name, picture } = response.data;

    return {
      provider: 'facebook',
      providerId: id,
      email,
      firstName: first_name || '',
      lastName: last_name || '',
      avatar: picture?.data?.url,
    };
  }

  // GitHub OAuth
  async getGitHubAuthUrl(state: string): Promise<string> {
    const config = this.getGitHubConfig();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'read:user user:email',
      state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async getGitHubAccessToken(code: string): Promise<OAuthTokenResponse> {
    const config = this.getGitHubConfig();
    
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
    }, {
      headers: {
        Accept: 'application/json',
      },
    });

    return response.data;
  }

  async getGitHubUserProfile(accessToken: string): Promise<OAuthUserProfile> {
    // Get user profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const { id, login, name, avatar_url } = userResponse.data;

    // Get user email
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const primaryEmail = emailResponse.data.find((email: any) => email.primary)?.email || '';

    // Parse name into first and last name
    const nameParts = name ? name.split(' ') : ['', ''];
    const firstName = nameParts[0] || login;
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      provider: 'github',
      providerId: id.toString(),
      email: primaryEmail,
      firstName,
      lastName,
      avatar: avatar_url,
      displayName: name || login,
    };
  }

  // Generic OAuth flow
  async authenticateWithProvider(provider: 'google' | 'facebook' | 'github', code: string): Promise<OAuthUserProfile> {
    let accessToken: string;
    let userProfile: OAuthUserProfile;

    switch (provider) {
      case 'google':
        const googleToken = await this.getGoogleAccessToken(code);
        accessToken = googleToken.access_token;
        userProfile = await this.getGoogleUserProfile(accessToken);
        break;

      case 'facebook':
        const facebookToken = await this.getFacebookAccessToken(code);
        accessToken = facebookToken.access_token;
        userProfile = await this.getFacebookUserProfile(accessToken);
        break;

      case 'github':
        const githubToken = await this.getGitHubAccessToken(code);
        accessToken = githubToken.access_token;
        userProfile = await this.getGitHubUserProfile(accessToken);
        break;

      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    return userProfile;
  }

  // Get OAuth configuration
  private getGoogleConfig(): OAuthConfig {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: `${process.env.API_BASE_URL}/api/v1/auth/oauth/google/callback`,
    };
  }

  private getFacebookConfig(): OAuthConfig {
    return {
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      redirectUri: `${process.env.API_BASE_URL}/api/v1/auth/oauth/facebook/callback`,
    };
  }

  private getGitHubConfig(): OAuthConfig {
    return {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      redirectUri: `${process.env.API_BASE_URL}/api/v1/auth/oauth/github/callback`,
    };
  }

  // Validate OAuth configuration
  validateOAuthConfig(provider: 'google' | 'facebook' | 'github'): boolean {
    let config: OAuthConfig;

    switch (provider) {
      case 'google':
        config = this.getGoogleConfig();
        break;
      case 'facebook':
        config = this.getFacebookConfig();
        break;
      case 'github':
        config = this.getGitHubConfig();
        break;
      default:
        return false;
    }

    return !!(config.clientId && config.clientSecret && config.redirectUri);
  }

  // Get OAuth provider status
  getOAuthProviderStatus(): Array<{
    provider: 'google' | 'facebook' | 'github';
    enabled: boolean;
    configured: boolean;
  }> {
    const providers: Array<'google' | 'facebook' | 'github'> = ['google', 'facebook', 'github'];

    return providers.map(provider => ({
      provider,
      enabled: this.isOAuthProviderEnabled(provider),
      configured: this.validateOAuthConfig(provider),
    }));
  }

  private isOAuthProviderEnabled(provider: 'google' | 'facebook' | 'github'): boolean {
    const enabledProviders = process.env.ENABLED_OAUTH_PROVIDERS?.split(',') || ['google'];
    return enabledProviders.includes(provider);
  }

  // Generate OAuth state parameter
  generateOAuthState(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}_${random}`;
  }

  // Validate OAuth state parameter
  validateOAuthState(state: string): boolean {
    if (!state || typeof state !== 'string') {
      return false;
    }

    const parts = state.split('_');
    if (parts.length !== 2) {
      return false;
    }

    const timestamp = parseInt(parts[0]);
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    return !isNaN(timestamp) && (now - timestamp) < maxAge;
  }

  // Store OAuth account link
  async linkOAuthAccount(userId: string, provider: string, providerId: string): Promise<void> {
    // This would store the OAuth account link in the database
    // For now, we'll log it
    console.log(`Linking ${provider} account ${providerId} to user ${userId}`);
  }

  // Find user by OAuth provider
  async findUserByOAuthProvider(provider: string, providerId: string): Promise<any> {
    // This would query the OAuth accounts table
    // For now, return null as we haven't implemented the OAuth accounts model
    return null;
  }
}

export default OAuthService; 