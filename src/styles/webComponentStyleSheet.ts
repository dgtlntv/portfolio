import webComponentCss from "./web-components.css?inline"

const webComponentStyleSheet = new CSSStyleSheet()
webComponentStyleSheet.replaceSync(webComponentCss)

export { webComponentStyleSheet }
