export interface CustomRequest extends Request {
  userId: string;
  role: string;
}

export interface CustomHeaders extends Headers {
  authorization: string;
}
