import { ComponentInterface } from "./utils";
declare class BaseComponent {
  constructor();
  protected static createElement(
    component: ComponentInterface,
    parent: HTMLElement,
    componentInstance: Component,
    attachToDOM?: boolean
  ): HTMLElement;
  protected $element: HTMLElement;
  protected eventListeners: any;
  protected static componentToString: (
    componentProps: ComponentInterface
  ) => string;
  protected hasUnAttachedEventListeners: boolean;
  attachEventListener(
    event: string,
    listener: Function,
    override?: boolean,
    once?: boolean
  ): this;
  detachEventListener(event: "string", listener: Function): this;
}
export default class Component extends BaseComponent {
  private _props;
  private element;
  private DOMAttrs;
  bindings: any;
  wasEverMounted: boolean;
  updateDOMAttrs: () => void;
  children: Array<Component | TextComponent>;
  private cleanUp;
  updateChildren(parent?: HTMLElement): void;
  disconnectChildren(): void;
  readonly preservedProps: {
    domAttrs: any[];
    props: any[];
  };
  removeChild(child: Component): void;
  destroyChildComponents(preserveState?: boolean, disconnect?: boolean): void;
  toggleClassName(cls: "string"): void;
  addClassName(cls: string): this;
  removeClassName(cls: string): this;
  addChild(c: Component, update?: boolean): this;
  isMountedTo: HTMLElement;
  onAttached: (wasRendered?: boolean) => any;
  private beforeRender;
  isConnected: boolean;
  setDomAttrs(props: {}, shouldUpdate?: boolean): this;
  attachedCallback: () => any;
  beforeRenderCallback: () => any;
  onDestroy: () => any;
  shouldRender(): boolean;
  update(): void;
  toHTMLString(): string;
  /**
   * Use after calling destroyChildComponents
   */
  renderChildrenOnly(): void;
  /**
     *
     To be run for the first time. Next updates should be done through setState()
     or forced through update()
     */
  render(parent: HTMLElement, attachToDOM?: boolean): HTMLElement;
  destroyComponent(preserveState?: boolean, disconnectChildren?: boolean): any;
  readonly getState: any;
  bindData(
    propName: string | number,
    component: this,
    componentPropName: string | number,
    update?: boolean
  ): this;
  private updateBindings;
  clearState(shouldUpdate?: boolean): this;
  setState(
    prop: any,
    shouldUpdate?: boolean,
    wasInvokedThroughBinding?: boolean
  ): this;
  constructor(
    name: string,
    props?: any,
    children?: any[],
    domAttrs?: {},
    events?: {}
  );
}
export declare class TextComponent extends Text {
  tag: string;
  isMountedTo: HTMLElement;
  toHTMLString(): string;
  static find(tag: string, on: Element | HTMLElement): Array<any>;
  private _condition;
  textCondition: () => string;
  update(): void;
  render(on: HTMLElement, append?: boolean): this;
  shouldRender(): boolean;
  destroyComponent(): void;
  constructor(text: string, tag?: string);
}
export {};
