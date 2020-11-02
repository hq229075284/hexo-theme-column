const TAB_PREV = 'tab_prev'
const TAB_NEXT = 'tab_next'
class Tabs {
    activeIndex = 0
    prevEl = null
    nextEl = null
    spaceEl = null
    handlerMap = {}
    prevTransform=0
    constructor() {
        this.$root = document.querySelector('.content-thumb .tabs')
        this.$tabs = Array.from(this.$root.querySelectorAll('.tab'))
        this.$slide = this.$root.querySelector('.slide')
    }
    setNavigetion() {
        this.$root.style.position = 'relative'
        this.$root.style.overflow = 'hidden'
        const prevEl = document.createElement('div')
        prevEl.style.position = 'absolute'
        prevEl.style.top = '0'
        prevEl.style.height = '100%'
        prevEl.style.fontSize = '30px'
        prevEl.style.color = '#C9CED1'
        prevEl.style.backgroundColor = '#fff'
        prevEl.style.display = 'flex'
        prevEl.style.alignItems = 'center'
        prevEl.style.cursor = 'pointer'
        prevEl.style.zIndex = '1'
        prevEl.style.boxShadow = '0 0 4px #9e9e9e63'
        prevEl.classList.add('iconfont')
        const nextEl = prevEl.cloneNode(true)
        const firstTab = this.$root.firstElementChild

        // const spaceEl=this.spaceEl=document.createElement('div')
        // // spaceEl.style={...this.$tabs[0].style}
        // spaceEl.style.display='inline-block'
        // spaceEl.style.width='30px'
        // spaceEl.style.height='100%'
        // this.$root.insertBefore(spaceEl,firstTab)

        prevEl.style.left = '0'
        prevEl.classList.add('icon-bx-chevron-left')
        this.$root.insertBefore(prevEl, firstTab)
        prevEl.addEventListener('click', this.runListener(TAB_PREV))
        this.prevEl = prevEl

        nextEl.style.right = '0'
        nextEl.classList.add('icon-bx-chevron-right')
        this.$root.appendChild(nextEl)
        nextEl.addEventListener('click', this.runListener(TAB_NEXT))
        this.nextEl = nextEl
    }
    setTranlate() {
        const translateX = this.$tabs.slice(0, this.activeIndex).reduce((prev, tab) => prev + tab.clientWidth, 0)
        const maxTranslateX=this.$tabs.reduce((prev, tab) => prev + tab.clientWidth, 0)-this.getRootContentWidth()
        
        this.$slide.style.transform = `translate3d(-${Math.min(translateX,maxTranslateX)}px,0,0)`
        this.$slide.style.transition=this.setTransition(Math.abs(this.prevTransform-Math.min(translateX,maxTranslateX)))
        
        this.prevTransform=Math.min(translateX,maxTranslateX)

        this.prevEl.style.display=this.prevTransform===0?'none':'flex'
        
        this.nextEl.style.display=this.prevTransform===maxTranslateX?'none':'flex'
    }
    setTransition(distance){
        return `transform ${distance*4}ms linear`
    }
    next(){
        if(this.activeIndex+1<this.$tabs.length){
            this.activeIndex+=1
            this.setTranlate()
        }
    }
    prev(){
        if(this.activeIndex-1>-1){
            this.activeIndex-=1
            this.setTranlate()
        }
    }
    getRootContentWidth(){
        const rootStyle = getComputedStyle(this.$root)
        const rootContentWidth = this.$root.clientWidth - ['marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'].reduce((prev, key) => prev + parseFloat(rootStyle[key].match(/\d+(.\d+)?/)[0]), 0)
        return rootContentWidth
    }
    init() {
        const rootContentWidth = this.getRootContentWidth()
        this.activeIndex = 0
        if (this.$tabs.reduce((prev, tab) => prev + tab.clientWidth, 0) > rootContentWidth) {
            this.setNavigetion()
            this.setTranlate()
        }
    }
    runListener(eventName) {
        const _self = this
        return function (...args) {
            const { handlerMap } = _self
            if (handlerMap[eventName]) {
                handlerMap[eventName].forEach(fn => fn.apply(this, args))
            }
        }
    }
    on(eventName, fn) {
        const { handlerMap } = this
        if (handlerMap[eventName]) {
            handlerMap[eventName].push(fn)
        } else {
            handlerMap[eventName] = [fn]
        }
    }
    off(eventName, fn) {
        const { handlerMap } = this
        if (handlerMap[eventName]) {
            if (fn) {
                handlerMap[eventName] = handlerMap[eventName].filter(f => f !== fn)
                if (handlerMap[eventName].length === 0) {
                    handlerMap[eventName] = null
                }
            } else {
                handlerMap[eventName] = null
            }
        }
    }
}

const tabInstance=new Tabs()
tabInstance.init()

tabInstance.on(TAB_PREV,function(){
    tabInstance.prev()
})

tabInstance.on(TAB_NEXT,function(){
    tabInstance.next()
})