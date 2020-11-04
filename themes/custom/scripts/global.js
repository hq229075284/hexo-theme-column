hexo.locals.set('HOME_HTML_PAGE_PATH', function(){
    return 'index.html'
});

hexo.extend.helper.register('getPathObj',function(path){
    const keys=['folder','file'] 
    const args=path.split('/')
    if(args[0]&&args[0].indexOf('.html')>-1) return {}
    return keys.reduce((prev,key,i)=>{prev[key]=args[i];return prev},{})
})

hexo.extend.helper.register('isHighLightPost',function({post,path,index}){
    const pathObj=hexo.extend.helper.get('getPathObj')(path)
    if(pathObj.file){
        if(pathObj.file.split('.')[0]===post.title){
            return 'active'
        }
    }else if(index===0){
        return 'active'
    }
    return ''
})