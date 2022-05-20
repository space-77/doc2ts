declare class Log {
    info(text: string): void;
    error(text: string): void;
    warning(text: string): string;
    log(text: string): void;
    done(text: string): string;
    success(text: string): void;
    link(text: string): string;
    ok(): void;
    clear(): void;
}
declare const _default: Log;
export default _default;
