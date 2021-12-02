<template>
  <el-cascader
      v-model="place"
      :options="options"
      :props="myprops"
      ref="require"
      placeholder="选择行政区域"
      collapse-tags="true"
      size="medium"
      clearable/>
</template>

<script setup>
import {multiply} from 'lodash'
import {getCurrentInstance, onMounted, ref} from 'vue'
import {
  fetchSuper,
} from '../../apis/2.0/addr'

let options = ref([])
let require = ref(null)
let myprops = ref()
let place = ref()
const {proxy} = getCurrentInstance()
emits: ['handleItemChange']

myprops = {
  label: 'name',
  value: 'message',
  children: 'child',
}

onMounted(async () => {
  const temp = await fetchSuper()
  console.log("啊啊啊啊", temp)
  options.value = temp
})
</script>

<style lang="scss" scoped>
.op-flex {
  display: flex;
  position: relative;
  top: 4px;
  right: -130px;
  width: 150px;
}

.search-btn {
  display: flex;
}
</style>