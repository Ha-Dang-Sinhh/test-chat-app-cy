import VueRouter from "vue-router";
import Vue from "vue";
Vue.use(VueRouter);
export const router = new VueRouter({
    routes:[
        {
            path:'/home',
            name:'home',
            component:()=>import('../page/HomePage')
        },
        {
            path:'/signup',
            name:'Signup',
            component:()=>import('../page/Signup')
        },
        {
            path:'/',
            name:'Login',
            component:()=>import('../page/Login')
        },

    ],
    mode: "history"
})