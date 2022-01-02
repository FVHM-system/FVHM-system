<template>
  <div class="water">
    <div style="display: flex;flex-direction: row;align-items: center">
        <white-block style="width:305px;height:280px;">
          <wells-count></wells-count>
        </white-block
        >
        <white-block style="margin-left:10px;width:306px;height:280px;">
          <hydrant-count></hydrant-count>
        </white-block
        >
        <white-block style="margin-left:10px;height:280px;">
          <water-consume></water-consume>
        </white-block
        >
    </div>
    <div style="display: flex;flex-direction: row;align-items: center">
        <white-block style="width:740px;height: 370px">
          <use-rank></use-rank>
        </white-block
        >
        <white-block style="margin-left:10px;width:700px;height: 370px">
          <valve-distribution></valve-distribution>
        </white-block
        >
        <white-block style="margin-left:10px;width:700px;height: 370px">
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
import { onMounted } from 'vue'
import { fetchVpinformation} from '../valveInformation/util/vpinformation'

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
  width: 97%;
  overflow-y: hidden;
}
</style>
