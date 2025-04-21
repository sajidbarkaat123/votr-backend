export class ResponseDto<T> {
  status?: boolean = true;
  statusCode: number;
  message: string;
  data: T;
  error?: string;
  fields?: string[];
  stack?: string;
}
