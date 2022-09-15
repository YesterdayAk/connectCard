<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { Toast } from "vant";
import Vue from "vue";
export default Vue.extend({
  name: "App",
  data() {
    return {
    };
  },
  mounted() {
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
    }, {passive: false}) // passive 参数不能省略，用来兼容ios和android
    // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
    window.addEventListener(
      "hashchange",
      () => {
        let currentPath = window.location.hash.slice(1);
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath);
        }
      },
      false
    );
  },
  methods: {
  },
});
</script>
