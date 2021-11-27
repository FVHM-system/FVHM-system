<template>
  <div>
    <div v-if="!user" class="startPage">
      <section>
        <div id="logo">
          <div class="logo-box">
            <img src="/src/assets/jieshou.png" />
            <span>界首市城市供水网阀栓管理系统</span>
          </div>
        </div>
        <h1 align="center" class="illustrate"> 界首市城市供水网阀栓管理系统 </h1>
        <login style="position:relative;top:230px"></login>
      </section>
    </div>

    <div v-if="user">
      <title>界首市阀栓管理系统</title>
      <el-container class="whole-container">
        <el-header height="80px">
          <layer-header></layer-header>
        </el-header>

        <el-container class="center-container">
          <el-aside width="200px">
            <layer-aside></layer-aside>
          </el-aside>

          <el-container>
            <div class="scroll-out">
              <el-scrollbar>
                <el-main>
                  <router-view></router-view>
                </el-main>
              </el-scrollbar>
            </div>
          </el-container>

        </el-container>

      </el-container>
    </div>
  </div>
</template>

<script setup>
import LayerHeader from '@/layers/header.vue';
import LayerAside from '@/layers/aside.vue';
import MapContent from '@/pages/Map/mapcontent.vue'
import MapDetail from '@/pages/Map/mapdetail.vue'
import MapLoader from '@/pages/Map/localMap.js'
import login from '@/pages/login/login.vue'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.state.user.user)
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  position: relative;
  box-sizing: border-box;
  overflow-y: hidden;
}
.startPage{
  background: url('src/assets/header-bg.webp') center;
  background-size: cover;

  position:relative;
  overflow-y:hidden;
  height:100vh;
}
.logo-box {
  position: relative;
  top: 10px;
  left: 20px;
  height: 30px;
  width: 230px;
  background: white;
  display: flex;
  align-items: center;
  padding: 6px 14px 6px 10px;
  border-radius: 20px;
  img {
    width: 28px;
    height: 28px;
  }
  span {
    margin-left: 6px;
  }
  font-size: 14px;
}
.illustrate{
  position: relative;
  top: 120px;
  font-size: 50px;
  color: white;
}
</style>