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
              <el-tag>{{ new Date(value1[1]).toLocaleString() }}</el-tag>
            </h1>
            <h1 style="position:relative;margin-top:20px;font-size: 20px;color: #409eff">阀栓用水量</h1>
            <h1 style="position:relative;margin-top:60px;font-size: 100px;color: #409eff">
              {{ waterData }}</h1>
            <h1 style="position:relative;margin-top:50px;font-size: 30px;color: #409eff">m³</h1>
          </div>
        </el-tab-pane>
        <el-tab-pane label="阀栓年已用水量">
          <div class="CardWaterSum">
            <h1 style="position:relative;top:130px;font-size: 30px;color: #409eff">阀栓今年已用水量</h1>
            <h1 style="position:relative;top:190px;font-size: 100px;color: #409eff">
              {{ waterDataYear }}</h1>
            <h1 style="position:relative;top:250px;font-size: 30px;color: #409eff">m³</h1>
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
            <h1 style="position:relative;top:220px;font-size: 30px;color: #409eff">m³</h1>
          </div>

        </el-tab-pane>
        <el-tab-pane label="近三年用水趋势" @click="waterTrandGet">
          <div class="CardWaterSum">
            <div class="waterTrend">
              <div class="waterTrend-top">
                <h1 style="position:relative;top:0px;font-size: 25px;color: #409eff">阀栓近三年用水趋势</h1>
              </div>
              <div style="margin-top: 20px" class="waterTrend-body" :id="newID"></div>
            </div>
          </div>
          <el-drawer size="50%" :after-close="handleClose" v-model="drawer" :with-header="false">
            <div class="drawerDetail">
              <el-tabs class="alarm2Detail" type="border-card">
                <el-tab-pane label="基本信息">
                  <basic-information :valve_id_end="valve_id"></basic-information>
                </el-tab-pane>
                <el-tab-pane label="实况数据">
                  <live-data :valve_id_end="valve_id" :valve_createTime_end="valve_createTime"></live-data>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-drawer>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import {
  fetFindVolumebyTime,
  fetFindvolumebyyear,
  fetFindvolumebyday,
  fetFindmonthvolumebyyear
} from "./util/vpinformation";
import {onMounted, onUnmounted, ref, defineProps, markRaw} from "vue";
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
const value1 = ref([
  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()),
  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()),
])
let waterData = ref(0)
let waterDataYear = ref(0)
let waterDataTotal = ref(0)
let myChart = null
let newID = new Date().getTime()
let year1 = (new Date().getFullYear()-2).toString()
let year2 = (new Date().getFullYear()-1).toString()
let year3 = new Date().getFullYear().toString()
let year1Data = []
let year2Data = []
let year3Data = []
let BarPic = function () {
  let chartDom = markRaw(document.getElementById(newID))
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
      top: 50,
      left: '3%',
      right: '10%',
      bottom: 60,
      containLabel: true,
    },
    xAxis: {
      name: "月份",
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '6月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      name:'用水量(m³)',
      type: 'value'
    },
    legend: {
      //data: [yValues[0].name, yValues[1].name, yValues[2].name],
      data: [year1,year2,year3],
    },
    series: [
      {
        name: year1,
        data: year1Data,
        type: 'line',
        color: 'blue'
      },
      {
        name: year2,
        data: year2Data,
        type: 'line',
        color: '#55e3a5'
      },
      {
        name: year3,
        data: year3Data,
        type: 'line',
        color: 'yellow'
      }
    ]
  };
  myChart.setOption(option)
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
  let res1 = await fetFindmonthvolumebyyear(props.valve_id_end, '2019')
  if (res1.code === '200') {
    year1Data = res1.data.map(item => item.volume)
  }
  let res2 = await fetFindmonthvolumebyyear(props.valve_id_end, '2020')
  if (res2.code === '200') {
    year2Data = res2.data.map(item => item.volume)
  }
  let res3 = await fetFindmonthvolumebyyear(props.valve_id_end, '2021')
  if (res3.code === '200') {
    year3Data = res3.data.map(item => item.volume)
  }
  BarPic()
}
onMounted(async () => {
  await getTimeWaterDataYear()
  await waterTrandGet()
})
onUnmounted(() => {
  if (myChart) {
    myChart = null
    console.log(myChart)
  }
  getTimeWaterData()
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
