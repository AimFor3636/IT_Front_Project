## IT Front Project

##### Aim Data Academy ( 클론 코딩 )

#### 프로젝트 파일구조

```
소스코드
├─ attendance.html            // 출결 정보 화면   
├─ board
│  ├─ it_notice.html          // IT 게시판 화면
│  ├─ it_score.html           // IT 평가 화면
│  ├─ japanese_notice.html    // 일본어 게시판 화면
│  ├─ japanese_score.html     // 일본어 평가 화면
│  └─ notice_html             // 공지사항 화면
├─ calendar.html              // 일정 화면
├─ commonScript.js            // 공통 Script 파일
├─ find_id.html               // ID 찾기 화면
├─ login.html                 // 로그인 화면
├─ main_page.html             // 메인 페이지 화면
├─ message
│  ├─ message_form.html       // 메시지 보내기 화면
│  ├─ recieve_list.html       // 받은 메시지 화면 
│  └─ sent_list.html          // 보낸 메시지 화면
├─ mypage
│  ├─ change_password.html    // 비밀번호 변경 화면
│  └─ user_update.html        // 개인정보 수정 화면
├─ score_info.html            // 성적 정보 화면
└─ static                     // 정적 데이터 폴더
   ├─ img
   │  └─ favicon.png
   └─ initData.json
```

#### 코드규칙 및 스타일가이드

참고 사이트 [FrontEnd Coding Convention · FrontEnd Coding Convention](https://jeonghakhur.gitbooks.io/frontend-coding-convention/content/)

##### HTML

###### > id, class 속성명은 전부 소문자, 케밥케이스로 작성 (user-name 형태가 케밥케이스)

```html
<!-- good  -->
<div id="table-container">
    <!-- 내용 -->
</div>

<!-- bad -->
<div id="tableContainer">
    <!-- 내용 -->
</div>
```

###### > input 태그처럼 하나만 존재하는 태그일지라도 닫는 태그 기재

```html
<!-- input, br 태그같이 하나의 태그만 쓰는 태그도 닫는 태그 기재 --> 

<!-- good  -->
<input type="text" />

<!-- bad -->
<input type="text">
```

###### > script 태그는 태그 직전에 선언

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>

   ...
    <script src="js/plugins.js"></script>
    <script src="js/main.js"></script>    <!-- body 닫는태그전에 선언 -->
  </body>
</html>
```

##### CSS

###### 선택자 명칭 전부 소문자, 케밥케이스로 작성

```css
/* good */
.input-text {

}

/* bad */
.inputText {

}
```

###### 중괄호 시작 전, 속성의 콜론(:) 뒤, 속성값 사이에 각각 공백 한칸씩 적용

```css
/* 중괄 시작 앞 */
input {

}

/* 속성의 콜론 뒤 */
.input-text {
  box-sizing: border-box;
}

/* 속성 값 사이 */
.box-error {
  border: 1px soild #eeeeee;
}
```

###### 빈줄이 없도록 작성 반영 전에 빈줄있으면 제거

```css
/* good */
.input-text {
    border: 1px soild #eeeeee;
}

/* bad */
.input-text {

    border: 1px soild #eeeeee;
}
```

###### font-famil, url 등 따옴표로 감싸주어야 하는 속성의 경우 작은따옴표 사용 (' ')

```css
font-family: 'ns-r';
src: url('../font/NotoSans/NotoSans-Light.eot?#iefix') format('embedded-opentype');
```

##### JavaScript

###### 변수명 시작은 소문자, 카멜케이스로, 명사형태로 의미가 나타나도록 작성

```javascript
// good
const userName = "Aimyon";

// bad  
const user-name = "Aimyon";    // 카멜케이스로  작성해야함
const aa  = "marigold"         // 변수명에 의미가 나타나야 함
const run = "tmp-text"         // 동사형태로 말고 명사형태로 작
```

###### 함수명에 역할이 드러나도록 작성 및 함수명 카멜 케이스

```javascript
// good
function isNull() {
    ...
}

// bad
function aa() {

}
```

###### var 대신 const, let 사용

※ var 사용을 지양해야 하는 이유

    1. 호이스팅

    2. 스코프가 함수단위

    위 두가지 특성으로 인해 변수의 간섭 발생으로 의도하지 않은 로직 오류 가능

- 선언 후 재할당이 없는 경우는 const

- 해당 변수에 계속 재할당이일어나는 경우는 let