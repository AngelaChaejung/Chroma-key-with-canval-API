// HTML Body에 녹화 시작 버튼과 녹화 종료 버튼 태그를 추가합니다.
// <button id="start-btn">녹화 시작</button>
// <button id="finish-btn">녹화 종료</button>

const startBtn = document.getElementById("start-btn");
const finishBtn = document.getElementById("finish-btn");

let mediaRecorder = null;
let recordedMediaUrl = null;

// 녹화 시작 버튼 클릭 시 빌생하는 이벤트 핸들러 등록
startBtn.addEventListener("click", function () {
  let mediaData = [];

  // 1.MediaStream을 매개변수로 MediaRecorder 생성자를 호출
  mediaRecorder = new MediaRecoder(mediaStream, {
    mimeType: "video/webm; codecs=vp9",
  });

  // 2. 전달받는 데이터를 처리하는 이벤트 핸들러 등록
  mediaRecorder.ondataavailable = function (event) {
    if (event.data && event.data.size > 0) {
      mediaData.push(event.data);
    }
  };

  // 3. 녹화 중지 이벤트 핸들러 등록
  mediaRecorder.onstop = function () {
    const blob = new Blob(mediaData, { type: "video/webm" });
    recordedMediaUrl = new URL.createObjectURL(blob);
  };

  // 4. 녹화 시작
  mediaRecorder.start();
});

// 녹화 종료 버튼 클릭 시 빌생하는 이벤트 핸들러 등록
finishBtn.addEventListener("click", function () {
  if (mediaRecorder) {
    // 5. 녹화 중지
    mediaRecorder.stop();
    mediaRecorder = null;
  }
});
