export interface DefaultResponse {
    success: boolean;
    message?: string;
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
