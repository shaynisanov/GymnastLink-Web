interface User {
  userName: string;
  profileImage?: string;
}

interface LoggedUser extends User {
  accessToken: string;
  refreshToken: string;
}

export type {User, LoggedUser};
