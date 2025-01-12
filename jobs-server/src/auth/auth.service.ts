import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { tmpdir } from 'os';
import { UserProfile } from 'src/interface/userProfile.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  generateJwt(payload) {
    const signed = this.jwtService.sign(payload);
    return signed;
  }

  async signIn(user: UserProfile) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }
    console.log('User: ', user);

    const userExists = await this.userService.findUserByEmail(user.email);

    let newUser = null;

    const tmpUser: any = {
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      picture: user.picture,
    };

    if (!userExists) {
      user.id = null;
      newUser = await this.userService.createUser(tmpUser);
    }

    tmpUser.id = userExists ? userExists.id : newUser.id;

    return this.generateJwt(tmpUser);
  }
}
