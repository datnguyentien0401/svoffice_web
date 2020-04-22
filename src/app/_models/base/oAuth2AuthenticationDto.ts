import {RoleModel} from './role.model';

export class OAuth2AuthenticationDto {
  userAuthentication: UserAuthentication;
  authorities: Authority[];
  name: string;
}

export class UserAuthentication {
  principal: Principal;
}

export class Authority {
  authority: string;
}

export class Principal {
  username: string;
  firstName: string;
  lastName: string;
  roles: RoleModel[];
}

