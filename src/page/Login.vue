<template>
  <div class="bg-green-300 mx-auto ">
    <div class="bg-green-300 h-screen w-screen">
      <div class="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div class="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/4 bg-white sm:mx-0" >
        <div class="flex flex-col w-full p-4">
          <div class="flex flex-col flex-1 justify-center mb-8">
            <h1 class="text-4xl text-center font-thin">Login </h1>
            <div class="w-full mt-4">
              <form class="form-horizontal w-3/4 mx-auto" method="POST" @submit.prevent="">
                <div class="flex flex-col mt-4">
                  <input id="email" v-model="email" type="text" class="flex-grow h-8 px-2 border rounded border-grey-400" name="email" placeholder="Email"
                          />
                </div>
                <div class="flex flex-col mt-4">
                  <input id="password" v-model="password" type="password" class="flex-grow h-8 px-2 rounded border border-grey-400" name="password" required placeholder="Password"
                          />
                </div>
                <div class="flex flex-col mt-8">
                  <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded" @click="login()"
                  >
                    Login
                  </button>
                </div>
              </form>
              <div class="text-center mt-4">
                <div class="text-center mt-4">
                  bạn chưa có có tài khoản ?
                  <a class="no-underline hover:underline text-blue-dark text-blue-500" href="/signup">
                    đăng ký
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
<!--        <div class="hidden md:block md:w-1/2 rounded-r-lg" style={{ background: 'url("https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80")', backgroundSize: 'cover', backgroundPosition: 'center center' }} />-->
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from "../firebase";
import {onSnapshot, doc, collection,updateDoc,getDoc, setDoc } from 'firebase/firestore';
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods:{
    async login(){
      try {
        const resp = await signInWithEmailAndPassword(auth, this.email, this.password);
        console.log(resp.user);
        const userRef = doc(db, `users/${resp.user.uid}`);
        console.log("oc",userRef);
        setDoc(userRef, {
          id: resp.user.uid,
          email: resp.user.email,
          isOnline: true
        })
        alert('Login success')
        sessionStorage.setItem('user',JSON.stringify(resp.user));
        this.$router.push({name:'home'})
      } catch (e) {
        alert("Ko đăng nhập đc bạn ei")
        console.error(e);
      }
    }
  }
}
</script>

<style scoped>

</style>