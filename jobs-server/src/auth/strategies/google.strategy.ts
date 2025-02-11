import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserProfile } from 'src/interface/userProfile.interface';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
        clientID: configService.get<string>('CLIENT_ID'),
        clientSecret: configService.get<string>('CLIENT_SECRET'),
        callbackURL: 'http://localhost:8000/api/auth/google/redirect',
        scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user : UserProfile = {
      id : id,
      given_name: `${name.givenName}`,
      family_name: `${name.familyName}`,
      picture: photos[0].value,
      email: emails[0].value,
    };

    done(null, user);
  }
}