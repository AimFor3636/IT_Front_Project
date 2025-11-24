### 프로젝트명

#### Aim Data Academy ( 클론 코딩)

### 프로젝트 목표

: Data Science Academy 를 참고한 클론코딩 진행을 통하여 

아래와 같은 목표를 달성하고자 함 

1. 클론 코딩 작업을 통한 FrontEnd 이해도 및 숙련도 향상

2. 단체 프로젝트 협업에 대한 경험치 획득 및 협업 Tool 에 대한 숙련도 향상 

3. localStroage를 활용하여 FrontEnd 만으로 구동되는 임시 사이트 완성

### 

### 프로젝트 기간

: 2025년 11월 10일 ~ 11월 23일 ( 2주간 )

#### 

### 주요 기능

※ Data Science Academy 의 서비스를 참고하여 구현

1. 사용자 관련 기능

2. 메인페이지 및 일정 관리

3. 게시판 및 메시지 기능

#### 프로젝트 파일구조

```
📦프로젝트 폴더
 ┣ 📂board                       // 게시판
 ┃ ┣ 📂script                    // 게시판 Script
 ┃ ┣ 📜exception.html
 ┃ ┣ 📜it_notice.html
 ┃ ┣ 📜it_score.html
 ┃ ┣ 📜japanese_notice.html
 ┃ ┣ 📜japanese_score.html
 ┃ ┣ 📜notice.html
 ┃ ┣ 📜notice_detail.html
 ┃ ┣ 📜notice_form.html
 ┃ ┣ 📜score_detail.html
 ┃ ┗ 📜score_form.html
 ┣ 📂message                    // 메시지
 ┃ ┣ 📂script                   // 메시지 Script
 ┃ ┣ 📜message_form.html
 ┃ ┣ 📜recieve_detail.html
 ┃ ┣ 📜recieve_list.html
 ┃ ┣ 📜send_detail.html
 ┃ ┗ 📜send_list.html
 ┣ 📂module                    // 스크립트 Module
 ┃ ┣ 📜boardModule.js          // 게시판 Module
 ┃ ┣ 📜commonModule.js         // 공통 Module
 ┃ ┣ 📜messageModule.js        // 메시지 Module  
 ┃ ┗ 📜userModule.js           // 사용자 Module
 ┣ 📂mypage                    // 사용자 관리 
 ┃ ┣ 📂script                  // 사용자 관리 Script
 ┃ ┣ 📜change_password.html
 ┃ ┗ 📜user_update.html
 ┣ 📂static                    // 정적 파일 경로
 ┃ ┣ 📂img
 ┃ ┣ 📜boardScript.js
 ┃ ┣ 📜calendarScript.js
 ┃ ┣ 📜initData.json
 ┃ ┗ 📜style.css
 ┣ 📜attendance.html                     // 출석 관
 ┣ 📜auth_manage.html                    // 권한 관리
 ┣ 📜auth_manage.js                     
 ┣ 📜calendar.html                       // 일정
 ┣ 📜commonScript.js                     // 공통 Script
 ┣ 📜common_ui.html
 ┣ 📜dtoScript.js
 ┣ 📜ex_file_join_membership.html        
 ┣ 📜find_id.html
 ┣ 📜find_id.js                          // ID 찾기
 ┣ 📜find_password.html                  // 비밀번호 찾기
 ┣ 📜join_membership.html                // 회원가입
 ┣ 📜join_membership.js
 ┣ 📜login.html                          // 로그인
 ┣ 📜login.js                          
 ┗ 📜main_page.html                      // 메인 페이지
```

### 

#### 팀원 소개

| 이상우                                                                                                                                                                                                                                      | 이민재                                                                                                                                | 김원형                                                                                                                                                                                                                                                                                                                                        | 정원교                                                                                                                                                                                                                                                                                 |
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| <img title="" src="https://mblogthumb-phinf.pstatic.net/MjAyNDA4MjNfMjc5/MDAxNzI0Mzg4MDAzOTA1.YgVOu83asT_E4Yu1KsB0urt2fbNle109VR6JBpIgBa8g.wG8a4NWuh1Sf97r1GIzXUznIJ_fI1X-hoZBmdqCjGWcg.JPEG/capybara.jpg?type=w800" alt="" width="135"> | <img title="" src="https://thumb.ac-illust.com/d1/d125c0dc06567d79747c0d8edbd4f30c_t.jpeg" alt="" width="152" data-align="center"> | <img title="" src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA1MzFfMTk1%2FMDAxNzE3MTYzMjQxNzk3.unUv9Y-4_X-jaL2Rr5TSG9FSnqV-KtfE29YJSBtlTYQg.mwedxha1Yb7j93r6sp5Ocs9rgdRByUEUjkU7fMAAkHAg.JPEG%2F%25BA%25B8%25B3%25EB%25BA%25B8%25B3%25EB.jpg&type=sc960_832" alt="" width="153" data-align="center"> | <img title="" src="https://mblogthumb-phinf.pstatic.net/MjAxNzAyMjJfMTg3/MDAxNDg3NzI4NTQ2NjYz.PXKT8WOvIrVgUamJQqSIGdwjeUHlO6GKKQBJrcHejLsg.EgM4jWM1lZh3NGoC2BUgXQ2aFzqQnSCh8ivhMmT7wWUg.PNG.ioea65ztem/02.%EA%B5%AC%EA%B8%80.png?type=w800" alt="" width="134" data-align="center"> |
| 스크립트 모듈 &<br/>전체 PM 역할 수행                                                                                                                                                                                                                | 공통 CSS 작성 &<br/>메인/일정 화면                                                                                                           | 로그인/회원가입 &<br/>게시판                                                                                                                                                                                                                                                                                                                         | 개인정보 관리 &<br/>메시지                                                                                                                                                                                                                                                                   |

### 사용 기술

- **언어 기술** 
  
  <div>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white"/>
  
  </div>

- **써드 파티**
  
  <div>
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white"/>
  <img src="https://img.shields.io/badge/CryptoJS-000000?style=flat-square&logo=crypto&logoColor=white"/>
  <img src="https://img.shields.io/badge/SweetAlert2-E2463F?style=flat-square&logo=sweetalert2&logoColor=white"/>
  </div>

- **협업 Tool**
  
  <div>
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/>
  <img src="https://img.shields.io/badge/figma-F24E1E.svg?style=flat-square&logo=figma&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Meet-00AC47?style=flat-square&logo=googlemeet&logoColor=white"/>
  
  </div>

※ 참고 주소

[Github 주소]([GitHub - AimFor3636/IT_Front_Project](https://github.com/AimFor3636/IT_Front_Project))

[Figma 주소](https://www.figma.com/board/HjCDS0Uq5DKsqQjRaGbHwS/ICT-Front-Project?node-id=0-1&p=f&t=EP5EYYNF9KwMWMRO-0)

#### 

#### 추후 개선 방향

- MVC 패턴을 적용하여 리팩토링 진행
  
  - Spring 및 JPA 를 활용하여 MVC 패턴을 지키는 코드로 리팩토링 진행
  
  - 타임리프를 활용한 SSR (서버사이드렌더링) 구현

- 구현 생략한 기능들 실제로 적용
  
  - 메신저 본문에 위지윅(WYSIWYG) 에디터 적용
  
  - 첨부파일 저장 되도록 구현
    
        

##### 코드규칙 및 스타일가이드

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