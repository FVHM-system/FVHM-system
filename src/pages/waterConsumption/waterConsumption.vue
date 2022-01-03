<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page2-name">用水统计</p>
      <div class="op-flex" style="position:absolute;right:40px;top:50px">
        <el-select
            v-model="searchTimeType"
            placeholder="选择时间段"
            @change="handleChange"
            class="margin-right"
            style="right:10px;width: 80px"
        >
          <el-option v-for="(item, index) in timeTypes" :key="index" :value="item.value">
            {{ item.lable }}
          </el-option>
        </el-select>
        <div>
          <el-date-picker
              v-model="searchTime"
              type="day"
              placeholder="选择某日"
              class="search"
              style="min-width: 200px"
              v-if="timeActive === '日报'"
          ></el-date-picker>
          <el-date-picker
              v-model="searchTime"
              type="month"
              placeholder="选择某月"
              class="search"
              style="min-width: 200px"
              v-if="timeActive === '月报'"
          ></el-date-picker>
          <el-date-picker
              v-model="searchTime"
              type="year"
              placeholder="选择某年"
              class="search"
              style="min-width: 200px"
              v-if="timeActive === '年报'"
          ></el-date-picker>
        </div>
        <div>
          <el-button type="primary" class="search" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="e-chart-C" id="water-bar" >
      <!-- <div class="p-body" style="height:520px" id="water-bar">
      </div> -->
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, onUnmounted} from 'vue'
import * as echarts from 'echarts'
import {fetchConsume} from '../../apis/2.0/home'
import whiteBlock from '../../components/whiteBlock.vue'
import {dateTimeTrans} from '../../utils/mrWang'
import {mountedToArrPrototype, nameGenerator, replaceEach} from '../../mock'

let searchTimeType = ref('日报')
let searchTime = ref(new Date())
let timeActive = ref('日报')
let citys = ref([])
let consumption = ref([])
const timeTypes = [
  {
    value: '日报',
    lable: '日报',
  },
  {
    value: '月报',
    lable: '月报',
  },
  {
    value: '年报',
    lable: '年报',
  },
]

function handleChange() {
  timeActive.value = searchTimeType.value
}

async function search() {
  let type
  if (searchTimeType.value === '年报') {
    type = 'year'
  } else if (searchTimeType.value === '月报') {
    type = 'month'
  } else if (searchTimeType.value === '日报') {
    type = 'day'
  }
  //
  const res = await fetchConsume({
    type: type,
    currentTime: dateTimeTrans(searchTime.value, searchTimeType.value),
  })
  console.log("嘎嘎嘎", res)
  if (res.code === '200') {
    citys.value = res.data.map(item => item.name)
    consumption.value = res.data.map(item => item.totalVolume)
  }
  console.log("啊啊啊", citys.value)
  console.log("嘿嘿嘿", consumption.value)
  BarPic(citys.value, consumption.value)
}

let myChart
let BarPic = function (xValues, yValues) {
  mountedToArrPrototype()
  let chartDom = document.getElementById('water-bar')
  myChart = echarts.init(chartDom)
  let coloredY = []
  const colors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  for (let i = 0; i < yValues.length; i++) {
    let str = '#'
    let random = 0
    for (let j = 0; j < 6; j++) {
      random = parseInt(Math.random() * 16)
      str += colors[random]
    }
    coloredY.push({
      value: yValues[i],
      itemStyle: {color: str},
    })
  }
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
    xAxis: [
      {
        name: '道路',
        type: 'category',
        data: xValues,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        name:'用水量(m³)',
        type: 'value',
      },
    ],
    series: [
      {
        name: '用水量',
        type: 'bar',
        data: coloredY,
        barWidth: 40,
      },
    ],
  }
  if (xValues.length > 8) {
    option.dataZoom = [
      {
        show: true,
        realtime: true,
        start: 0,
        filterMode: 'none',
        end: 30,
        bottom: '5%',
        height: 3,
        showDetail: false,
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 30,
        showDetail: false,
      },
    ]
  }
  myChart.setOption(option)
}

onMounted(async () => {
  search()
})
onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
  }
})
</script>

<style lang="scss" scoped>
.page2-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  position: relative;
}

.op-flex {
  display: flex;
  flex-grow: 1;
  margin-left: 650px;
}

.search {
  position: relative;
  margin-left: 10px;
}

.p-body {
  margin-left: 40px;
}

.e-chart-C {
  margin-top: 10px;
  background-color: white;
  height: 85%;
  width: 100%;
}
</style>