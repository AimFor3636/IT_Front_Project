// 공통 값 세팅
const urlParams = new URLSearchParams(window.location.search);
// 안들어오면 null
const reason = urlParams.get('reason');


// 값이 들어온 경우 체크
if (reason != null && reason != '') {

    const textTag = document.getElementById('exception-text');
    const channelTag = document.getElementById('channel');

    switch (reason) {
        case 'auth':
            channelTag.innerText = '권한 관리';
            textTag.innerText = '권한이 없습니다.';
            break;
        case 'expired':
            channelTag.innerText = '게시판';
            textTag.innerText = '평가시간이 아닙니다.';
            break;
        default:
    }

}