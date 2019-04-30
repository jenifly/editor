import { DEFAULT_OPTION } from "./config"
import EventCenter from './eventHandler/eventCenter'
import UI from "./ui";

export default {
  bindElem (container, options){
    this.options = Object.assign({}, DEFAULT_OPTION, options)
    this.container = getContainer(container)
    this.eventCenter = new EventCenter()
    this.ui = new UI(this)
  },
  destroy () {
    console.log('aaaaaaaa')
    this.eventCenter.detachAllDomEvents()
  },
  on (event, listener) {
    this.eventCenter.subscribe(event, listener)
  },
  off (event, listener) {
    this.eventCenter.unsubscribe(event, listener)
  },
  once (event, listener) {
    this.eventCenter.subscribeOnce(event, listener)
  },
  setTabSize (tabSize) {
    if (!tabSize || typeof tabSize !== 'number') tabSize = 4
    this.contentState.tabSize = Math.max(1, Math.min(4, tabSize))
  }
}
function getContainer (originContainer) {
  const container = document.createElement('div')
  const rootDom = document.createElement('div')
  const attrs = originContainer.attributes
  Array.from(attrs).forEach(attr => {
    container.setAttribute(attr.name, attr.value)
  })
  container.setAttribute('contenteditable', true)
  container.setAttribute('autocorrect', false)
  container.setAttribute('autocomplete', 'off')
  container.setAttribute('spellcheck', false)
  container.classList.add('jy-editor')
  container.appendChild(rootDom)
  originContainer.replaceWith(container)
  return container
}