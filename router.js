import Component, { TextComponent } from "./component";
import { $, isDev, safeDefine } from "./utils";
import { parseHash as _parseHash, loadHash } from "./routerUtils";
const _checkHashChangeHandler = () => {
  if (typeof window.onhashchange === "function") {
    isDev
      ? console.error("Current Hashchange handler:", window.onhashchange)
      : void 0;
    throw new Error(
      "window already has a hashchange event listener. Have you re-initialized the router?"
    );
  }
  return true;
};
const _aLink = new Component("a", {}, [new TextComponent("Click to go Back")], {
  style:
    "color:#000;display:flex;margin:auto;text-align:center;flex-direction:column;text-decoration:underline",
  href: "/"
});
_aLink.attachEventListener("click", function(e) {
  e.preventDefault();
  loadHash("/");
});
const _style = {
  style: "color:#000000;cursor:pointer;font-weight:bold"
};
const handlers = {
  404: new Component(
    "div",
    {},
    [new TextComponent("No page exists with the given URL"), _aLink],
    _style
  ),
  500: new Component(
    "div",
    {},
    [
      new TextComponent(
        "An Error Occured while processing your Request..please try again"
      ),
      _aLink
    ],
    _style
  )
};
export default class Router {
  constructor(root = $.id("app-root") || window.appRoot || document.body) {
    //private.
    //fields
    this.routeList = [];
    this.routeData = {};
    this.parseHash = _parseHash;
    this.startLoad = this.routeChange;
    this.load = loadHash;
    this.root = root;
    _checkHashChangeHandler();
    window.onhashchange = e => {
      this.navData = e;
      this._runDirectives();
      return this.routeChange();
    };
    this._runDirectives();
  }
  get statusHandler() {
    return handlers;
  }
  //functions
  routeChange() {
    const { res, actualRoute: actualRoute, args } = this.getRouteProps(
      location.href
    );
    if (!res) {
      this.mountComponent(this.statusHandler["404"], this.root);
    } else {
      const { component, strictMatching } = this.routeData[actualRoute];
      if (strictMatching) {
        if (!this.routeData[this.currentRoute + this.currentPath.join("/")]) {
          return this.mountComponent(this.statusHandler["404"], this.root);
        }
      }
      this.mountComponent(component, this.root);
    }
  }
  //functions
  mountComponent(component, mountOn, preserveState = true) {
    if (this.currentComponent) {
      if (this.currentComponent === component) {
        isDev ? console.log("Same Component..not mounting") : void 0;
        // same component..like 404 page
        component.onAttached(false);
        return;
      }
      this.currentComponent.destroyComponent(preserveState);
    }
    component.render(mountOn);
    this.currentComponent = component;
  }
  getRouteProps(route) {
    if (this.routeList.includes(route)) {
      return {
        res: !0,
        args: null,
        actualRoute: route
      };
    }
    try {
      const _sanitizedRoute = this.parseHash(route);
      const sanitizedRoute = _sanitizedRoute.route;
      if (this.routeList.includes(sanitizedRoute)) {
        return {
          res: !0,
          args: _sanitizedRoute.path,
          actualRoute: sanitizedRoute
        };
      } else {
        return {
          res: !1
        };
      }
    } catch (f) {
      console.log(f);
      return {
        res: !1
      };
    }
  }
  isUserGoingBack(nextRoute) {
    const navDat = this.navData || {},
      fullURL = `${location.protocol}//${location.host}/#${nextRoute}`;
    return fullURL === navDat.oldURL;
  }
  registerComponent(route, component, strictMatching) {
    if (!(component instanceof Component)) {
      if ("function" === typeof component.then) {
        component.then(mod => {
          this.routeData[route] = {
            component: mod.default,
            strictMatching
          };
          this.routeList.push(route);
        });
      } else {
        throw new Error(
          "Can not register component please make sure your componentClass extends Component"
        );
      }
    }
    this.routeData[route] = { component, strictMatching };
    this.routeList.push(route);
  }
  //getters
  get currentRoute() {
    return this.parseHash(location.href).route;
  }
  get currentPath() {
    return this.parseHash(location.href).path;
  }
  get currentQs() {
    return this.parseHash(location.href).qs;
  }
  async _runConditionals() {
    const elementArray = [...document.querySelectorAll("[_routerif]")];
    for (const element of elementArray) {
      const _condition = $.get(element, "_routerif");
      const _then = $.get(element, "_routerthen");
      const condition = new Function("$", `return ${_condition}`).call(
        this,
        element
      );
      if (condition) {
        if (element instanceof routerEmptyElement) {
          element.replaceWith(element.$);
        }
        new Function("$", _then).call(this, element);
      } else {
        if (!(element instanceof routerEmptyElement)) {
          const el = new routerEmptyElement();
          el.setAttribute("_routerif", _condition);
          el.$ = element;
          element.replaceWith(el);
        }
      }
    }
  }
  async _runListeners() {
    const elementArray = [
      ...document.querySelectorAll("[_routerevt][_routeract]")
    ];
    for (const element of elementArray) {
      const event = $.get(element, "_routerevt");
      const func = $.get(element, "_routeract");
      _attachEventListener(element, event, func, this);
    }
  }
  async _runDirectives() {
    this._runConditionals();
    this._runListeners();
  }
}
class routerEmptyElement extends HTMLElement {
  constructor() {
    super();
    const a = this.attachShadow({ mode: "open" });
    a.appendChild(
      Object.assign(document.createElement("style"), {
        innerHTML: ":host{display:none}"
      })
    );
  }
}
safeDefine("router-empty", routerEmptyElement);
function _attachEventListener(element, event, listener, routerInstance) {
  element[event] = e => {
    console.log(listener);
    return new Function("$", "$event", listener).call(
      routerInstance,
      element,
      e
    );
  };
}
