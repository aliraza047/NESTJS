export type JwtPayload = {
  userId: string;
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
