import { User } from '../user/user';

export class AuthenticatedUser extends User {
	token: string = "";
    isAuthenticated: boolean = false;
    admin: boolean = false;
}