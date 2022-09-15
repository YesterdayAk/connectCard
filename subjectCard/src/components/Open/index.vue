<!-- 打开空白卡片 -->
<template>
  <div class="open-box">
    <van-overlay :show="show" @click="closeClick(false)">
      <div class="big-open-box">
        <img class="big-open-box-img" @click.stop :src="url" alt />
        <div class="big-open-box-btn">再扫一次</div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: "Open",
  props: {
    // 卡片url
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: true, // 因为是组件引入，所以在组件存在时要一直显示
    };
  },
  methods: {
    // 点击遮罩层关闭错误提示页
    closeClick(operation) {
      this.$emit("submit", operation);
    },
  },
};
</script>

<style lang="scss" scoped>
.open-box {
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 1001;
  .van-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .big-open-box {
    width: 77.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .big-open-box-img {
      width: 100%;
    }
    .big-open-box-img {
      -webkit-animation:share_icon 1s linear;
    }
    @-webkit-keyframes share_icon {
      0% {-webkit-transform: scale(0.5); opacity:0}
      100% {-webkit-transform: scale(1); opacity:1}
    }
    .big-open-box-btn {
      margin-top: 32px;
      width: 161px;
      height: 45px;
      background: url("../../assets/open.png") no-repeat center;
      background-size: 100% 100%;
      text-align: center;
      line-height: 42px;
      font-size: 16px;
      color: #a60000;
      font-weight: bold;
    }
    .big-open-box-btn:active {
      opacity: 0.8;
    }
  }
}
</style>