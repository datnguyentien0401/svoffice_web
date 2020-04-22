import {AppSettings} from '../../app.settings';

export class AuthoritiesUtils {
  static hasAuthority(authority: string): boolean {
    if (!authority) {
      return false;
    }
    return AppSettings.AUTHORITIES.includes(authority.toLowerCase());
  }
}
