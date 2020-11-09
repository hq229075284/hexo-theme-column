hexo.locals.set('HOME_HTML_PAGE_PATH', function(){
    return 'index.html'
});

function getAccessPath(url){
    const url_for=hexo.extend.helper.get('url_for').bind(hexo)
    return url_for(url).split('#')[0].split('?')[0]
}
// ejs中使用的帮助函数
const helpers={
    getPathObj(path){
        const keys=['folder','file'] 
        const args=path.split('/')
        if(args[0]&&args[0].indexOf('.html')>-1) return {}
        return keys.reduce((prev,key,i)=>{prev[key]=args[i];return prev},{})
    },
    isHighLightPost({post,path,index}){
        const postPathFromRoot=getAccessPath(post.path)
        const accessPath=getAccessPath(path)
        if(postPathFromRoot===accessPath.replace(/[^\/]+$/,'')){
            return 'active'
        }
        return ''
    },
    getArticleContent({path,site}){
        try{
            const postPath=path.replace(/[^\/]+$/,'')
            return site.posts.data.find(one=>one.path===postPath).content
        }catch(e){
            return site.posts.data[0].content
        }
    }
}

Object.keys(helpers).forEach(key=>{
    hexo.extend.helper.register(key,helpers[key])
})