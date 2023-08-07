import React, { useState, useRef } from "react";

function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const recordedChunks = mediaStreamRef.current.recordedChunks || [];
          recordedChunks.push(event.data);
          mediaStreamRef.current.recordedChunks = recordedChunks;
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(mediaStreamRef.current.recordedChunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(recordedBlob);
        setVideoUrl(videoUrl);
      };

      mediaStreamRef.current = {
        stream: mediaStream,
        recordedChunks: [],
      };

      mediaRecorderRef.current = mediaRecorder;

      setRecording(true);
      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaStreamRef.current.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
    }
  };

  const downloadVideo = () => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = videoUrl;
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      {videoUrl && (
        <div>
          <video
            ref={videoRef}
            controls
            src={videoUrl}
            style={{ display: "block", marginTop: "10px" }}
            width="400"
            height="300"
          />
          <button onClick={downloadVideo}>Download Video</button>
        </div>
      )}
    </div>
  );
}

export default ScreenRecorder;
