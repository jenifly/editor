<template>
<div class="main">
  <div class="editor" ref="editor"/>
</div>
</template>

<script>
import Jyzy from "../core"
export default {
  data () {
    return {
      line: 0,
      selection: '',
      selectLine: '',
      markdown: ''
    }
  },
  created () {
    this.$nextTick(() => {
      Jyzy.bindElem(this.$refs.editor)
    })
  },
  mounted () {
    document.addEventListener('selectionchange', (e)=>{
      this.selection = getSelection()
      this.getSelectLine(this.selection.baseNode)
    })
  },
  computed: {

  },
  methods: {
    getSelectLine (node) {
      if(!node) return
      if(node.className == 'line') return this.selectLine = node
      this.getSelectLine(node.parentNode)
    },
    insertEle (n) {
      var el = document.createElement(n)
      if(n=='div'){
        el.className="line"
        if(this.selectLine.nextSibling){
          this.$refs.editor.insertBefore(el, this.selectLine.nextSibling)
        el.click()
        }else this.$refs.editor.append(el)
      }else{
        this.selectLine.append(el)
      }
      var range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(true)
      range.setEnd(el, el.childNodes.length)
      range.setStart(el, el.childNodes.length)
      if(!this.selection) return
      this.selection.removeAllRanges()
      this.selection.addRange(range)
    },
    i (e) {
      var text = this.selectLine.innerHTML
      if(text=='#&nbsp;') {
        this.selectLine.innerHTML = ''
        this.insertEle('h1')
      }
      // console.log(this.selectLine.innerHTML)
      
      // console.log(e)
    },
    e (e) {
      if(e.keyCode==13){
        e.preventDefault()
        this.insertEle('div')
      }
      console.log(this.$refs.editor.innerText);
      
      if(this.$refs.editor.innerText.split('')<=1&&e.keyCode==8) e.preventDefault()
    }
  }
}
</script>
<style>
p, div {
  outline: none;
}
.main {
  text-align: left;
  height: 100vh;
  width: 80%;
  margin: auto;
  font-size: 16px;
}
.editor {
  padding: 1px;
  height: 100%;
  background: #efefef;
}
.editor .line {
  min-height: 2em;
  line-height: 2em;
  margin: 0;
}
h1 {
  height: 1em;
}
</style>
