<template>
  <div class="container mx-auto ">
    <div class="w-4/6 mx-auto border mt-20 rounded lg:grid lg:grid-cols-3">
      <div class="lg:col-span-3 lg:block">
        <form @submit.prevent="" class="w-full">
          <div class="w-full relative flex items-center p-3 border-b border-gray-300">
            <img class="object-cover w-10 h-10 rounded-full"
                 src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg" alt="username" />
            <span class="w-full block ml-2 font-bold text-gray-600">Nhóm chat fake</span>
            <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
              </span>
            <div class="w-full flex justify-end">
              <button class="text-white bg-red-500 px-3 py-2 rounded" @click="logout()">Đăng xuất</button>
            </div>
          </div>
          <div class="relative w-full p-6 overflow-y-auto h-[40rem]">
            <ul class="space-y-2">
              <li :class="user.uid == mes.uid ? 'flex justify-end':'flex justify-start'" v-for="(mes,index) in dataMessage.sort((a,b)=>a.date - b.date)" :key="index">
                <div>
                  <div v-if="mes.message !== ''" >{{mes.name}}</div>
                  <div v-if="mes.message !== ''" :class="user.uid == mes.uid ? 'relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow flex justify-end':'relative max-w-xl px-4 py-2 text-gray-700 rounded shadow'">
                    <span class="block">{{mes.message}}</span>
                  </div>
                  <div v-if="mes.urls.length > 0" class="mt-1 flex justify-end">
                    <img class="w-40 h-40 object-cover overflow-hidden" :src="mes.urls[0]" alt="">
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="" v-if="preFiles.length > 0">
            <div class="w-40 h-40 relative" v-for="(img,index) in preFiles" :key="index">
              <img class="w-40 h-40 object-cover shadow" type="img" :src="img"  />
              <i class="w-6 h-6 absolute z-10 top-2 left-32 rounded-full text-center flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100 hover:bg-gray-200 bg-gray-300 text-2xl" @click="removeSelectedImage(index)"><i class="fa-solid fa-xmark"></i></i>
            </div>
          </div>
          <div class="flex items-center justify-between w-full p-3 border-t border-gray-300 ">
            <label for="image" class="cursor-pointer text-gray-500">
              <i class="fa-solid fa-image"></i>
              <input type="file" id="image" class="hidden" access="image/*" @change="imageChange($event)" multiple>
            </label>

            <input type="text" placeholder="Message" v-model="message"
                   class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                   name="message" />
            <button @click="postMessage()">
              <svg class="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 20 20" fill="currentColor">
                <path
                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {getAuth, signOut} from "firebase/auth";
import {auth, db} from "../firebase";
import {getStorage, uploadBytes, ref, getDownloadURL} from "firebase/storage";
import {collection,addDoc, getDocs, deleteDoc, doc, onSnapshot, limit, query, orderBy, where} from 'firebase/firestore';
export default {
  name: "HomePage",
  data() {
    return {
      message: "",
      selectedImage:[],
      files:[],
      preFiles:[],
      user:null,
      dataMessage:[],
    };
  },
  methods : {
    logout() {
      console.log(auth)
      signOut(auth).then(() => {
        sessionStorage.removeItem('user');
        this.$router.replace('/')
        alert("Đăng xuất thành công")
      }).catch((error) => {
        console.log(error)
      });
    },
    async postMessage(){
      const storage = getStorage();//base storage //unix
      if (!this.message && this.preFiles.length == 0) {
        console.log(this.preFiles.length)
        alert("ghi rồi mới submit bạn êiiii");
        return;
      }

      const urls = []
      const fileName = `images/${Date.now()}image.png`;
      const myRef = ref(storage, fileName);//tao ref
      await uploadBytes(myRef, this.files[0], fileName);
      const pathRef = ref(storage, fileName);
      const url = await getDownloadURL(pathRef);
      console.log(url);
      urls.push(url);
      const collectionRef = collection(db, 'chats');
      await addDoc(collectionRef, {
        message: this.message,
        uid: this.user.uid,
        date: new Date(),
        urls:urls,
        name: this.user.email,
      });
      this.message = '';
      this.files = [];
      this.preFiles = [];
    },
    imageChange(e) {
      if (e.target.files) {
        this.files = e.target.files;
        console.log("this.files",this.files)
        this.preFiles = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
        console.log("this.preFiles",this.preFiles)
      }
    },
    async getMessage(){
      let unSub = null;
      const collectionRef = collection(db, 'chats');
      // const collectionQuery = query(collectionRef, where('userUid', 'in', [[userId, user.uid], [user.uid, userId]]));
      unSub = onSnapshot(collectionRef, (snapShot) => {
      let localMessage = [];
      console.log("localMessage",localMessage)
        snapShot.forEach(doc => {
          localMessage.push({
            id: doc.id,
            message: doc.data().message,
            uid: doc.data().uid,
            date: doc.data().date,
            urls: doc.data().urls,
            name: doc.data().name,
          });
        });
      this.dataMessage = localMessage;
      });
      console.log("dataMessage",this.dataMessage)
    },
    removeSelectedImage(index){
      const postFile = [...this.files];
      postFile.splice(index,1)
      this.preFiles.splice(index,1);
      this.files = postFile;
      console.log(this.files)

    }
  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem("user"))
    console.log(this.user);
    if (this.user == null) {
      alert("Bạn cần đăng nhập để vào trang này!")
      this.$router.replace("/")
      return;
    }else {
      this.getMessage();
    }
  },
}
</script>

<style scoped>

</style>