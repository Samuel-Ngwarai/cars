export interface IConfigObject {
    PORT: number;
    LOG_LEVEL: 'debug' | 'info' | 'error' | 'warn' | 'crit';
    MONGODB_URL?: string;
}
