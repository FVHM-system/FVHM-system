<template>
  <div class="header">
    <header>
      <img src='../assets/logo.png' alt='logo'/>
      <h1>界首市阀栓管理系统</h1>
    </header>
    <div class="operation">
    <p class="name"><i class="margin-right el-icon-user-solid"></i>{{ name }}</p>
    <el-divider direction="vertical"></el-divider>
    <el-button class="boxConfirm" type="text" style="color: darkgoldenrod;font-weight: 600" @click="logout">登出</el-button>
    </div>
  </div>
</template>

<script>
import {computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useStore} from 'vuex'
import {store} from "../stores";
import {ElMessage} from "element-plus";
const router = useRouter();
export default {
  data() {
    let name = computed(() => store.getters['user/username'])
    return {
      name
    };
  },

  methods: {

    logout() {
      ElMessage({
        type: 'success',
        message: '成功退出登录！',
      })
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
.operation {
  background: white;
  border: 0.5px solid rgb(222, 222, 222);
  display: flex;
  justify-content: right;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 20px;

  .logout {
    margin: 0;
  }

  .name {
    .margin-right {
      margin-right: 6px;
    }

    margin: 0;
  }
}
</style>
