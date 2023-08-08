// import "./App.css";
// import React from "react";
// import Router from "./shared/Router";

// function App() {
//   // const canvasRef = useRef(null);

//   // React.useEffect(() => {
//   //   // 리액트 컴포넌트가 마운트되면 canvas에 이미지를 합성합니다.
//   //   const canvas = canvasRef.current;
//   //   const context = canvas.getContext("2d");

//   //   // 크로마키 이미지 로드
//   //   const chromaKeyImage = new Image();
//   //   chromaKeyImage.src = "/image/크로마키.jpg";

//   //   // 배경 이미지 로드
//   //   const backgroundImage = new Image();
//   //   backgroundImage.src = "/image/배경.jpg";

//   //   // 이미지가 모두 로드된 후 합성 작업 수행
//   //   Promise.all([onLoad(chromaKeyImage), onLoad(backgroundImage)])
//   //     .then(() => {
//   //       // 크로마키 이미지를 canvas에 그립니다.
//   //       context.drawImage(chromaKeyImage, 0, 0, canvas.width, canvas.height);

//   //       // 이미지 데이터를 가져옵니다.
//   //       const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//   //       const data = imageData.data;

//   //       // 특정 색상(초록색)을 제거합니다.
//   // const chromaKeyColor = [27, 178, 10]; // 크로마키 색상 (RGB 값 27, 178, 10)
//   // const tolerance = 60; // 허용 오차 범위

//   // for (let i = 0; i < data.length; i += 4) {
//   //   const red = data[i];
//   //   const green = data[i + 1];
//   //   const blue = data[i + 2];

//   //   // 특정 범위 내의 색상(초록색)은 투명하게 처리합니다.
//   //   if (
//   //     Math.abs(red - chromaKeyColor[0]) < tolerance &&
//   //     Math.abs(green - chromaKeyColor[1]) < tolerance &&
//   //     Math.abs(blue - chromaKeyColor[2]) < tolerance
//   //   ) {
//   //     data[i + 3] = 0; // 투명화 처리
//   //   }
//   // }

//   //       // 변경된 이미지 데이터를 canvas에 다시 그립니다.
//   //       context.putImageData(imageData, 0, 0);

//   //       // 배경 이미지를 크로마키 이미지 위에 겹쳐서 그립니다.
//   //       context.globalCompositeOperation = "destination-over";
//   //       context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

//   //       // 그림 합성 모드를 원래대로 복원합니다.
//   //       context.globalCompositeOperation = "source-over";
//   //     })
//   //     .catch((error) => console.error("이미지 로드 에러:", error));
//   // }, []);

//   // const onLoad = (image) => {
//   //   return new Promise((resolve) => {
//   //     image.onload = () => resolve();
//   //   });
//   // };

//   return (
//     <div>
//       {/* <canvas ref={canvasRef} width={800} height={600} /> */}
//       <Router />
//     </div>
//   );
// }

// export default App;

import React from "react";
import Router from "./shared/Router";

function App() {
  return <Router />;
}

export default App;
