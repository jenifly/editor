import { EVENT_KEYS } from '../config'
import marked from 'marked'

class UI {
  constructor (jyzy) {
    this.jyzy = jyzy
    this.listen()
    var rendererMD = new marked.Renderer();
    marked.setOptions({
      renderer: rendererMD,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });
  }
  listen () {
    const { eventCenter, container } = this.jyzy
    container.innerHTML='<p class="jy-entry"><br></p>'
    const handler = event => {
      switch (event.key) {
        case EVENT_KEYS.Enter:
          event.stopPropagation()
          event.preventDefault()
          this.insertEle(container , '<p class="jy-entry"><br></p>')
          break
        case EVENT_KEYS.Backspace:
          if(container.innerText == '\n') {
            event.stopPropagation()
            event.preventDefault()
          }
          if(this.activeItem.innerText=='\n' && this.activeItem.nodeName!='P'){
            event.stopPropagation()
            event.preventDefault()
            var el = document.createElement('div')
            el.innerHTML = '<p class="jy-entry"><br></p>'
            container.replaceChild(el.firstChild, this.activeItem)
          }
          break
        default:
          if(event.key.length == 1||event.key=='Process') {
            if(this.activeItem.innerText==''||this.activeItem.innerText=='\n') return
            var tokens = marked.lexer(this.activeItem.innerText+event.key)
            if(tokens[0].type != 'paragraph') {
              this.first = tokens[0].type
              var el = document.createElement('div')
              el.innerHTML = marked.parser(tokens).replace(/>.+</, '><br><')
              container.replaceChild(el.firstChild, this.activeItem)
              return
            }
            if(event.key != ' ' && event.key != 'Process') {
              // console.log(marked.parser(tokens).match(/<p>(.+)<\/p>/)[1]);
              this.activeItem.innerHTML = marked.parser(tokens).match(/<p>(.+)<\/p>/)[1]
              this.rang(this.activeItem)
              event.stopPropagation()
              event.preventDefault()
            }
          }
      }
    }
    const input = () => {
      if(this.activeItem.innerText==''||this.activeItem.innerText=='\n'||this.cpLock) return
      var tokens = marked.lexer(this.activeItem.innerText)
      if(!this.first || tokens[0].type != 'paragraph') {
        this.first = tokens[0].type
        this.insertEle (container, marked.parser(tokens))
        container.removeChild(this.activeItem)
      }else {
        if(this.activeItem.innerText.charAt(this.activeItem.innerText.length - 1).match(/[a-zA-Z]+/)){
          this.activeItem.innerHTML = marked.parser(tokens)
          console.log(marked(this.activeItem.innerText));
          
          this.rang(this.activeItem)
        }
      }
    }
    eventCenter.attachDOMEvent(document, 'selectionchange', e => {
      if(!this.focus) return
      this.selection = getSelection()      
      this.getItemElement(this.selection.anchorNode)
    })
    eventCenter.attachDOMEvent(container, 'keydown', handler)
    eventCenter.attachDOMEvent(container, 'focus', () => this.focus = true)
    eventCenter.attachDOMEvent(container, 'blur', () => this.focus = false)
    // eventCenter.attachDOMEvent(container, 'input', input)
    // eventCenter.attachDOMEvent(container, 'compositionstart', () => this.cpLock =true)
    // eventCenter.attachDOMEvent(container, 'compositionend',  () => {this.cpLock =false;input()})
  }
  insertEle (c, n) {
    var el = document.createElement('div')
    el.innerHTML = n
    el = el.firstChild
    if(this.activeItem.nextSibling){
      c.insertBefore(el, this.activeItem.nextSibling)
    }else c.append(el)
    this.rang(el)
  }
  rang (el) {
    var range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(true)
    range.setEnd(el, el.childNodes.length)
    range.setStart(el, el.childNodes.length)
    this.selection.removeAllRanges()
    this.selection.addRange(range)
  }
  getItemElement (node) {
    if(!node) return
    if(node.parentNode.className.indexOf('jy-editor') > -1) return this.activeItem = node
    this.getItemElement(node.parentNode)
  }
}

export default UI