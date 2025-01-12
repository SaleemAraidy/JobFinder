import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserProfile } from 'src/interface/userProfile.interface';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { RolePermissionService } from 'src/role_permission/role_permission.service';
import { UserRoleService } from 'src/user_role/user_role.service';
import { PermissionsEnum } from 'src/consts/permissions';

export type JwtPayload = {
  id: string;
  email: string;
  permission: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly userService;
  private readonly rolePermissionService;
  private readonly userRoleService;

  constructor(
    configService: ConfigService,
    userService: UserService,
    rolePermissionService: RolePermissionService,
    userRoleService: UserRoleService,
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('MY_SECRET'),
      jwtFromRequest: extractJwtFromCookie,
    });

    this.userService = userService;
    this.rolePermissionService = rolePermissionService;
    this.userRoleService = userRoleService;
  }

  async validate(payload: JwtPayload) {
    const userRoles = await this.userRoleService.findByUserId(payload.id);
    if (!userRoles || userRoles.length === 0) {
      throw new UnauthorizedException('User does not have any roles assigned.');
    }

    const permissions: string[] = [];

    for (const userRole of userRoles) {
      const rolePermissions =
        await this.rolePermissionService.findAllowedByRoleId(userRole.roleId);
      for (const rolePermission of rolePermissions) {
        permissions.push(rolePermission.permissionId);
      }
    }

    return {
      id: payload.id,
      email: payload.email,
      permissions: permissions,
    };
  }
}
