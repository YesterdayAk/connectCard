<template>
  <div class="videoBox">
    <div v-if="support">
      <!-- 开始录制 -->
        <canvas
        id="myCanvas"
        width="200"
        height="200"
        style="border: 1px solid; position: fixed; left: 100%"
      />
      <Open v-if="isOpen" :url="cardItem.cardUrl" @submit="submitReq"></Open>
      <TigerOpen
        v-if="isTigerOpen"
        :url="cardItem.cardUrl"
        @submit="submitReqTiger"
      ></TigerOpen>
      <div id="videos-container" ref="videos-container"></div>
      <div class="camera-top">
        <img src="@/assets/camera-top.png" alt />
      </div>
      <div class="camera-bottom">
        <img src="@/assets/camera-bottom.png" alt />
      </div>
    </div>
    <div v-else>
      <div class="kongzhuangtai-box flex justify-center">
        <van-empty description="该设备暂不支持开启摄像头">
          <van-button
            color="#326CF0"
            @click="cancel"
            round
            type="danger"
            class="bottom-button"
            >返回</van-button
          >
        </van-empty>
      </div>
    </div>
  </div>
</template>
<script>
import { Empty, Circle } from "vant";
import axios from "axios";
import { setTimeout } from "timers";
import Open from "@/components/Open/index.vue";
import TigerOpen from "@/components/TigerOpen/index.vue";
import { Toast } from "vant";
export default {
  components: {
    [Empty.name]: Empty,
    [Circle.name]: Circle,
    Open: Open, // 打开空白卡片
    TigerOpen: TigerOpen, // 打开虎卡卡片
  },
  data() {
    return {
      baseUrl: "", // 请求接口的baseUrl
      isOpen: false, // 打开空白卡片弹窗
      isTigerOpen: false, // 打开虎卡卡片弹窗
      cardItem: {}, // 卡片对象
      scanFocaFlag: true,
      value1Label: undefined,
      value1Probability: undefined,
      value2Label: undefined,
      value2Probability: undefined,
      model: undefined,
      webcam: undefined,
      labelContainer: undefined,
      maxPredictions: undefined,
      support: true,
      supportluzhi: false,
      mediaStream: undefined,
      recorderFile: undefined,
      stopRecordCallback: undefined,
      mediaRecorder: undefined,
      MediaUtils: {
        /**
         * 获取用户媒体设备(处理兼容的问题)
         * @param videoEnable {boolean} - 是否启用摄像头
         * @param audioEnable {boolean} - 是否启用麦克风
         * @param callback {Function} - 处理回调
         */
        getUserMedia: function (videoEnable, audioEnable, callback) {
          videoEnable.facingMode = { exact: "environment" };
          navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia ||
            navigator.oGetUserMedia ||
            window.getUserMedia;
          var constraints = { video: videoEnable, audio: audioEnable };
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
              .getUserMedia(constraints)
              .then(function (stream) {
                callback(false, stream);
              })
              ["catch"](function (err) {
                callback(err);
              });
          } else if (navigator.getUserMedia) {
            navigator.getUserMedia(
              constraints,
              function (stream) {
                callback(false, stream);
              },
              function (err) {
                callback(err);
              }
            );
          } else {
            callback(new Error("Not support userMedia"));
          }
        },

        /**
         * 关闭媒体流
         * @param stream {MediaStream} - 需要关闭的流
         */
        closeStream: function (stream) {
          if (typeof stream.stop === "function") {
            stream.stop();
          } else {
            let trackList = [stream.getAudioTracks(), stream.getVideoTracks()];

            for (let i = 0; i < trackList.length; i++) {
              let tracks = trackList[i];
              if (tracks && tracks.length > 0) {
                for (let j = 0; j < tracks.length; j++) {
                  let track = tracks[j];
                  if (typeof track.stop === "function") {
                    track.stop();
                  }
                }
              }
            }
          }
        },
      },
    };
  },
  mounted() {
    this.baseUrl = this.$store.getters.getBaseUrl;
    // 初始化默认调用摄像头
    this.openCamera();
  },
  methods: {
    openCamera() {
      let _this = this;
      this.MediaUtils.getUserMedia(
        { width: 640, heigeht: 480 },
        true,
        function (err, stream) {
          if (err) {
            // debugger;
            _this.support = false;
            // throw err;
          } else {
            _this.supportluzhi = true;
            // let videosContainer = document.getElementById('videos-container');
            let videosContainer = _this.$refs["videos-container"];
            var len = videosContainer.childNodes.length;
            for (var i = 0; i < len; i++) {
              videosContainer.removeChild(videosContainer.childNodes[i]);
            }
            var video = document.createElement("video");
            video.setAttribute("playsinline", "true");
            video.setAttribute("webkit-playsinline", "true");
            video.id = "videoId";
            video.classList.add("videoluxiang");
            video.controls = false;
            video.muted = true;
            // 通过 MediaRecorder 记录获取到的媒体流
            _this.mediaRecorder = new MediaRecorder(stream);
            _this.mediaStream = stream;
            let chunks = [];
            video.srcObject = stream;
            video.play();

            videosContainer.appendChild(video);
            _this.mediaRecorder.ondataavailable = function (e) {
              _this.mediaRecorder.blobs.push(e.data);
              chunks.push(e.data);
            };
            _this.mediaRecorder.blobs = [];

            _this.mediaRecorder.onstop = function () {
              _this.recorderFile = new Blob(chunks, {
                type: _this.mediaRecorder.mimeType,
              });
              chunks = [];
              if (undefined != _this.stopRecordCallback) {
                _this.stopRecordCallback();
              }
            };
          }
          _this.startRecord();
          _this.init();
        }
      );
    },
    startScanFoca() {
      this.scanFocaFlag = true;
      this.predict();
    },
    stopScanFoca() {
      this.scanFocaFlag = false;
    },
    stopRecord() {
      this.stopRecordCallback = function () {
        // this.$toast.success("录制成功")
      };
      // 终止录制器
      this.mediaRecorder.stop();

      // 关闭媒体流
      // this.MediaUtils.closeStream(this.mediaStream);
    },
    startRecord() {
      // 开始录制
      this.mediaRecorder.start();
    },
    cancel() {
      // 取消拍摄
      if (this.support) {
        this.MediaUtils.closeStream(this.mediaStream);
      }
      setTimeout(() => {
        this.$emit("cancel");
      }, 50);
      wx.miniProgram.navigateBack({
        delta: 1,
      });
    },
    async init() {
      // var modelURL =   "https://binzhouscanblessing.qdszgh.cn/model.json";
      //   var metadataURL =  "https://binzhouscanblessing.qdszgh.cn/metadata.json";
      var modelURL = this.$store.getters.getModelURL
        ? this.$store.getters.getModelURL
        : "https://zxsbzzqjk.qdszgh.cn/model.json";
      var metadataURL = this.$store.getters.getMetadataURL
        ? this.$store.getters.getMetadataURL
        : "https://zxsbzzqjk.qdszgh.cn/metadata.json";

      // var modelURL = this.$store.getters.getModelURL ? this.$store.getters.getModelURL : "http://localhost:8081/model.json";
      // var metadataURL = this.$store.getters.getMetadataURL ? this.$store.getters.getMetadataURL : "http://localhost:8081/metadata.json";
      // // load the model and metadata
      // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
      // or files from your local hard drive
      // Note: the pose library adds "tmImage" object to your window (window.tmImage)
      this.model = await tmImage.load(modelURL, metadataURL);
      this.maxPredictions = this.model.getTotalClasses();
      // Convenience function to setup a webcam
      // const flip = true; // whether to flip the webcam
      // this.webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
      // await this.webcam.setup(); // request access to the webcam
      // await this.webcam.play();
      // append elements to the DOM
      // document.getElementById("webcam-container").appendChild(this.webcam.canvas);
      // this.labelContainer = document.getElementById("label-container");
      // for (let i = 0; i < this.maxPredictions; i++) { // and class labels
      //     this.labelContainer.appendChild(document.createElement("div"));
      // }
      let _that = this;
      setTimeout(function () {
        _that.predict();
      }, 1000);
    },
    async predict() {
      if (this.scanFocaFlag) {
        var video = document.getElementById("videoId");
        var canvas = document.getElementById("myCanvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        // predict can take in an image, video or canvas html element
        const prediction = await this.model.predict(canvas);
        for (let i = 0; i < this.maxPredictions; i++) {
          if (i == 0) {
            this.value1Label = prediction[i].className;
            this.value1Probability = prediction[i].probability.toFixed(2);
            if (this.value1Probability == 1) {
              //停止扫描
              //TODO 请求后台接口抽取福卡
              this.stopScanFoca();
              let _that = this;
              setTimeout(function () {
                navigator.vibrate =
                  navigator.vibrate ||
                  navigator.webkitVibrate ||
                  navigator.mozVibrate ||
                  navigator.msVibrate;
                if (navigator.vibrate) {
                  console.log("支持设备震动！");
                  // 振动0.3秒
                  navigator.vibrate(300);
                } else {
                  console.log("不支持设备震动！");
                }
                _that.getCard();
              }, 1000);
            } else {
              console.log(22222);
            }
          } else {
            this.value2Label = prediction[i].className;
            this.value2Probability = prediction[i].probability.toFixed(2);
          }
          // const classPrediction =
          // prediction[i].className + ": " + prediction[i].probability.toFixed(2);
          // this.labelContainer.childNodes[i].innerHTML = classPrediction;
          // console.log("打印:"+prediction[i].className +prediction[i].probability.toFixed(2))
        }
        await this.predict();
      }
    },
    // 获取虎卡
    getCard() {
      // this.$store.commit("setMyToken", "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjczYzMwYmUzLWU5NjktNDZlZS1hMWRmLTAzMzVlMTI4MmI5NCJ9.JXlPsfMLquU1Hdz_cUDbuIqOpO5iGYfDyNPcI7SPgkl3imrGFvVajXggKCexv1p_jYvbuJnA1hgEg6-xTSZsGw");
      this.$get(this.baseUrl + "/api/foca/puffFoca?type=1")
        .then((res) => {
          // console.log(res)
          if (res.code == 200) {
            this.cardItem = res.data;
            if (this.cardItem.tigerCardId) {
              this.cardItem.cardUrl = this.cardItem.tigerCardImg;
              this.isTigerOpen = true;
            } else {
              this.cardItem.cardUrl = this.cardItem.platformIntroduce;
              this.isOpen = true;
            }
          } else {
            Toast(res.msg);
            let _that = this;
            setTimeout(function () {
              _that.startScanFoca();
            }, 1500);
          }
        })
        .catch(() => {
          Toast.fail("获取失败");
          let _that = this;
          setTimeout(function () {
            _that.startScanFoca();
          }, 1500);
        });
    },
    // 隐藏打开空白卡片弹窗
    submitReq(operation) {
      this.isOpen = false;
      this.startScanFoca();
    },
    // 隐藏打开虎卡卡片弹窗
    submitReqTiger(operation) {
      this.isTigerOpen = false;
      this.startScanFoca();
    },
  },
};
</script>

<style lang="scss" scoped>
.videoBox {
  width: 100%;
  height: 100vh;
  background: rgba($color: #000000, $alpha: 0.8);
}
.camera-top {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 111;
  width: 100%;
  img {
    width: 100%;
  }
}
.camera-bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 111;
  width: 100%;
  img {
    width: 100%;
  }
}
</style>
<style>
#videos-container,
.videos-box {
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
.videoluxiang {
  /* width: 100%; */
  width: auto;
  height: 100%;
}
.luzhicaozuo {
  position: fixed;
  width: 100%;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
}
.startLuzhi {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 8px solid #fff;
  color: red;
  font-weight: bold;
  text-align: center;
  line-height: 80px;
  font-size: 26px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.startLuzhi div {
  width: 90px;
  height: 90px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  transition: all 0.2s;
  font-size: 26px;
}
.startLuzhi div.active {
  width: 60px;
  height: 60px;
  border-radius: 6px;
}
.luzhiBottom {
  height: 80px;
  width: 100%;
  background-color: #000;
  color: #fff;
  position: fixed;
  top: 0;
  z-index: 2;
}
.luzhiBottom span {
  margin: 0 20px;
}
.luzhicaozuo-cacel {
  color: #fff;
  font-size: 30px;
  position: absolute;
  top: 25px;
  left: 100px;
}
.chongpai {
  color: #fff;
  margin: 25px 100px 0;
  font-size: 30px;
}
.huashu {
  position: fixed;
  top: 80px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px 20px;
  /* color: #ff4343; */
  color: hsl(0, 0%, 100%);
  font-size: 26px;
  z-index: 111;
}
.huashu div {
  color: red;
  margin-top: 10px;
  font-size: 30px;
}
.kongzhuangtai-box {
  background-color: #fff;
  width: 100%;
  height: 100vh;
}
.kongzhuangtai-fanhui {
  font-size: 30px;
}
.luzhi-tips {
  position: fixed;
  bottom: 220px;
  left: 10px;
  z-index: 111111;
  color: #eee;
  font-size: 26px;
  font-weight: normal;
}
.videos-box .preview {
  position: absolute;
  z-index: 2;
  width: 100%;
}
.videos-box .preview .videoicon {
  position: absolute;
  width: 100px;
  top: 50%;
  margin-top: -50px;
  left: 50%;
  margin-left: -50px;
}
.videos-box .preview .videopre {
  width: 100%;
}
</style>
