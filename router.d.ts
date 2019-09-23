import Component from "./component";
export default class Router {
  private routeList;
  private routeData;
  private navData;
  private parseHash;
  private currentComponent;
  private readonly statusHandler;
  private routeChange;
  root: HTMLElement;
  startLoad: () => void;
  load: (hash: string) => void;
  mountComponent(
    component: Component,
    mountOn: HTMLElement,
    preserveState?: boolean
  ): void;
  getRouteProps(
    route: string
  ): {
    res: boolean;
    args?: any;
    actualRoute?: string;
  };
  isUserGoingBack(nextRoute: string): boolean;
  registerComponent(
    route: string,
    component: Component | Promise<Component>,
    strictMatching?: boolean
  ): void;
  readonly currentRoute: string;
  readonly currentPath: string[];
  readonly currentQs: URLSearchParams;
  private _runConditionals;
  private _runListeners;
  private _runDirectives;
  constructor(root?: HTMLElement);
}
