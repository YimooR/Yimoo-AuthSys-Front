<template>
  <div class="dashboard-container">
    <div class="dashboard-text">当前用户名: {{ name }}</div>
    <h1>本项目仅学习使用！</h1>
    <img src="https://yimoorua-img.oss-cn-chengdu.aliyuncs.com/md-imgs/通用权限系统.png" style="width:900px;height:700px"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
