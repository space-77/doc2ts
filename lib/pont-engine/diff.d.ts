import { Mod, BaseClass } from './standard';
export interface Model extends Mod {
    name: string;
    details?: string[];
}
export interface Model extends BaseClass {
    name: string;
    details?: string[];
}
export declare function removeCtx(data: any): any;
export declare function diff(preModels: Model[], nextModels: Model[], isMod?: boolean): Model[];
