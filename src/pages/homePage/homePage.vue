<template>
  <div class="water">
    <el-row :gutter="100" style="margin-top: -25px">
      <el-col :span="4" 
      >
        <white-block style="width:200px;height:310px;">
          <wells-count></wells-count>
        </white-block
        >
      </el-col>
      <el-col :span="4" 
      >
        <white-block style="width:200px;height:310px;">
          <hydrant-count></hydrant-count>
        </white-block
        >
      </el-col>
      <el-col :span="14" style=" height:310px;"
      >
        <white-block>
          <water-consume></water-consume>
        </white-block
        >
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="8" style=" height: 385px;"
      >
        <white-block style="width:430px;">
          <use-rank></use-rank>
        </white-block
        >
      </el-col>
      <el-col :span="8" style=" height:385px;"
      >
        <white-block>
          <valve-distribution></valve-distribution>
        </white-block
        >
      </el-col>
      <el-col :span="8" style=" height:385px"
      >
        <white-block>
          <hydrant-distribution></hydrant-distribution>
        </white-block
        >
      </el-col>
    </el-row>
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

<style lang="scss" scoped>
.water {
  height: calc(100vh - 130px);
  width: 100%;
  padding-top: 10px;
}
</style>
//ces1