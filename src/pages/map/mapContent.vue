<template>
  <div class="lay-out">
    <div id="map-container" class="layer"></div>
    <div id="panel"></div>
  </div>
  <div class="layer box">
    <map-tip></map-tip>
    <el-radio-group
        v-model="radio"
        size="medium"
        style="position: absolute; bottom: 5px; right: 10px; pointer-events: auto; padding-right: 240px"
        @change="changeLayer"
    >
      <el-radio-button label="标准地图" ></el-radio-button>
      <el-radio-button label="卫星地图"></el-radio-button>
    </el-radio-group>
    <div class="navtool">
      <div class="header"
      ><b>导航模式</b>
        <el-switch
            v-model="navmode"
            @change="changeMode"
            style="position: absolute; right: 15px; margin-top: 2px"
        >
        </el-switch>
      </div>
      <div class="divider" v-show="navmode"></div>
      <div class="content" v-show="navmode">
        <div class="clickfirst" v-show="!clicked">请点击起点</div>
        <div class="clicksecond" v-if="clicked && !showNav">
          <div>起点：{{ `${clicklocation[0].name}` }}</div>
          <div style="margin-top: 10px">请点击终点</div>
        </div>
        <div class="clickthird" v-if="clicked && showNav">
          <div>{{ `${clicklocation[0].name}` }}至{{ `${clicklocation[1].name}` }}</div>
          <div style="margin-top: 10px">导航完成</div>
          <!-- <div style="margin-top: 10px">请点击新的起点</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MapLoader from './localMap.js';
import {ref, onMounted} from 'vue'
import {fetchValveInfos} from '../../apis/2.0/newMap';
import MapTip from '../../components/mapTip.vue'

let radio = ref("标准地图")
let satelliteObject = ref()
let chart
satelliteObject.value = null
const echarts = globalThis.echarts
let navmode = ref(false)//导航
let normalWell = ref([])
normalWell.value = []
let normalHydrant = ref([])
normalHydrant.value = []
let offline = ref([])
offline.value = []
let warning = ref([])
warning.value = []
let uninstalled = ref([])
uninstalled.value = []
let valveData = ref([])
valveData.value = []
let startLngLat = []
let endLngLat = []
let clicklocation = ref([])
clicklocation.value = []
let clicked = ref(false)
let showNav = ref(false)
let state = ref(false)
let driving

function changeMode(e) {
  clicklocation.value = []
  clicked.value = false
  showNav.value = false
  startLngLat = []
  endLngLat = []
  if (state.value === false) {
    state.value = true
  }
  if (driving) {
    //driving.clear()
    driving.destroy()//拖曳
  }
}

async function loadMap() {
  chart = echarts.init(document.getElementById('map-container'))
  
  chart.on('click', e => {
    console.log("点击的", e.data)
    console.log(state.value)
    if (navmode.value === true && state.value === true) {
      if (clicklocation.value.length === 0) {
        startLngLat.push(e.data.value[0])
        startLngLat.push(e.data.value[1])
        clicklocation.value.push(e.data)
        clicked.value = true
        showNav.value = false
        console.log("起点", startLngLat)
        console.log("点列表", clicklocation.value)
      } else if (clicklocation.value.length === 1 && state.value === true) {
        endLngLat.push(e.data.value[0])
        endLngLat.push(e.data.value[1])
        clicklocation.value.push(e.data)
        clicked.value = true
        showNav.value = true
        console.log("终点", endLngLat)
        console.log("点列表", clicklocation.value)
        setNav()
      } else if (clicklocation.value.length === 2) {
        startLngLat = []
        endLngLat = []
        clicklocation.value = []
        clicked.value = true
        state.value = false
      }
    } else {

    }
  })
  const optionNew = {
    amap: {
      viewMode: '3D',
      center: [105.189568, 37.514951],
      zoom: 11,
      resizeEnable: true,
      mapStyle: 'amap://styles/macaron',
      renderOnMoving: true,
      echartsLayerInteractive: true,
      largeMode: false,
    },
    animation: false,
    series: [
      {
        name: '阀门正常运行',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: normalWell.value,
        symbolSize: 27,
        encode: {
          value: 2,
        },
        showEffectOn: 'emphasis',
        rippleEffect: {
          brushType: 'stroke',
        },
        hoverAnimation: true,
        label: {
          formatter: '{b}',
          position: 'right',
          show: true,
        },
        itemStyle: {
          color: 'rgba(165, 255, 0, 0.8)',
          shadowBlur: 10,
          shadowColor: '#333',
        },
        zlevel: 1,
      },
      {
        name: '消防栓正常运行',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: normalHydrant.value,
        symbolSize: 27,
        encode: {
          value: 2,
        },
        showEffectOn: 'emphasis',
        rippleEffect: {
          brushType: 'stroke',
        },
        hoverAnimation: true,
        label: {
          formatter: '{b}',
          position: 'right',
          show: true,
        },
        itemStyle: {
          color: 'rgb(117, 205, 245)',
          shadowBlur: 10,
          shadowColor: '#333',
        },
        zlevel: 1,
      },
      {
        name: '正在报警',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: warning.value,
        showEffectOn: 'emphasis',
        symbolSize: 27,
        encode: {
          value: 2,
        },
        hoverAnimation: true,
        label: {
          formatter: '{b}',
          position: 'right',
          show: true,
        },
        itemStyle: {
          color: 'rgba(255,110,118, 0.8)',
          shadowBlur: 10,
          shadowColor: '#333',
        },
        zlevel: 1,
      },
      {
        name: '已经废弃',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: offline.value,
        symbolSize: 27,
        encode: {
          value: 2,
        },
        showEffectOn: 'emphasis',
        rippleEffect: {
          brushType: 'stroke',
        },
        hoverAnimation: true,
        label: {
          formatter: '{b}',
          position: 'right',
          show: true,
        },
        itemStyle: {
          color: 'rgba(165, 165, 165, 0.8)',
          shadowBlur: 10,
          shadowColor: '#333',
        },
        zlevel: 1,
      },
      {
        name: '尚未安装',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: uninstalled.value,
        symbolSize: 27,
        encode: {
          value: 2,
        },
        showEffectOn: 'emphasis',
        rippleEffect: {
          brushType: 'stroke',
        },
        hoverAnimation: true,
        label: {
          formatter: '{b}',
          position: 'right',
          show: true,
        },
        itemStyle: {
          color: 'rgb(194,20,229)',
          shadowBlur: 10,
          shadowColor: '#333',
        },
        zlevel: 1,
      },
    ],
  }
  chart.setOption(optionNew)
}

const setNav = async () => {
  if (!chart) {
    await setMap()
  } else {
    // const amap = chart.getModel().getComponent('amap').getAMap()
    // AMap.plugin('AMap.Driving', function () {
    //   driving = new AMap.Driving({
    //     policy: AMap.DrivingPolicy.LEAST_TIME,
    //     map: amap,
    //     panel: 'panel'
    //   })
    //   driving.search(startLngLat, endLngLat, function (status, result) {
    //   })
    // })
     const amap = chart.getModel().getComponent('amap').getAMap()
      AMap.plugin('AMap.DragRoute', function () {
      let path = []
      path.push(startLngLat)
      path.push(endLngLat)
      driving = new AMap.DragRoute(amap, path, AMap.DrivingPolicy.LEAST_FEE)
      driving.search()
    })
  }
}
const setMap = async () => {
  if (!chart) {
    await loadMap()
    const amap = chart.getModel().getComponent('amap').getAMap()
    var satellite = new AMap.TileLayer.Satellite({
      map: amap,
    })
    satellite.hide()
    satelliteObject.value = satellite
  }
}
const fetchData = async () => {
  let res = await fetchValveInfos()
  valveData.value = res
  const getList = e => {
    return res.filter(e).map(item => {
      return {
        valveId: item.valveId,
        name: item.valveName,
        value: [item.longitude, item.latitude],
        applicantName: item.applicantName
      }
    })
  }
  normalWell.value = getList(item => item.status === 1001 && item.valveType === 1)
  normalHydrant.value = getList(item => item.status === 1001 && item.valveType === 2)
  warning.value = getList(item => item.status === 4444)
  offline.value = getList(item => item.status === 1003)
  uninstalled.value = getList(item => item.status === 1002)
  console.log("阀门正常运行", normalWell.value)
  console.log("消防栓正常运行", normalHydrant.value)
  console.log("正在报警", warning.value)
  console.log("已经废弃", offline.value)
  console.log("尚未安装", uninstalled.value)
}

function changeLayer(e) {
  console.log("哈哈哈哈",radio.value)
  if (e == '标准地图') {
    satelliteObject.value.hide()
  } else {
    satelliteObject.value.show()
  }
}

onMounted(async () => {
  await fetchData()
  await setMap()
  //await setNav()
})
</script>

<style lang="scss" scoped>
#container {
  position: absolute;
  margin-top: -40px;
  left: 0;
  width: 100%;
  height: 100vw;
}

.layer {
  width: 100%;
  height: calc(100vh - 100px);
}

.layer-out {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 100px);
}

.navtool {
  position: absolute;
  bottom: 35px;
  left: 15px;
  pointer-events: auto;
  width: fit-content;
  height: fit-content;
  background: rgb(255, 255, 255, 0.9);
  //text-align: center;
  border: 0.5px solid rgba($color: #000000, $alpha: 0.1);
  font-size: 115%;
  border-radius: 15px;
}

.header {
  width: 220px;
  padding: 7px;
  padding-left: 15px;
}

.content {
  width: fit-content;
  height: fit-content;
  font-size: 105%;
  color: #000000;
}

.divider {
  border-top: 1px solid rgba($color: #969696, $alpha: 0.15);
  height: 1px;
  overflow: hidden;
  margin-left: 10px;
  margin-right: 10px;
}

.clickfirst {
  width: 220px;
  height: 45px;
  text-align: center;
  padding: 7px;
}

.clicksecond {
  padding: 15px;
  padding-top: 10px;
  max-width: 295px;
  min-width: 220px;
  word-wrap: break-word;
  word-break: normal;
  text-align: center;
}

.clickthird {
  padding: 15px;
  padding-top: 10px;
  max-width: 295px;
  min-width: 220px;
  word-wrap: break-word;
  word-break: normal;
  text-align: center;
}

#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 80px;
  left: 200px;
  width: 280px;
}

#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>