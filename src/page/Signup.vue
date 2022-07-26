<template>
 <div>
   <div class="bg-green-300 w-auto mx-auto ">
     <div class="h-screen w-full">
       <div class="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
         <div class="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0" style="">
         <div class="flex flex-col w-full md:w-1/2 p-4">
           <div class="flex flex-col flex-1 justify-center mb-8">
             <h1 class="text-4xl text-center font-thin">Register </h1>
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
                 <div class="flex flex-col mt-4">
                   <input id="confirmPassword" v-model="confirmPassword" type="password" class="flex-grow h-8 px-2 rounded border border-grey-400" name="confirmPassword" required placeholder="confirmPassword"
                   />
                 </div>
                 <div class="flex flex-col mt-8">
                   <button class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded" @click="signup()"
                   >
                     Register
                   </button>
                 </div>
                 <div class="text-center mt-4">
                   bạn đã có tài khoản ?
                   <a class="no-underline hover:underline text-blue-dark text-blue-500" href="/">
                     đăng nhập
                   </a>
                 </div>
               </form>

             </div>
           </div>
         </div>
         <div class="hidden md:block md:w-1/2 rounded-r-lg mx-auto my-auto mr-5">
            <img src="https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80" alt="">
         </div>
       </div>
     </div>
   </div>
 </div>
 </div>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/firebase";
import { collection, getDocs, deleteDoc, doc, onSnapshot, addDoc, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
export default {
  name: "Signup",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async signup() {
      if(this.email == "" || this.password == "" || this.confirmPassword == ""){
        alert("không được bo trống trường nào");
        return;
      }else if (this.password !== this.confirmPassword) {
        alert("password và confirmPassword không giống nhau");
        return;
      }
      try {
        const response = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const collectionRef = collection(db, 'users');
        console.log(response.user.email);
        await addDoc(collectionRef, {
          email: response.user.email,
          userId: response.user.uid,
        });
        alert('Register success')
        this.$router.push({name:'login'})
      } catch (error) {
        console.log(error.message);
      }
    },
  },
}
</script>

<style scoped>
/*.bvn{*/
/*  background-image: url('https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80'),*/
/*  backgroundSize: 'cover',*/
/*  backgroundPosition: 'center center'*/
/*}*/
</style>