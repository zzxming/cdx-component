import { LOADING_INSTANCE } from './constants';
import { LoadingProps } from './loading';
import { createLoadingInstance } from './service';

export interface ElementLoading extends HTMLElement {
    [LOADING_INSTANCE]?: LoadingInstance;
}
export interface LoadingOptions extends Partial<LoadingProps> {
    target: HTMLElement | string;
}

export type LoadingInstance = ReturnType<typeof createLoadingInstance>;

export type ServiceOptions = Partial<Omit<LoadingOptions, 'visible'>>;
