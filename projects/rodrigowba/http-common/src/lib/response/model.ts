export interface DefaultResponse {
  success: boolean;
  message?: string;
}

export interface ErrorResponse extends DefaultResponse {
  statusCode: number;
}

export interface ErrorResponseData<T> extends ErrorResponse {
  data: T;
}

export interface ResponseData<T> extends DefaultResponse {
  data: T;
}

export interface ResponseDataList<T> extends DefaultResponse {
  data: T[];
}

export interface FormValidationResponse {
  message: string;
  errors: {
    [k: string]: string[];
  };
}
