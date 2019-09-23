import {
  isDev,
  noop,
  $,
  setattrs,
  _ComponentAsString,
  selfClosingTags,
  getClassAsArray
} from "./utils.js";
let renderCount = 0;
class BaseComponent {
  constructor() {
    this.eventListeners = {};
    this.hasUnAttachedEventListeners = false;
  }
  static createElement(
    component,
    parent,
    componentInstance,
    attachToDOM = true
  ) {
    if (!parent) {
      throw new Error("no parent element");
    }
    if (componentInstance.isConnected) {
      throw new Error(
        "Cannot render a connected element. did you mean to call update()?"
      );
    }
    if (isDev) {
      console.log(`Render Called ${++renderCount} times`);
    }
    const { element, children, props } = component;
    const el = $.create(element, props);
    for (const child of children) {
      try {
        if (child.shouldRender()) {
          child.render(el, true);
        }
      } catch (e) {
        console.log(e, child, children);
      }
    }
    componentInstance.isConnected = true;
    componentInstance.isMountedTo = parent;
    componentInstance.$element = el;
    componentInstance.wasEverMounted = true;
    if (attachToDOM) {
      parent.appendChild(el);
    }
    componentInstance.onAttached(true);
    if (componentInstance.hasUnAttachedEventListeners) {
      for (const [evt, listener] of Object.entries(
        componentInstance.eventListeners
      )) {
        isDev ? console.log("Attaching listener:", evt) : void 0;
        el.addEventListener(evt, listener);
      }
    }
    return el;
  }
  attachEventListener(event, listener, override, once = false) {
    const previousListener = this.eventListeners[event];
    if (previousListener && this.isConnected) {
      if (!override) {
        throw new Error(
          "Cannot append multiple listeners.. please combine them in a single function"
        );
      } else {
        this.$element.removeEventListener(event, previousListener);
      }
    }
    this.eventListeners[event] = listener;
    if (!this.isConnected) {
      this.hasUnAttachedEventListeners = true;
      return this;
    }
    this.$element.addEventListener(event, listener, { once });
    return this;
  }
  detachEventListener(event, listener) {
    this.$element.removeEventListener(event, listener);
    delete this.eventListeners[event];
    return this;
  }
}
BaseComponent.componentToString = _ComponentAsString;
export default class Component extends BaseComponent {
  constructor(name, props = {}, children = [], domAttrs = {}, events = {}) {
    super();
    this.DOMAttrs = {};
    this.bindings = {};
    this.wasEverMounted = false;
    this.updateDOMAttrs = () =>
      this.isConnected ? setattrs(this.$element, this.DOMAttrs) : void 0;
    this.children = [];
    this.cleanUp = noop;
    this.onAttached = wasRendered => void 0;
    this.beforeRender = noop;
    this._props = props;
    this.element = name;
    this.children = children;
    if (selfClosingTags.includes(this.element) && this.children.length) {
      throw new Error(
        `Cannot add child elements to self closing element:${this.element}`
      );
    }
    for (const [k, v] of Object.entries(events)) {
      this.attachEventListener(k, v);
    }
    this.setDomAttrs(domAttrs, false);
  }
  updateChildren(parent) {
    this.children.forEach(child => {
      if (!child.shouldRender()) {
        return;
      }
      if (!child.isConnected) {
        return void child.render(parent);
      } else {
        child.update();
      }
    });
  }
  disconnectChildren() {
    this.children = [];
  }
  get preservedProps() {
    return {
      domAttrs: [],
      props: []
    };
  }
  removeChild(child) {
    const childIndex = this.children.indexOf(child);
    if (childIndex > -1) {
      this.children.splice(childIndex, 1);
      child.destroyComponent(false, true);
    }
  }
  destroyChildComponents(preserveState, disconnect) {
    this.children.forEach(child => {
      child.destroyComponent(preserveState, disconnect);
    });
    if (disconnect) {
      this.disconnectChildren();
    }
  }
  toggleClassName(cls) {
    if (this.isConnected) {
      if (this.$element.classList.contains(cls)) {
        this.$element.classList.remove(cls);
      } else {
        this.$element.classList.add(cls);
      }
      this.DOMAttrs.className = [...this.$element.classList];
    }
  }
  addClassName(cls) {
    this.DOMAttrs.className = getClassAsArray(this.DOMAttrs.className) || [];
    if (!this.DOMAttrs.className.includes(cls)) {
      this.DOMAttrs.className.push(cls);
    }
    if (this.isConnected) {
      !this.$element.classList.contains(cls)
        ? this.$element.classList.add(cls)
        : void 0;
    }
    return this;
  }
  removeClassName(cls) {
    this.DOMAttrs.className = getClassAsArray(this.DOMAttrs.className || []);
    this.DOMAttrs.className = this.DOMAttrs.className.filter(x => x !== cls);
    if (this.isConnected) {
      this.$element.classList.remove(cls);
    }
    return this;
  }
  addChild(c, update) {
    this.children.push(c);
    if (update) {
      this.update();
    }
    return this;
  }
  setDomAttrs(props, shouldUpdate = true) {
    Object.assign(this.DOMAttrs, props);
    shouldUpdate ? this.update() : void 0;
    return this;
  }
  set attachedCallback(cb) {
    this.onAttached = cb;
  }
  set beforeRenderCallback(cb) {
    this.beforeRender = cb;
  }
  set onDestroy(fn) {
    this.cleanUp = fn;
  }
  shouldRender() {
    return true;
  }
  update() {
    this.updateChildren(this.$element);
    this.updateDOMAttrs();
    return void 0;
  }
  toHTMLString() {
    return Component.componentToString({
      element: this.element,
      props: this.DOMAttrs,
      children: this.children
    });
  }
  /**
   * Use after calling destroyChildComponents
   */
  renderChildrenOnly() {
    this.children.forEach(child => child.render(this.$element));
  }
  /**
     *
     To be run for the first time. Next updates should be done through setState()
     or forced through update()
     */
  render(parent, attachToDOM = true) {
    this.beforeRender();
    return Component.createElement(
      {
        element: this.element,
        props: this.DOMAttrs,
        children: this.children
      },
      parent,
      this,
      attachToDOM
    );
  }
  destroyComponent(preserveState = false, disconnectChildren) {
    this.destroyChildComponents(preserveState, disconnectChildren);
    if (this.isConnected) {
      try {
        this.$element.remove();
      } catch (e) {
        console.warn(e);
      }
    }
    this.isConnected = this.isMountedTo = this.$element = null;
    if (!preserveState) {
      const _preservedProps = this.preservedProps;
      this._props = (() => {
        const ret = {};
        for (const prop of _preservedProps.props) {
          ret[prop] = this._props[prop];
        }
        return ret;
      })();
      this.eventListeners = {};
      this.DOMAttrs = (() => {
        const ret = {};
        for (const prop of _preservedProps.domAttrs) {
          ret[prop] = this.DOMAttrs[prop];
        }
        return ret;
      })();
      this.bindings = {};
    }
    return this.cleanUp();
  }
  get getState() {
    return this._props;
  }
  bindData(propName, component, componentPropName, update = true) {
    const prop = this.getState[propName];
    const bindings = this.bindings[propName] || [];
    const componentBindings = component.bindings[componentPropName] || [];
    bindings.push({
      component,
      prop: componentPropName
    });
    this.bindings[propName] = bindings;
    componentBindings.push({ component: this, prop: propName });
    component.bindings[componentPropName] = componentBindings;
    if (update) {
      const state = {};
      state[componentPropName] = prop;
      component.setState(state, true, true);
    }
    return this;
  }
  updateBindings() {
    for (const [prop, otherComponentArray] of Object.entries(this.bindings)) {
      for (const otherComponent of otherComponentArray) {
        const {
          component: boundComponent,
          prop: componentProp
        } = otherComponent;
        const state = {};
        state[componentProp] = this.getState[prop];
        boundComponent.setState(state, true, true);
      }
    }
    return this;
  }
  clearState(shouldUpdate) {
    this._props = {};
    shouldUpdate ? this.update() : void 0;
    return this;
  }
  setState(prop, shouldUpdate = true, wasInvokedThroughBinding) {
    Object.assign(this._props, prop);
    if (!wasInvokedThroughBinding) {
      this.updateBindings();
    }
    if (shouldUpdate) {
      this.update();
    }
    return this;
  }
}
export class TextComponent extends Text {
  constructor(text, tag) {
    super(text);
    this._condition = () => this.data;
    this.tag = tag;
  }
  toHTMLString() {
    return this.data;
  }
  static find(tag, on) {
    const nodes = [...on.childNodes];
    return nodes.filter(
      node => node instanceof TextComponent && node.tag === tag
    );
  }
  set textCondition(conditionFn) {
    this._condition = conditionFn;
  }
  update() {
    const _ = this._condition();
    if (this.data !== _) {
      return void (this.data = _);
    }
  }
  render(on, append) {
    if (append && !this.isConnected) {
      this.isMountedTo = on;
      this.update();
      return on.appendChild(this);
    }
  }
  shouldRender() {
    return true;
  }
  destroyComponent() {
    this.remove();
  }
}
