<template>
  <div class="header">
    <header>
      <img src='../assets/logo.png' alt='logo' />
      <p>水资源管理系统</p>
    </header>
    <el-button class="boxConfirm" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

export default {
  data () {
    return {

    };
  },

  methods: {

    logout () {
      alert('成功退出登录');
      this.$router.push('/');
      this.$store.dispatch('user/logout');
    }
  }
};

</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
header {
  margin: 0 10px;
  display: flex;
  height: 80px;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }
}
</style>