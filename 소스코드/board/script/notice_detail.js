import {userAuth, dataKeyObj, findObjectInLocalStorage, findArrayInLocalStorage, saveDataInLocalStorage} from "../../module/commonModule.js";
import * as BOARD_MODULE from "../../module/boardModule.js"; 


const urlParams = new URLSearchParams(window.location.search);
const boardNo = urlParams.get('boardNo');