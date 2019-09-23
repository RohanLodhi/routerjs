export declare const asyncNoop: () => Promise<any>;
export declare const isDev: boolean;
export declare const isKeyValObj: (a: any) => boolean;
export declare const isSameDay: (c: Date, d: Date) => boolean;
export declare const getClassAsArray: (cls: string | string[]) => string[];
export declare const noop: () => any;
export declare const makeCSS: (a: string | {}) => string;
export declare const $: {
  q(query: string, single?: boolean): Element | HTMLElement | HTMLElement[];
  id(elementId: string): HTMLElement;
  className(elementClass: string, single?: boolean): Element | Element[];
  create(elementName: string, attributes?: {}): HTMLElement;
  get(element: Element | HTMLElement, key: string): string;
  set(element: Element | HTMLElement, key: string, value: string): void;
  empty(element: Element | HTMLElement): void;
};
export declare const stampFormat: (timeStamp: number) => string;
export declare function setattrs(element: HTMLElement, attrs: any): void;
export declare const getObjectFromCss: (css: string | object) => any;
export interface ComponentInterface {
  element: string;
  props?: {};
  children?: Array<
    import("./component").default | import("./component").TextComponent
  >;
  events?: any;
}
export interface RouteInterface {
  route: string;
  path?: string;
  qs?: {};
}
export declare const selfClosingTags: string[];
export declare const _ComponentAsString: (
  componentProps: ComponentInterface
) => string;
export declare function safeDefine(name: string, cls: Function): void;
export declare const getLargerArray: (a1: any[], a2: any[]) => any[][];
