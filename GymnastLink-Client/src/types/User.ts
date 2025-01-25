interface User {
  _id: string;
  userName: string;
  profileImage?: string;
}

interface LoggedUser extends User {
  accessToken: string;
  refreshToken: string;
}

export type {User, LoggedUser};
