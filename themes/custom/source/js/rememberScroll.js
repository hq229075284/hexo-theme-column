class Store {
    constructor(storeKey = 'rememberScroll') {
        this.storeKey=storeKey
        this.map = window.sessionStorage.getItem(this.storeKey) ? JSON.parse(window.sessionStorage.getItem(this.storeKey)) : {}
    }
    set(key,value){
        this.map[key]=value
        return this
    }
    get(key){
        return this.map[key]||0
    }
    save(){
        window.sessionStorage.setItem(this.storeKey,JSON.stringify(this.map))
    }
}

class RememberScroll {
    constructor() {
        this.store = new Store()
        this.map={}
        console.log(1)
        window.addEventListener('beforeunload',(event)=>{
            Object.keys(this.map).forEach(key=>{
                this.store.set(key,this.map[key].scrollTop)
            })
            this.store.save()
            // event.returnValue = null;
        })
    }
    resigter(key, dom) {
        this.map[key]=dom
        return this
    }
    tryRecoverScroll(key){
        this.map[key].scrollTop=this.store.get(key)
    }
}

const rememberScroll=new RememberScroll()
rememberScroll.resigter('list',$('.content-thumb .list')[0]).tryRecoverScroll('list')