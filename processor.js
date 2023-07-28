const processor = {};

processor.doLoad = function doLoad() {
  const video = document.getElementById("video");
  this.video = video;

  this.c1 = document.getElementById("c1");
  this.ctx1 = this.c1.getContext("2d");

  this.c2 = document.getElementById("c2");
  this.ctx2 = this.c2.getContext("2d");

  video.addEventListener(
    "play",
    () => {
      this.width = video.videoWidth / 2;
      this.height = video.videoHeight / 2;
      this.timerCallback();
    },
    false
  );
};
