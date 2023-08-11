import React, { useEffect, useRef } from "react";
import { styled } from "styled-components";
import Script from "./Script";

const VideoProcessor = () => {
  const openPopup = () => {
    const popupWidth = 300;
    const popupHeight = 200;
    const left = window.innerWidth - popupWidth;
    const top = window.innerHeight - popupHeight;

    const options = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},`;

    window.open("/record", "popup", options);
  };
  const videoRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);
  const canvasStreamRef = useRef(null); // To store the canvas stream

  const backgrounds = ["/image/배경.jpg", "/image/bg.png", "/image/space.jpeg", "/image/trees.jpeg"];
  const [selectedBackground, setSelectedBackground] = React.useState(0);
  let mediaRecorder = null;
  let recordedMediaUrl = null;

  const record = () => {
    if (!canvasStreamRef.current) {
      // Create a stream from the canvas if it doesn't exist
      const canvasStream = c2Ref.current.captureStream(30); // Capture at 30fps
      canvasStreamRef.current = canvasStream;
    }

    let mediaData = [];

    try {
      // 1. Use the canvas stream to create MediaRecorder
      mediaRecorder = new MediaRecorder(canvasStreamRef.current, {
        mimeType: "video/webm",
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
        recordedMediaUrl = URL.createObjectURL(blob);
      };

      // 4. 녹화 시작
      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const endRecord = () => {
    if (mediaRecorder) {
      // 5. 녹화 중지
      mediaRecorder.stop();
      mediaRecorder = null;
    }
  };

  const download1 = () => {
    if (recordedMediaUrl) {
      const link = document.createElement("a");
      document.body.appendChild(link);
      // 녹화된 영상의 URL을 href 속성으로 설정
      link.href = recordedMediaUrl;
      // 저장할 파일명 설정
      link.download = "video.webm";
      link.click();
      document.body.removeChild(link);
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = localStorage.getItem("recordedVideo");
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  useEffect(() => {
    // Get user media (webcam stream)
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const c1 = c1Ref.current;
    const ctx1 = c1.getContext("2d");
    const c2 = c2Ref.current;
    const ctx2 = c2.getContext("2d");

    const timerCallback = () => {
      // 크로마 키 효과 적용 (새로운 방식)
      ctx1.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, c1.width, c1.height);
      const imageData = ctx1.getImageData(0, 0, c1.width, c1.height);
      const data = imageData.data;

      const chromaKeyColorGreen = [47, 178, 155]; // 크로마키 색상 (RGB 값 47, 178, 155로 조정완료. 이 값은 이용하는 크로마키 배경에 따라 변경해야함)
      const tolerance = 60; // 허용 오차 범위

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // 특정 범위 내의 색상(초록색)은 투명하게 처리합니다.
        if (
          Math.abs(red - chromaKeyColorGreen[0]) < tolerance &&
          Math.abs(green - chromaKeyColorGreen[1]) < tolerance &&
          Math.abs(blue - chromaKeyColorGreen[2]) < tolerance
        ) {
          data[i + 3] = 0; // 투명화 처리
        }
      }

      ctx2.putImageData(imageData, 0, 0);

      setTimeout(timerCallback, 33); // 33ms for ~30fps
    };
    video.addEventListener("play", () => {
      timerCallback();
    });

    // Clean up the event listener when component unmounts
    return () => {
      video.removeEventListener("play", () => {
        timerCallback();
      });
    };
  }, []);

  return (
    <>
      <StBody>
        <video
          width={"400px"}
          id="video"
          ref={videoRef}
          autoPlay
          controls
          crossOrigin="anonymous"
          style={{ display: "none" }}
        ></video>
        {/* <div>
        <button onClick={() => setSelectedBackground(0)}>분홍색</button>
        <button onClick={() => setSelectedBackground(1)}>바다</button>
        <button onClick={() => setSelectedBackground(2)}>우주</button>
        <button onClick={() => setSelectedBackground(3)}>나무</button>
      </div> */}
        <canvas id="c1" ref={c1Ref} width="400" height="300" style={{ display: "none" }}></canvas>
        <StContainer onDoubleClick={() => alert("e")}>
          {/* <StBgImg  /> */}
          <StCanvas
            id="c2"
            ref={c2Ref}
            width="400"
            height="300"
            style={{ backgroundImage: `url(${backgrounds[selectedBackground]})` }}
          ></StCanvas>
        </StContainer>

        <StScript.Bg>
          <StScript.Header>
            <StScript.HeaderText>스피치 주제</StScript.HeaderText>
          </StScript.Header>
          <StScript.ContentPlace>
            Chapter 1 Famine Long ago, a poor woodcutter lived by a forest with his new wife and two children. The boy
            was called Hansel and the girl was called Gretel. The family was always poor, but they had enough to eat.
            One year, a famine came to the land. The woodcutter did not have enough food to feed his children. He said
            to his wife, “What is to become of us? How are we to feed our poor children?” “Don’t worry, husband,”
            answered his wife. “Early tomorrow morning we will take Hansel and Gretel deep into the forest. We will
            light a fire for them. I will give each of them one piece of bread, and then we will leave. They will not
            find their way home again, and we shall be rid of them.” She said this because she was not their real
            mother. She was their stepmother and did not like the children. “No,” said the man. “I cannot do that!”
            “Fool!” said the woman.
          </StScript.ContentPlace>
          {/* script 내용이 얼마나 길어질지 알아야함. 학생이 서있는 곳과 스크린의 거리에 맞는 글씨 크기를 이용해야함.
          필요한 내용 1. 스크립트 길이
          2. 학생이 서있는 단상과 스크린의 거리 */}
          <StScript.RoundBtn onClick={openPopup}>pop up</StScript.RoundBtn>
          <button onClick={download}>화면기록 다운로드</button>
          {/* <button onClick={record}>녹화시작</button>
          <button onClick={endRecord}>녹화종료</button>
          <button onClick={download1}>동영상 다운로드</button> */}
        </StScript.Bg>

        {recordedMediaUrl && (
          <video controls>
            <source src={recordedMediaUrl} type="video/webm" />
          </video>
        )}
      </StBody>
    </>
  );
};

export default VideoProcessor;

const StBody = styled.div`
  display: flex;
  flex-direction: row;
`;
const StContainer = styled.div`
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;

const StCanvas = styled.canvas`
  position: absolute;
  z-index: 2;
  width: 50%;
  height: 100vh;
  object-fit: cover;
  background-size: cover;
`;
const StScript = {
  Bg: styled.div`
    background-color: #fffef2;
    width: 50%;
    height: 100vh;
    z-index: 3;
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
  `,
  Header: styled.div`
    height: 77px;
    background: #24a19c 0% 0%;
    display: flex;
    padding: 12px 0;
  `,
  HeaderText: styled.div`
    font-family: "NanumSquareNeo-Variable";
    letter-spacing: -0.52px;
    color: #ffffff;
    font-size: 26px;
    font-weight: 800;
    text-align: left;
    display: flex;
    align-items: center;

    padding-left: 60px;
  `,
  ContentPlace: styled.div`
    padding: 40px;
    height: 90%;
    width: auto;
    background: #ffffff 0% 0%;
    box-shadow: 0px 0px 30px #26c4b121;
    border-radius: 20px;
    z-index: 4;
    justify-content: center;
    margin: 59px 40px 71px 40px;
    align-items: center;
    font: normal normal normal 30px/53px NanumSquareOTF;
    color: #222222;
  `,
  RoundBtn: styled.div`
    background-color: #26c4b1;
    width: 70px;
    height: 70px;
    border-radius: 999px;
    color: #fff;
    cursor: pointer;
  `,
};
