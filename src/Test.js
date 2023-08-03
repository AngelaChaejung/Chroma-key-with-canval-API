import React, { useEffect, useRef } from "react";
import "./App.css"; // You can create a separate CSS file for styling or include styles directly in the component using styled-components, etc.
import { styled } from "styled-components";

const VideoProcessor = () => {
  const videoRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);

  const backgrounds = ["/image/배경.jpg", "/image/bg.png", "/image/space.jpeg", "/image/trees.jpeg"];
  const [selectedBackground, setSelectedBackground] = React.useState(0);
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

      const chromaKeyColor = [47, 178, 155]; // 크로마키 색상 (RGB 값 47, 178, 155로 조정완료. 이 값은 이용하는 크로마키 배경에 따라 변경해야함)
      const tolerance = 40; // 허용 오차 범위

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // 특정 범위 내의 색상(초록색)은 투명하게 처리합니다.
        if (
          Math.abs(red - chromaKeyColor[0]) < tolerance &&
          Math.abs(green - chromaKeyColor[1]) < tolerance &&
          Math.abs(blue - chromaKeyColor[2]) < tolerance
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
      <video width={"400px"} id="video" ref={videoRef} autoPlay controls crossOrigin="anonymous"></video>
      <button onClick={() => setSelectedBackground(0)}>분홍색</button>
      <button onClick={() => setSelectedBackground(1)}>바다</button>
      <button onClick={() => setSelectedBackground(2)}>우주</button>
      <button onClick={() => setSelectedBackground(3)}>나무</button>

      {/* <img src="/image/배경.jpg" alt=""></img> */}
      <>
        <canvas id="c1" ref={c1Ref} width="400" height="300" style={{ display: "none" }}></canvas>
        <StContainer>
          <StBgImg style={{ backgroundImage: `url(${backgrounds[selectedBackground]})` }} />
          <StCanvas id="c2" ref={c2Ref} width="400" height="300"></StCanvas>
        </StContainer>
      </>
    </>
  );
};

export default VideoProcessor;

const StBgImg = styled.div`
  position: absolute;
  width: 400px;
  height: 300px;
  background-size: cover;
  z-index: 1;
`;
const StContainer = styled.div`
  width: 400px;
  height: 300px;
`;
const StCanvas = styled.canvas`
  position: absolute;
  z-index: 2;
  width: 400px;
  height: 300px;
`;
