import Router from "/routerjs/router.js";
import Component, { TextComponent } from "/routerjs/component.js";

const HelloComponent = new Component("div", {}, [
  new TextComponent("Hello!"),
  new Component("a", {}, [new TextComponent("Load /")], {
    href: "#/",
    style: { display: "block" }
  })
]);
const jsButton = new (class extends Component {})(
  "div",
  {},
  [new TextComponent("Click me to change my color")],
  { class: "black", id: "_r" },
  {
    click: () =>
      jsButton.setDomAttrs({
        class: jsButton.$element.className === "black" ? "red" : "black"
      })
  }
);
// const jsButton = new Component("div", { ok: "lel" }, [
//   new TextComponent("Click!")
// ]);
// jsButton.attachEventListener("click", () => {
//   jsButton.setState({ ok: "lel" }, true);
// });
const IndexComponent = new Component("div", {}, [
  new TextComponent("Hello from routerjs!"),
  new Component("a", {}, [new TextComponent("Load /hello")], {
    href: "#/hello",
    style: { display: "block" }
  }),
  jsButton
]);
const router = new Router(document.getElementById("app-root"));
router.registerComponent("/hello/", HelloComponent);
router.registerComponent("/", IndexComponent);

router.startLoad();
