<template>
  <div class="lay-out">

    <div id="map-container"  class="layer"></div>

    <div id="panel"></div>

  </div>
  <div class="layer box">
    <div class="indexbox2">
        <div class="header2"><b>阀栓选择</b></div>
        <div class="divider2"></div>
        <div class="inner-box2">
          <el-cascader
            v-model="place"
            :options="options"
            :props="myprops"
            :show-all-levels="false"
            placeholder="选择阀栓"
            @expand-change="handleItemChange"
            collapse-tags="true"
            style="left: 10px;width: 220px"
            clearable/>
        </div>
    </div>

    <div class="map-tip">
        <div class="tip-item">
          <div class="icon" :style="{ background: 'rgb(177,253,47)' }"></div>
          <div class="word1">阀门</div>
          <el-switch
            v-model="wellFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <div class="triangle-green"></div>
          <div class="word2">消防栓</div>
          <el-switch
            v-model="hydrantFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <div class="icon" :style="{ background: 'rgb(177,253,47)' }"></div>
          <div class="triangle-green"></div>
          <div class="word">正常运行</div>
          <el-switch
            v-model="normalFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <div class="icon" :style="{ background: 'rgb(221, 109, 115)' }"></div>
          <div class="triangle-red"></div>
          <div class="word">正在报警</div>
          <el-switch
            v-model="warningFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <div class="icon" :style="{ background: 'rgb(150,151,151)' }"></div>
          <div class="triangle-grey"></div>
          <div class="word">已经废弃</div>
          <el-switch
            v-model="offlineFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <div class="icon" :style="{ background: 'rgb(213,22,251)' }"></div>
          <div class="triangle-purple"></div>
          <div class="word">尚未安装</div>
          <el-switch
            v-model="uninstallFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
    </div>

    <el-radio-group
        v-model="radio"
        size="medium"
        style="position: absolute; bottom: 17px; right: -220px; pointer-events: auto; padding-right: 240px"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MapLoader from './localMap.js';
import {ref, onMounted,onUnmounted} from 'vue'
import { markRaw } from 'vue'
import {fetchValveInfos} from '../../apis/2.0/newMap';
import { fetchSuperWithValves} from '../../apis/2.0/addr'
import floatBall from '../../components/floatBall.vue'

let radio = ref("标准地图")
let satelliteObject = ref()
let chart
let place = ref()
let options = ref([])
satelliteObject.value = null
const echarts = globalThis.echarts
let navmode = ref(false)//导航
let normalWell = ref([])
normalWell.value = []
let normalHydrant = ref([])
normalHydrant.value = []

//
let offlineWell=ref([])
offlineWell.value=[]
let warningWell=ref([])
warningWell.value=[]
let uninstalledWell=ref([])
uninstalledWell.value=[]
let offlineHydrant=ref([])
offlineWell.value=[]
let warningHydrant=ref([])
warningWell.value=[]
let uninstalledHydrant=ref([])
uninstalledWell.value=[]
let myprops = {
  label: 'name',
  value: 'message',
  checkStrictly: false,//是否能选择任意一级选项
  children: 'child',
  multiple: 'true'
}
//
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

let wellNormalFlag=ref(true)
let hydrantNormalFlag=ref(true)
let warningFlag=ref(true)
let offlineFlag=ref(true)
let uninstallFlag=ref(true)
let normalFlag=ref(true)
let wellFlag=ref(true)
let hydrantFlag=ref(true)

async function changeSwitch(e){
  await fetchData()
  await setMap()
}

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
    driving.clear()
    // driving.destroy()//拖曳
  }
}

async function loadMap() {
  if(!chart){
    chart = markRaw(echarts.init(document.getElementById('map-container')))
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
  }

  if(normalFlag.value===false){
    normalWell.value=[]
    normalHydrant.value=[]
  }
  if(warningFlag.value===false){
    warningWell.value=[]
    warningHydrant.value=[]
  }
  if(offlineFlag.value===false){
    offlineWell.value=[]
    offlineHydrant.value=[]
  }
  if(uninstallFlag.value===false){
    uninstalledWell.value=[]
    uninstalledHydrant.value=[]
  }
  if(wellFlag.value==false){
    normalWell.value=[]
    warningWell.value=[]
    offlineWell.value=[]
    uninstalledWell.value=[]
  }
  if(hydrantFlag.value==false){
    normalHydrant.value=[]
    warningHydrant.value=[]
    offlineHydrant.value=[]
    uninstalledHydrant.value=[]
  }

  const optionNew = {
    amap: {
      viewMode: '3D',
      center: [115.381112,33.252427],
      zoom: 15,
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
        symbol:'circle',
        /*散点形状设置:
        'circle’, ‘rect’, ‘roundRect’, ‘triangle’,
        ‘diamond’, ‘pin’, 'arrow’
        */
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
        symbol:'rec',
        /*散点形状设置:
        'circle’, ‘rect’, ‘roundRect’, ‘triangle’,
        ‘diamond’, ‘pin’, 'arrow’
        */
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
        name: '阀门正在报警',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: warningWell.value,
        symbol:'circle',
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
        name: '消防栓正在报警',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: warningHydrant.value,
        symbol:'rec',
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
        name: '阀门已经废弃',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: offlineWell.value,
        symbol:'circle',
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
        name: '消防栓已经废弃',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: offlineHydrant.value,
        symbol:'rec',
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
        name: '阀门尚未安装',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: uninstalledWell.value,
        symbol:'circle',
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
      {
        name: '消防栓尚未安装',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: uninstalledHydrant.value,
        symbol:'rec',
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
    const amap = chart.getModel().getComponent('amap').getAMap()
    AMap.plugin('AMap.Driving', function () {
      driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: amap,
        panel: 'panel'
      })
      driving.search(startLngLat, endLngLat, function (status, result) {
      })
    })
    //  const amap = chart.getModel().getComponent('amap').getAMap()
    //   AMap.plugin('AMap.DragRoute', function () {
    //   let path = []
    //   path.push(startLngLat)
    //   path.push(endLngLat)
    //   driving = new AMap.DragRoute(amap, path, AMap.DrivingPolicy.LEAST_FEE)
    //   driving.search()
    // })
  }
}
const setMap = async () => {
    await loadMap()
    const amap = chart.getModel().getComponent('amap').getAMap()
    var satellite = new AMap.TileLayer.Satellite({
      map: amap,
    })
    satellite.hide()
    satelliteObject.value = satellite
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
  warningWell.value=getList(item => item.status === 4444 && item.valveType === 1)
  warningHydrant.value=getList(item => item.status === 4444 && item.valveType === 2)
  offlineWell.value=getList(item => item.status === 1003 && item.valveType === 1)
  offlineHydrant.value=getList(item => item.status === 1003 && item.valveType === 2)
  uninstalledWell.value=getList(item => item.status === 1002 && item.valveType === 1)
  uninstalledHydrant.value=getList(item => item.status === 1002 && item.valveType === 2)


  console.log("阀门正常运行", normalWell.value)
  console.log("消防栓正常运行", normalHydrant.value)
  console.log("阀门正在报警", warningWell.value)
  console.log("消防栓正在报警", warningHydrant.value)
  console.log("阀门已经废弃", offlineWell.value)
  console.log("消防栓已经废弃", offlineHydrant.value)
  console.log("阀门尚未安装", uninstalledWell.value)
  console.log("消防栓尚未安装", uninstalledHydrant.value)
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
  if(!chart){
    await setMap()
  }
  const temp = await fetchSuperWithValves()
  options.value = temp
})

// onUnmounted(async()=>{
//   if(chart){
//     chart.dispose()
//   }
// })
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

.inner-box2 {
    width: 350px;
    height: 40px;
    margin-left: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
.indexbox2 {
    background: rgb(255, 255, 255, 0.9);
    position: absolute;
    top: 10px;
    right: 10px;
    width: 250px;
    height: 120px;
    pointer-events: auto;
    border: 0.5px solid rgba($color: #000000, $alpha: 0.1);
    font-size: 140%;
    border-radius: 15px;
  }
 .header2 {
    margin: 15px;
    margin-top: 17px;
    margin-bottom: 13px;
  }

.divider2 {
    border-top: 1px solid rgba($color: #969696, $alpha: 0.15);
    height: 1px;
    overflow: hidden;
    width: 345px;
    margin-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
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
  width: 130px;
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

.map-tip {
    position: absolute;
    bottom: 80px;
    right: 25px;
    padding: 5px;
    width: 180px;
    background: white;
    border-radius: 6px;
    .tip-item {
      display: flex;
      align-items: center;
      padding: 6px;
      .icon {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        margin-right: 6px;
      }
      .word {
        position: relative;
        left:8px;
        font-size: 13px;
      }
      .word1 {
        position: relative;
        left:29px;
        font-size: 13px;
      }
      .word2 {
        position: relative;
        left:35px;
        font-size: 13px;
      }
      .triangle-green {
        width: 10%;
				height: 0;
				padding-top: 10%;
				border: 1px solid rgb(252, 250, 250);
				background: rgb(177,253,47);
      }
      .triangle-red {
        width: 10%;
				height: 0;
				padding-top: 10%;
				border: 1px solid rgb(252, 250, 250);
				background: rgb(221, 109, 115);
      }
      .triangle-grey {
        width: 10%;
				height: 0;
				padding-top: 10%;
				border: 1px solid rgb(252, 250, 250);
				background: rgb(150,151,151);
      }
      .triangle-purple {
        width: 10%;
				height: 0;
				padding-top: 10%;
				border: 1px solid rgb(252, 250, 250);
				background: rgb(213,22,251);
      }
    }
  }
</style>
