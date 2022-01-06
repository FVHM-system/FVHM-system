<template>
  <div class="layout-scrollbar">
  <el-scrollbar>
  <el-menu :default-active="route.path" :default-openeds="menuExpandedConfigs" router :collapse="isCollapse">
    <template v-for="config in mergedMenuConfigs">
      <el-submenu v-if="config.children && config.children.length > 0" :index="config.name" :key="config.name">
        <template #title>
          <i v-if="config.icon" :class="config.icon"></i>
          <span>{{ config.label }}</span>
        </template>
        <el-menu-item v-for="con in config.children" :index="con.index" :key="con.name">{{ con.label }}</el-menu-item>
      </el-submenu>

      <el-menu-item  v-else :index="config.index" :key="config.name">
        <i v-if="config.icon" :class="config.icon"></i>
        <template #title>{{ config.label }}</template>
      </el-menu-item>
    </template>
  </el-menu>
  </el-scrollbar>
  </div>
</template>

<script setup>
import { menuConfigs } from '@/router'
import { menuExpandedConfigs } from '@/router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()

const isCollapse = computed(() => store.state.utils.menuCollapse)

const genMenuList = configs => {
  const res = []
  configs.forEach(item => {
    res.push(item)
    if (item.children) {
      item.children.forEach(it => {
        res.push(it)
      })
    }
  })
  return res
}

const mergedMenuConfigs = computed(() => {
  let res = []
  const menus = store.getters['user/menus']
  const menuList = genMenuList(menuConfigs)
  const findAndMixed = config => {
    const r = menuList.find(item => item.index === config.path)
    if (!r) {
      return
    }
    const { children: a, ...menu } = r
    const { children: b, ...web } = config
    return {
      ...menu,
      ...web,
    }
  }
  menus.forEach(item => {
    const mixed = findAndMixed(item)
    if (mixed) {
      item.children &&
      item.children.forEach(it => {
        const mixedChild = findAndMixed(it)
        if (mixedChild) {
          mixed.children = (mixed.children || []).concat(mixedChild)
        }
      })
      res.push(mixed)
    }
  })
  res = [...res, ...menuList.filter(item => item.force === true)]
  return res
})

const route = useRoute()
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none;
  color: rgb(76, 149, 245);
  overflow-y: hidden;
}
.layout-scrollbar{
  height: calc(100vh - 80px);
  border-right: 1px solid #F4F4F4;
}
.el-menu-item {
  font-size: 16px;
}
.el-submenu .el-submenu__title span {
  font-size: 16px;
}
</style>
