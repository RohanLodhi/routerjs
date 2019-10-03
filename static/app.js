import Router from "../router.js";
import Component, { TextComponent } from "../component.js";
function getDocumentationLink(href) {
  const BETA_PREFIX = "/_/beta/_";
  const docs = "/docs/";
  return `#${BETA_PREFIX}${docs}${href}`;
}
const documentationLinks = {};
const COMPONENT = "component-class";
const ROUTING_RULES = "routing";
[COMPONENT, ROUTING_RULES].map(
  x => (documentationLinks[x] = getDocumentationLink(x))
);
function getFeats(text) {
  return new Component("div", null, [new TextComponent(text)], {
    class: "feat-inf hoverable"
  });
}
const LandingComponent = new Component(
  "div",
  {},
  [
    new Component(
      "div",
      null,
      [
        "Perfect for making single page apps (SPAs)",
        "Adds Client side routing support",
        "Minimal component State",
        "You decide when the app updates",
        "You can control the state changes that don't affect the UI",
        "Write CSS as plain javascript Objects or strings",
        "Easy and configurable 2 way data binding between components"
      ].map(getFeats),
      { class: "feat-items" }
    ),
    new Component("hr"),
    new Component("div", null, [
      new Component("div", null, [new TextComponent("More Info")], {
        style: { "font-size": "1.5rem", "font-weight": "bold" }
      }),
      new Component("div", null, [
        new Component("a", null, [new TextComponent("The Component Class")], {
          href: documentationLinks[COMPONENT]
        })
      ])
    ])
    // new Component("div", null, [new TextComponent("Easy State Changes")])
  ],
  { style: { padding: "10px" } }
);
class ComponentClassDocs extends Component {
  constructor() {
    super(
      "button",
      { isLowerCase: false },
      [new TextComponent("Switch Text Casing")],
      {
        style: {}
      }
    );
    this.attachEventListener("click", () =>
      this.setState({ isLowerCase: !this.getState.isLowerCase })
    );
  }
  updateHook() {
    const cssText = "*{text-transform:lowercase !important}";
    const css =
      document.getElementById("_dynCSS") ||
      Object.assign(document.createElement("style"), { id: "_dynCSS" });
    css.innerHTML = this.getState.isLowerCase ? cssText : "";
    css.isConnected ? void 0 : document.head.appendChild(css);
  }
}
function getBoundComponents() {
  const reflectsFromInput = new (class extends Component {
    constructor() {
      super("div", { data: "" });
      this.__reflectText = new TextComponent("");
      this.children = [this.__reflectText];
    }
    updateHook() {
      this.__reflectText.data = this.getState.data;
    }
  })();
  const inputMain = new (class extends Component {
    constructor() {
      super("input", { data: "sample text" }, [], {
        placeholder: "type something.."
      });
      this.attachEventListener("input", e =>
        this.setState({ data: e.target.value })
      );
    }
  })();
  inputMain.bindData("data", reflectsFromInput, "data");
  return [reflectsFromInput, inputMain];
}
const ComponentDocsComponent = new Component("div", null, [
  new TextComponent("Simple State Changes:"),
  new ComponentClassDocs(),
  new Component("div", null, [
    new TextComponent("Easy 2 way Data Binding"),
    new Component("div", null, getBoundComponents(), { class: "2wdb" })
  ]),
  new Component("div", null, [
    new Component("a", null, [new TextComponent("Back Home")], {
      href: "#/"
    })
  ])
]);
const router = new Router(document.getElementById("app-root"));
router.registerComponent(
  `${documentationLinks[COMPONENT].substr(1)}`,
  ComponentDocsComponent
);
router.registerComponent("/", LandingComponent);
router.startLoad();
console.log(router);
