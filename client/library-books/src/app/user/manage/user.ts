export class User {
    username: string;
    password: string;
    emailAddress: string;
    mobileNumber: string;
    roles: string[];
}

interface Role {
  name : string;
}
