import { IBaseResponse } from "../../schemas";
import { User } from "../../schemas/login.schema";

export interface ILoginResponse extends IBaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User
  }
}

export interface IRegisterResponse extends IBaseResponse {
  data: null;
}