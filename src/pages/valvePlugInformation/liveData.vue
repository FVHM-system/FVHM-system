<template>
  <div class="liveData">
    <div id="LData">
      <el-tabs class="tabStyle" tab-position="top">
        <el-tab-pane label="时间段用水量">
          <div class="CardWaterSum">
            <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                :locale="locale"
            >
            </el-date-picker>
            <el-button type="primary" style="position:relative;left: 10px;margin-top: 15px"
                       @click="getTimeWaterData">查询
            </el-button>
            <h1 style="position:relative;margin-top:50px;font-size: 20px;color: #409eff">
              <el-tag>{{ new Date(value1[0]).toLocaleString() }}</el-tag>
              至
              <el-tag>{{ value1[1] }}</el-tag>
            </h1>
            <h1 style="position:relative;margin-top:20px;font-size: 20px;color: #409eff">阀栓用水量</h1>
            <h1 style="position:relative;margin-top:60px;font-size: 100px;color: #409eff">
              {{ waterData }}</h1>
            <h1 style="position:relative;margin-top:50px;font-size: 30px;color: #409eff">万m³</h1>
          </div>
        </el-tab-pane>
        <el-tab-pane label="阀栓年已用水量">
          <div class="CardWaterSum">
            <h1 style="position:relative;top:130px;font-size: 30px;color: #409eff">阀栓今年已用水量</h1>
            <h1 style="position:relative;top:190px;font-size: 100px;color: #409eff">
              {{ waterDataYear }}</h1>
            <h1 style="position:relative;top:250px;font-size: 30px;color: #409eff">万m³</h1>
          </div>
        </el-tab-pane>
        <el-tab-pane label="阀栓累计用水量">
          <div class="CardWaterSum">
            <el-select
                v-model="searchTimeType"
                placeholder="选择时间段"
                @change="handleChange"
                class="margin-right"
                style="width: 70px"
            >
              <el-option v-for="(item, index) in timeTypes" :key="index" :value="item.value">
                {{ item.lable }}
              </el-option>
            </el-select>
            <el-date-picker
                v-model="searchTime"
                type="date"
                placeholder="选择某天"
                style="width: 200px;margin-left: 10px"
                v-if="timeActive === '日'"
            ></el-date-picker>
            <el-date-picker
                v-model="searchTime"
                type="month"
                style="width: 200px;margin-left: 10px"
                v-if="timeActive === '月'"
            ></el-date-picker>
            <el-date-picker
                v-model="searchTime"
                type="year"
                placeholder="选择某年"
                style="width: 200px;margin-left: 10px"
                v-if="timeActive === '年'"
            ></el-date-picker>
            <el-button type="primary" style="margin-left: 10px;margin-top: 20px"
                       @click="getWaterTotal">查询
            </el-button>
            <h1 style="position:relative;top:70px;font-size: 30px;color: #409eff">阀栓累计用水量</h1>
            <h1 style="position:relative;top:160px;font-size: 100px;color: #409eff">
              {{ waterDataTotal }}</h1>
            <h1 style="position:relative;top:220px;font-size: 30px;color: #409eff">万m³</h1>
          </div>

        </el-tab-pane>
        <el-tab-pane label="近三年用水趋势" @click="waterTrandGet">
          <div class="CardWaterSum">
            <div class="waterTrend">
              <div class="waterTrend-top">
                <h1 style="position:relative;top:0px;font-size: 25px;color: #409eff">阀栓近三年用水趋势</h1>
                <el-date-picker
                    v-model="value3" type="year"
                    placeholder="Pick a year"
                    style="top: -10px;left:-30px"
                    @change="waterTrandGet"
                    :disabled-date="disableDate">
                </el-date-picker>
              </div>
              <div class="waterTrend-body" id="water-line"></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import VwaterConsum from "@/pages/ValvePlugInformation/valveWaterConsum.vue";
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import moment from "moment";
import * as echarts from 'echarts'
import {
  fetFindVolumebyTime,
  fetFindvolumebyyear,
  fetFindvolumebyday,
  fetFindmonthvolumebyyear
} from "./util/vpinformation";
import {onMounted, onUnmounted, ref, defineProps} from "vue";
import {dateTimeTrans} from "../../utils/mrWang";

const timeTypes = [
  {
    value: '日',
    lable: '日',
  },
  {
    value: '月',
    lable: '月',
  },
  {
    value: '年',
    lable: '年',
  },
]
let searchTimeType = ref('日')
let searchTime = ref(new Date())
let timeActive = ref('日')
let typeSelect = ref("")
let value = ref("")
let value1 = ref([0, new Date().toLocaleString()])
let waterData = ref(0)
let waterDataYear = ref(0)
let waterDataTotal = ref(0)
let value3 = ref(new Date())
let waterYearData = ref([])
let myChart
let BarPic = function (test) {
  let chartDom = document.getElementById('water-line')
  myChart = echarts.init(chartDom)
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '11%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '6月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: test,
        type: 'line'
      }
    ]
  };
  myChart.setOption(option)
}
const disableDate = d => {
  return d.getFullYear() < new Date().getFullYear() - 2 || d.getFullYear()
      > new Date().getFullYear()
}
const getTimeWaterData = async function () {
  let res = await fetFindVolumebyTime(props.valve_id_end,
      new Date(value1.value[0]).toLocaleDateString(),
      new Date(value1.value[1]).toLocaleDateString())
  if (res.code === '200') {
    waterData.value = res.data
  }
  console.log(props.valve_createTime_end)
}
const getTimeWaterDataYear = async function () {
  let res = await fetFindvolumebyyear(props.valve_id_end)
  if (res.code === '200') {
    waterDataYear.value = res.data
  }
  console.log(waterDataYear.value)
}
const props = defineProps({
  valve_id_end: Number,
  valve_createTime_end: Date,
})

function handleChange() {
  timeActive.value = searchTimeType.value
}

const getWaterTotal = async function () {
  let time = dateTimeTrans(searchTime.value, searchTimeType.value)
  let type = ref('')
  if (searchTimeType.value === '日') {
    type = 'day'
  }
  if (searchTimeType.value === '月') {
    type = 'month'
  }
  if (searchTimeType.value === '年') {
    type = 'year'
  }
  let res = await fetFindvolumebyday(props.valve_id_end, type, time)
  if (res.code === '200') {
    waterDataTotal.value = res.data
  }
  console.log(props.valve_id_end, type, time)
  console.log(res.data)
}
const waterTrandGet = async function () {
  let time = new Date(value3.value).getFullYear()
  let res = await fetFindmonthvolumebyyear(props.valve_id_end, time)
  if (res.code === '200') {
    waterYearData = res.data.map(item => item.volume)
  }
  BarPic(waterYearData)
  console.log(props.valve_id_end)
  console.log(waterYearData)
  console.log(props.valve_id_end)
  console.log(time)
  BarPic(waterYearData)

}
onMounted(async () => {
  await getTimeWaterDataYear()
  await waterTrandGet()
})
onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
  }
})
onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
  }
})
</script>

<style lang="scss" scoped>
.liveData {
  background-color: #F8F8F8;
  position: relative;
  top: -15px;
  left: -15px;
  width: 51vw;
  height: 85vh;
}

.tabStyle {
  position: relative;
  top: 20px;
  height: 78vh;
  width: 85%;
  left: 5%;
}

.CardWaterSum {
  background-color: white;
  position: relative;
  margin-top: 40px;
  margin-left: 60px;
  width: 80%;
  height: 60vh;
  border-radius: 10px;
}

.waterTrend {
  position: relative;
  top: 30px;
  left: 16px;
  padding: 10px;
  display: flex;
  flex-direction: column;

  &-top {
    display: flex;
    justify-content: space-between;

    &-title {
      font-weight: 700;
      font-size: 22px;
    }
  }

  &-body {
    position: relative;
    flex-grow: 1;
    height: 360px;
    width: 34vw;
  }
}
</style>