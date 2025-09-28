import globalCss from "./global.css?inline";

const globalStyleSheet = new CSSStyleSheet();
globalStyleSheet.replaceSync(globalCss);

export { globalStyleSheet };