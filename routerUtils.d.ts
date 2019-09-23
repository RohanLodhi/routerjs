export declare const urlencode: (a: any) => string | URLSearchParams;
export declare const __random__: (a?: number) => string;
export declare const getRandom: (a?: number) => string;
export declare const loadHash: (hash: string) => void;
export declare const isSameDay: (date1: Date, date2: Date) => boolean;
export declare const stampFormat: (timeStamp: number) => string;
export declare const parseHash: (
  route?: string
) => {
  route: string;
  path: string[];
  qs: URLSearchParams;
};
export declare const setQS: (k: string, v: string) => void;
