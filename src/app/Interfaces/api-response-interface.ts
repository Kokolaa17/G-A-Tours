export interface ApiResponseInterface<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string[] | null;
}
