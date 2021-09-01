<template>
    <div>
        <component :is="apps"></component>
        <router-view />
    </div>
</template>

<script>
export default {
    
    data(){
        return{
            apps:null
        }
    },
    
    methods:{
        // 动态加载组件
        currentRouteHandle(){
            let isLoad = this.$route.path == '/platformAnchor/platformAnchorManage'
            if(isLoad){
                this.apps = ()=>import('./platformAnchorManage.vue')
            }else{
                this.apps = null
            }
        }
    },
    watch:{
        
        '$route.path':{
            handler(){
                this.currentRouteHandle()
            },
            immediate:true
        }
    },
    
}
</script>