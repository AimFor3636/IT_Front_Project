export const userDto = {
    userNo: '',         // 유저 PK 값
    userName: '',       // 성함
    userId: '',         // 유저 ID
    password: '',       // 비밀번호 (암호화)
    emailAddress: '',   // 이메일 (암호화)
    birthday: '',       // 생년월일
    telNumber: '',      // 전화번호
    phoneNumber: '',    // 핸드폰 번호
    zipCode: '',        // 우편 주소
    address: '',        // 주소
    detailAddress: '',  // 상세 주소
    userAuth: '',     // 권한
    registerDate: '',   // 가입 일자
    registerTimestamp: "", // 정렬용 일자
};

export const boardDto = {
    boardNo: '',         // 게시판 PK 값
    title: '',           // 게시판 제목
    content: '',         // 게시판 내용
    userNo: '',          // 작성자 userNo
    categoryNo: '',      // 게시판 Category
    boardCount: 0,       // 조회수 0 부터 시작
    insertDate: '',      // 최초 작성일자
    updateDate: '',      // 최종 수정일자
    insertTimeStamp: '', // 정렬용 작성일자
    updateTimeStamp: '', // 정렬용 수정일자
    startDate:'',        // 시작시간 ( 평가 게시글 용)
    endDate:''           // 종료시간 ( 평가 게시글 용)
};

export const messageDto = {
    messageNo: '',       // 메시지 PK 값
    categoryNo: '',      // 메시지 유형
    title:     '',       // 메시지 제목
    content:   '',       // 메시지 내용
    sendUserNo: '',      // 보낸사람 userNo
    receiveUserNo: '',   // 받는사람 userNo
    insertDate: '',      // 메시지 전송일자
    insertTimeStamp: ''  // 정렬용 전송일자
}

export const messageFileDto = {
    messageNo: '',
    segNo    : '',          // messageNo ,segNo 복합 PK
    filePath : '',          // 파일 경로
    insertDate: '',         // 생성 일자
    insertTimeStamp: ''     // 정렬용 생성일자
}

let userPk = 1;
let boardPk = 1;
let messagePk = 1;

export function getUserPk() {
    const today = new Date();
    const curUserPk = `${today.getMonth()}${today.getDay()}${today.getMilliseconds()}${userPk}`;
    userPk += 1;

    return curUserPk;
}

export function getBoardPk() {
    const today = new Date();
    const curBoardPk = `${today.getMonth()}${today.getDay()}${today.getMilliseconds()}${boardPk}`;
    boardPk += 1;

    return curBoardPk;
}

export function getMessagePk() {
    const today = new Date();
    const curMessagePk = `${today.getMonth()}${today.getDay()}${today.getMilliseconds()}${messagePk}`;
    messagePk += 1;

    return curMessagePk;
}