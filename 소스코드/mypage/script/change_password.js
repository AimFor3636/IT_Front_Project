import { updateUserPassword } from "../../module/userModule.js"


// 버튼클릭 addEventListner
// 
버튼.addEventListner("click", () => {

  // 바꿀password, 재확인 password 체크 다르면 여기서 바로 alert


  // 기존 password , 바꿀 password 
  if (updateUserPassword(예전꺼 , 지금꺼)) {
    "성공" alert 
    // 화면은 main 전환 

    window.location.href = "화면경로" // 이 흐름으로

  } else {
    "현재 비밀번호 다르다" alert
  }
})