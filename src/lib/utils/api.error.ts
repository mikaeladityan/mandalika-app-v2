export class ApiError extends Error {
    status: number;
    details: Array<{ path?: string; message: string }>;
    name: string;

    constructor(
        message: string,
        status: number,
        details: Array<{ path?: string; message: string }> = [],
        name?: string
    ) {
        super(message);
        this.name = name || "Error";
        this.status = status;
        this.details = details;
    }
}
