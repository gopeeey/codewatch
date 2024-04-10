interface HttpErrorInterface {
    message: string;
    statusCode?: number;
    data?: { [key: string]: unknown };
}

export class HttpError extends Error implements HttpErrorInterface {
    statusCode: HttpErrorInterface["statusCode"];
    data: HttpErrorInterface["data"];

    constructor(body: HttpErrorInterface) {
        super(body.message);
        this.statusCode = body.statusCode;
        this.name = "HttpError";
        this.data = body.data;
    }
}
