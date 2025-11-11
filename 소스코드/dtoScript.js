export const userDto = {
    userNo: "",         // 유저 PK 값
    userName: "",       // 성함
    password: "",       // 비밀번호 (암호화)
    emailAddress: "",   // 이메일 (암호화)
    birthday: "",       // 생년월일
    telNumber: "",      // 전화번호
    phoneNumber: "",    // 핸드폰 번호
    zipCode: "",        // 우편 주소
    address: "",        // 주소
    userAuthor: "",     // 권한
    registerDate: "",   // 가입 일자
};

export const boardDto = {
    boardNo: "",        // 게시판 PK 값
    title: "",          // 게시판 제목
    content: "",        // 게시판 내용
    userNo: "",         // 작성자 userNo
    categoryNo: "",     // 게시판 Category
    insertDate: "",     // 최초 작성일자
    updateDate: ""      // 최종 수정일자
};

export const messageDto = {
    messageNo: "",       // 메시지 PK 값
    title:     "",       // 메시지 제목
    content:   "",       // 메시지 내용
    sendUserNo: "",      // 보낸사람 userNo
    receiveUserNo: "",   // 받는사람 userNo
    insertDate: ""       // 메시지 전송일자
}

export const messageFileDto = {
    messageNo: "",
    segNo    : "",          // messageNo ,segNo 복합 PK
    filePath : "",          // 파일 경로
    insertDate: ""          // 생성 일자
}

export let userPk = 1;
export let boardPk = 1;
export let messagePk = 1;