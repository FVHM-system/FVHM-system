<template>
  <div class="water" :style="'height:'+ wholeHeight + 'px;'">
    <div style="margin-top:20px;height:47%;display: flex;flex-direction: row;align-items: center">
        <white-block style="margin-left:20px;margin-top:10px;width:20%;">
          <wells-count></wells-count>
        </white-block
        >
        <white-block style="margin-left:20px;margin-top:10px;width:20%;">
          <hydrant-count></hydrant-count>
        </white-block
        >
        <white-block style="margin-left:20px;margin-top:10px;;margin-right:20px;">
          <water-consume></water-consume>
        </white-block
        >
    </div>
    <div style="margin-top:20px;height:47%;display: flex;flex-direction: row;align-items: center">
        <white-block style="margin-left:20px;margin-top:10px;width:24%;">
          <use-rank></use-rank>
        </white-block>
        <white-block  style="margin-left:20px;margin-top:10px;width:38%;">
          <valve-distribution></valve-distribution>
        </white-block>
        <white-block style="margin-left:20px;margin-top:10px;width:38%;margin-right: 20px">
          <hydrant-distribution></hydrant-distribution>
        </white-block
        >
      </div>
  </div>
</template>

<script setup>
import wellsCount from '../../components/wellsCount.vue'
import hydrantCount from '../../components/hydrantCount.vue'
import waterConsume from '../../components/waterConsume.vue'
import useRank from '../../components/useRank.vue'
import valveDistribution from '../../components/waterBarPic.vue'//阀门分布
import hydrantDistribution from '../../components/waterLinePic.vue'//消防栓分布
import whiteBlock from '../../components/whiteBlock.vue'
import {getCurrentInstance, markRaw, onMounted} from 'vue'
import { fetchVpinformation} from '../valveInformation/util/vpinformation'
let wholeHeight = window.innerHeight - 100
console.log(wholeHeight)
async function getValveInfo(){
  let res2 = await fetchVpinformation()
  console.log('ssss',res2)
}
onMounted(async () =>{
  await getValveInfo()
})
</script>

<style>
.water {
  position: relative;
  /*margin: 0;*/
  /*background-color: black;*/
  /*padding: 34px;*/
}
</style>
