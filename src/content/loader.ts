// @ts-expect-error crx-js script injection
import mainScript from "./workspace/main.ts?script&module"

const script = document.createElement('script')
script.src = chrome.runtime.getURL(mainScript)
script.type = 'module'
document.head.prepend(script)