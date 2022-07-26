import {Axios} from "./Axios";

function getHome(){
    return Axios.get('home');
}

export const homeService = {
    getHome
};