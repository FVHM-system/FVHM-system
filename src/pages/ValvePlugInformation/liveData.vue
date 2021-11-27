<template>
  <div class="liveData">
    <div id="LData">
    <el-tabs class="tabStyle" tab-position="top">
      <el-tab-pane label="时间段用水量">
        <div class="CardWaterSum">
          <el-date-picker
              v-model="value1"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
          >
          </el-date-picker>
          <el-button type="primary" style="position:relative;left: 10px;margin-top: 15px">查询</el-button>
          <h1 style="position:relative;margin-top:50px;font-size: 20px;color: #409eff">
            <el-tag>{{new Date(value1[0]).toLocaleString()}}</el-tag>
            至
            <el-tag>{{new Date(value1[1]).toLocaleString()}}</el-tag></h1>
          <h1 style="position:relative;margin-top:20px;font-size: 20px;color: #409eff">阀栓用水量</h1>
          <h1 style="position:relative;margin-top:100px;font-size: 100px;color: #409eff">0</h1>
          <h1 style="position:relative;margin-top:50px;font-size: 30px;color: #409eff">万m³</h1>
        </div>
      </el-tab-pane>
      <el-tab-pane label="阀栓年已用水量">
        <div class="CardWaterSum">

        </div>
      </el-tab-pane>
      <el-tab-pane label="阀栓累计用水量">
        <div class="CardWaterSum">

        </div>
      </el-tab-pane>
      <el-tab-pane label="近三年用水趋势">
        <div class="CardWaterSum">

        </div>
      </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>

<script>
import VwaterConsum from "@/pages/ValvePlugInformation/VwaterConsum.vue";
import moment from "moment";

export default {
  data(){
    return{
      value1:''
    }
  }
}
</script>

<style scoped>
.liveData{
  background-color: #F8F8F8;
  position: relative;
  top: -15px;
  left: -15px;
  width: 51vw;
  height: 85vh;
}
.tabStyle{
  position: relative;
  top: 20px;
  height: 78vh;
  width: 85%;
  left: 5%;
}
.CardWaterSum{
  background-color: white;
  position: relative;
  margin-top: 40px;
  margin-left: 60px;
  width: 80%;
  height: 60vh;
  border-radius: 10px;
}
</style>