<template>
  <div class="wholePage" >
  <div class="lay-out" >

    <div id="map-container"  class="layer"></div>

    <div id="panel"></div>

  </div>
    <div class="miniCicle" v-show="miniShow2" @click="miniClick">
      <img src="../../assets/feeds.png" style="margin: 10px;width: 30px;height: 30px">
    </div>
    <div class="indexbox2" v-show="miniShow" >
        <div class="header2">
          <h1 style="font-size: 16px">阀栓选择</h1>
          <p @click="miniClick2" style="position:absolute;right: 20px">×</p>
        </div>
        <div class="divider2"></div>
        <div class="inner-box2" id="box">
          <el-scrollbar  height="200px">
            <el-tree :check-strictly="false" :data="options" :props="defaultProps" :default-checked-keys="defaultKey" ref="require" @check-change="handleItemChange" node-key="id" show-checkbox="true" />
          </el-scrollbar>
        </div>
    </div>
    </div>

    <div class="map-tip">
        <div class="tip-item">
          <object :data="wellNormal" style="width:23px;height:23px;"></object>
          <div class="word1">阀门</div>
          <el-switch
            v-model="wellFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <object :data="hydrantNormal" style="width:23px;height:23px;"></object>
          <div class="word2">消防栓</div>
          <el-switch
            v-model="hydrantFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <object :data="wellGreen" style="width:23px;height:23px;"></object>
          <object :data="hydrantGreen" style="width:23px;height:23px;"></object>
          <div class="word">正常运行</div>
          <el-switch
            v-model="normalFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <object :data="wellRed" style="width:23px;height:23px;"></object>
          <object :data="hydrantRed" style="width:23px;height:23px;"></object>
          <div class="word">正在报警</div>
          <el-switch
            v-model="warningFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <object :data="wellGrey" style="width:23px;height:23px;"></object>
          <object :data="hydrantGrey" style="width:23px;height:23px;"></object>
          <div class="word">已经废弃</div>
          <el-switch
            v-model="offlineFlag"
            @change="changeSwitch"
            style="position: absolute; right: 4px; margin-top: 2px"
          >
          </el-switch>
        </div>
        <div class="tip-item">
          <object :data="wellPurple" style="width:23px;height:23px;"></object>
          <object :data="hydrantPurple" style="width:23px;height:23px;"></object>
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
</template>

<script setup>
import MapLoader from './localMap.js';
import {ref, onMounted,onUnmounted,getCurrentInstance} from 'vue'
import { markRaw } from 'vue'
import { ElLoading } from 'element-plus'
import {fetchValveInfos} from '../../apis/2.0/newMap';
import { fetchSuperWithValves} from '../../apis/2.0/addr'
import floatBall from '../../components/floatBall.vue'
import wellNormal from './svg/wellNormal.svg'
import wellGreen from './svg/wellGreen.svg'
import wellRed from './svg/wellRed.svg'
import wellGrey from './svg/wellGrey.svg'
import wellPurple from './svg/wellPurple.svg'
import hydrantNormal from './svg/hydrantNormal.svg'
import hydrantGreen from './svg/hydrantGreen.svg'
import hydrantRed from './svg/hydrantRed.svg'
import hydrantGrey from './svg/hydrantGrey.svg'
import hydrantPurple from './svg/hydrantPurple.svg'

let loading=ref(true)
let radio = ref("标准地图")
let satelliteObject = ref()
let chart
// let place = ref()
let options = ref([])
let require = ref(null)
satelliteObject.value = null
const echarts = globalThis.echarts
let navmode = ref(false)//导航
let normalWell = ref([])
normalWell.value = []
let normalHydrant = ref([])
normalHydrant.value = []
let defaultKey=ref([])
let miniShow = ref(false)
let miniShow2 = ref(true)
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
// let myprops = {
//   label: 'name',
//   value: 'message',
//   checkStrictly: false,//是否能选择任意一级选项
//   children: 'child',
//   multiple: 'true'
// }
let judge=false
let defaultProps={
    children: 'child',
    label: 'name',
    disabled: 'disabled',
}

let startLngLat = []
let endLngLat = []
let clicklocation = ref([])
clicklocation.value = []
let clicked = ref(false)
let showNav = ref(false)
let state = ref(false)
let driving
let myData=ref([])
let wellNormalFlag=ref(true)
let hydrantNormalFlag=ref(true)
let warningFlag=ref(true)
let offlineFlag=ref(true)
let uninstallFlag=ref(true)
let normalFlag=ref(true)
let wellFlag=ref(true)
let hydrantFlag=ref(true)
let hydrantPath='path://M456 64a8 8 0 0 0-8 8v57.336C341.582 140.332 254.974 218.082 230.763 320H168a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h56v128h-56a8 8 0 0 0-8 8v176a8 8 0 0 0 8 8h56v192h-56a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h688a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8h-56V704h56a8 8 0 0 0 8-8V520a8 8 0 0 0-8-8h-56V384h56a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8h-62.763C769.026 218.082 682.418 140.332 576 129.336V72a8 8 0 0 0-8-8H456z m56 738c-106.039 0-192-85.961-192-192s85.961-192 192-192 192 85.961 192 192-85.961 192-192 192z M640 610c0 70.692-57.308 128-128 128-70.692 0-128-57.308-128-128 0-70.692 57.308-128 128-128 70.692 0 128 57.308 128 128z'
let wellPath='path://M972.110701 459.803197c-4.526083-59.69252-20.843724-117.172653-48.500621-170.84404-27.65485-53.66627-64.993247-100.31266-110.978581-138.641617-44.416606-37.022195-94.988398-64.767096-150.312424-82.46313-55.323003-17.698081-112.608707-24.453948-170.266895-20.084431-59.694567 4.524037-117.173676 20.841677-170.841993 48.497551-53.668317 27.65485-100.316753 64.995293-138.644687 110.982674-37.021172 44.417629-64.766073 94.991468-82.461083 150.315494C82.41043 412.887678 75.654562 470.173382 80.026126 527.83157c4.526083 59.693544 20.842701 117.170606 48.496527 170.836877 27.656897 53.671387 64.99734 100.3188 110.982674 138.647757 44.416606 37.022195 94.988398 64.766073 150.311401 82.462107 55.32198 17.693987 112.606661 24.448832 170.263825 20.076244 59.693544-4.527107 117.172653-20.844747 170.841993-48.500621 53.66934-27.65485 100.31573-64.99427 138.644687-110.978581 37.023218-44.414559 64.768119-94.985328 82.464153-150.307308C969.726398 574.745043 976.482265 517.460362 972.110701 459.803197zM565.615617 146.910954c4.200672-18.650779 31.925107-38.385239 36.592406-37.109176 12.718673 3.476171 10.94733 1.429559 22.334681 8.513908 16.394389 10.200316 22.790052 24.270776 30.532387 27.140127 17.915022 6.640234 31.574113-0.971118 37.296441 0.413416 10.984169 2.657526 14.791891 9.051143 23.595394 21.406542 6.232958 8.748245 10.206456 13.945617 17.249873 19.928888 8.262174 7.016811 15.899108 10.595312 26.963095 11.879562 20.182668 2.341325 29.957289 31.968086 30.05041 38.71065 0.10847 7.888667 16.044418 21.079084 23.263843 24.64326 2.75781 1.360997 39.010479 5.759167 31.78696 41.934065-1.843998 9.232269-7.358595 29.060873-35.996842 42.669822 0 0-190.459796 63.23009-203.324802 70.603011l-42.938951-36.433794C557.855886 300.154128 551.41315 209.959919 565.615617 146.910954zM491.021711 458.276425l58.328453 0 0 56.281841-58.328453 0L491.021711 458.276425zM194.577069 290.547329c10.143011-22.251793 14.386662-18.012236 23.663956-24.518417 3.903913-2.738367 9.740852-3.347235 18.636452-8.063653 21.290909-11.287067 14.764262-26.044166 18.398022-37.117362 2.103918-6.411013 8.829086-14.048971 24.693402-19.123546 6.694469-2.14178 19.707854-5.564739 25.396413-9.695826 5.318122-3.861958 18.09103-9.787924 23.209608-23.836895 0 0 2.812045-6.928806 16.526395-13.487176 12.428054-5.943362 22.1116-4.988618 30.800493-2.99931 0 0 10.414187-0.066515 19.973914-5.874801 8.442276-5.129834 11.912307-13.210883 20.258393-20.819165 1.89721-1.729387 16.048511-19.518542 40.514739-3.202948 24.396643 12.33698 27.731598 43.912116 28.866445 45.841048 0 0 2.601244 213.497489 2.501984 214.544331l-47.62774 29.810956c0 0-102.351086-25.102724-166.159344-49.293683-23.557532-8.931416-41.205471-17.185404-46.590108-20.283975C206.286762 336.502987 191.704648 296.849872 194.577069 290.547329zM245.639025 745.885841c-1.601474-0.334621-17.266245-19.163455-17.322527-32.055067-0.047072-10.628058-1.307785-40.323381-31.410384-47.39852-5.854335-1.376347-9.139148-16.683984-9.704013-24.275893-0.807389-10.838859 2.475378-15.932878-1.447978-30.096459-6.251378-22.572088-11.963473-27.487028-15.189957-30.68486-4.854565-4.810562-15.186887-21.112853-0.830925-49.89334 0.820692-1.644453 7.133468-12.492522-2.457981-30.891568-8.054443-15.449877-14.810311-17.417695-14.178931-38.414915 6.715959-20.275789 27.941376-27.439956 30.29498-28.345582 26.903743-10.348696 67.910693 7.14677 50.265824 2.756787-1.549286-0.384763 114.825189 35.539424 114.825189 35.539424 7.893784 1.158383 67.943438 20.703531 75.571163 23.38971l13.68672 54.632271c0 0-39.672558 62.438051-49.169863 74.737168-9.270131 12.002358-53.899584 76.650751-64.338331 87.178525C303.777143 732.697471 289.43039 755.035222 245.639025 745.885841zM712.531688 804.993031c-1.154289 5.710049-3.659343 19.98824-7.569396 22.228257-21.813818 12.492522-42.045605 5.684466-42.045605 5.684466s-16.031115-6.186909-31.574113 3.529383c-11.383258 7.116071-14.988366 15.546068-14.988366 15.546068s-13.409404 8.330736-38.056758 0.638543c-19.22383-5.998621-46.597271-3.184529-52.082192 3.667529-8.045233 10.050913-41.84299-3.270487-47.704488-11.235902 0 0-15.371082-12.756535-45.353954-0.938372-9.380648 3.697205-32.184003 1.99647-38.175461-16.010649-0.7552-2.27174-10.450003-15.370059-6.580882-37.207413 3.362584-18.974144 16.875343-35.343973 16.875343-35.343973l103.537098-165.567873 56.30947 0.753153c0 0 74.470085 81.501222 96.398514 110.994953 10.397814 13.985526 35.874045 47.38317 43.447535 61.962214C714.025715 781.12953 715.006042 792.753265 712.531688 804.993031zM900.216277 545.761941c0 0-17.267269 34.288944-8.91709 48.572252 5.355985 9.162684-10.738575 39.951921-23.045879 43.842531-6.624884 2.094708-13.240559 20.817118-13.240559 20.817118l-0.24764 30.166043c0 0-3.197832 20.168342-25.640983 25.087375-33.106002 7.255241-55.144948-17.144472-55.144948-17.144472L630.061394 539.839045l15.777335-54.064336c0 0 167.183673-87.872327 219.011062-92.015693 0 0 24.920576-0.039909 45.652759 20.140713 9.202593 8.958022-4.2897 42.980907-4.2897 42.980907s-16.783245 19.475564 5.057179 49.426713C919.147442 517.107321 900.216277 545.761941 900.216277 545.761941z'



async function changeSwitch(e){
  await fetchData()
  await setMap()
}
async function handleItemChange(e){
  if(!require.value.getCheckedNodes()){
    myData.value=[]
  }else{
    let place = require.value.getCheckedNodes().filter((item) => {
    if(item.message.type==='hydrant'||item.message.type==='valve'){
      return true
    }else{
      return false
    }
  })
  myData.value=place.map(item=>{
        let myId
          if(item.message.type==='hydrant'||item.message.type==='valve'){
            myId=item.message.zoneId
          }
        return myId
      })
  }
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
    //console.log(state.value)
    if (navmode.value === true && state.value === true) {
      if (clicklocation.value.length === 0) {
        startLngLat.push(e.data.value[0])
        startLngLat.push(e.data.value[1])
        clicklocation.value.push(e.data)
        clicked.value = true
        showNav.value = false
      } else if (clicklocation.value.length === 1 && state.value === true) {
        endLngLat.push(e.data.value[0])
        endLngLat.push(e.data.value[1])
        clicklocation.value.push(e.data)
        clicked.value = true
        showNav.value = true
        //console.log("终点", endLngLat)
        //console.log("点列表", clicklocation.value)
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
    tooltip:{
      show:true,
      trigger: 'item',
      formatter:function(param){
        ////console.log(param)
        let res
        res='阀栓编号: '+param .data.valveCode+"<br />"
           +'阀栓名称: '+param.data.name+"<br />"
           +'阀栓地址: '+param.data.address+"<br />"
           //+'管理部门: '+param.data.applicantName+"<br />"
           +'联系方式: '+param.data.comNumber+"<br />"
           +'创建时间: '+param.data.createTime+"<br />"
        return res
      },
    },
    animation: false,
    series: [
      {
        name: '阀门正常运行',
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: normalWell.value,
        symbol:wellPath,
        color:'rgb(177,253,47)',
        // tooltip:{
        //   trigger: 'item',
        //   formatter:'{c}',
        // },
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
        symbol:hydrantPath,
        color:'rgb(177,253,47)',
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
        symbol: wellPath,
        color:'rgb(221, 109, 115)',
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
        symbol:hydrantPath,
        color:'rgb(221, 109, 115)',
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
        symbol:wellPath,
        color:'rgb(150,151,151)',
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
        symbol:hydrantPath,
        color:'rgb(150,151,151)',
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
        symbol:wellPath,
        color:'rgb(213,22,251)',
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
        symbol:hydrantPath,
        color:'rgb(213,22,251)',
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
  let getList
  //console.log("myData",myData.value)
  if(judge===true){
      getList = e => {
      return res.filter(e).map(item => {
        if(myData.value.indexOf(item.valveId)!=-1){
            return {
            valveId: item.valveId,
            name: item.valveName,
            value: [item.longitude, item.latitude],
            applicantName:item.applicantName,
            valveCode:item.valveCode,
            address:item.address,
            comNumber:item.comNumber,
            createTime:item.createTime
          }
        }else{
          return false;
        }
      })
    }
  }else{
    getList = e => {
      return res.filter(e).map(item => {
            return {
            valveId: item.valveId,
            name: item.valveName,
            value: [item.longitude, item.latitude],
            applicantName:item.applicantName,
            valveCode:item.valveCode,
            address:item.address,
            comNumber:item.comNumber,
            createTime:item.createTime
          }
      })
    }
  }

  normalWell.value = getList(item => item.status === 1001 && item.valveType === 1)
  normalHydrant.value = getList(item => item.status === 1001 && item.valveType === 2)
  warningWell.value=getList(item => item.status === 4444 && item.valveType === 1)
  warningHydrant.value=getList(item => item.status === 4444 && item.valveType === 2)
  offlineWell.value=getList(item => item.status === 1003 && item.valveType === 1)
  offlineHydrant.value=getList(item => item.status === 1003 && item.valveType === 2)
  uninstalledWell.value=getList(item => item.status === 1002 && item.valveType === 1)
  uninstalledHydrant.value=getList(item => item.status === 1002 && item.valveType === 2)


  //console.log("阀门正常运行", normalWell.value)
  //console.log("消防栓正常运行", normalHydrant.value)
  //console.log("阀门正在报警", warningWell.value)
  //console.log("消防栓正在报警", warningHydrant.value)
  //console.log("阀门已经废弃", offlineWell.value)
  //console.log("消防栓已经废弃", offlineHydrant.value)
  //console.log("阀门尚未安装", uninstalledWell.value)
  //console.log("消防栓尚未安装", uninstalledHydrant.value)
}
function miniClick(){
  miniShow.value = true
  miniShow2.value = false
}
function miniClick2(){
  miniShow.value = false
  miniShow2.value = true
}

function changeLayer(e) {
  //console.log("哈哈哈哈",radio.value)
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
  let res=await fetchValveInfos()
  myData.value=res.map(item=>{
    return item.valveId
  })
  //console.log("mymymytSs",myData.value)
  const temp = await fetchSuperWithValves()
  options.value = temp
  for(let i=0;i<=options.value[0].id;i++){
    defaultKey.value.splice(0,0,i)
  }
  judge=true
})

onUnmounted(async()=>{
  if(chart){
    chart.dispose()
  }
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
  height: calc(100vh - 80px);
}

.inner-box2 {
    min-width: 120px;
    height: 150px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
  }
.indexbox2 {
    background: rgb(255, 255, 255, 0.9);
    position: absolute;
    top: 20px;
    right: 20px;
    min-width: 120px;
    height: 220px;
    pointer-events: auto;
    border: 0.5px solid rgba($color: #000000, $alpha: 0.1);
    font-size: 140%;
    border-radius: 15px;
  }
 .header2 {
   display: flex;
   flex-direction: row;
   min-width: 120px;
    margin: 15px;
    margin-top: 17px;
    margin-bottom: 13px;
  }

.divider2 {
    border-top: 1px solid rgba($color: #969696, $alpha: 0.15);
    height: 1px;
    overflow: hidden;
    min-width: 120px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
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
.miniCicle{
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(255, 255, 255, 0.9);
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
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
      flex-direction: row;
      align-items: center;
      padding: 6px;

      .word {
        position: relative;
        left:8px;
        font-size: 13px;
      }
      .word1 {
        position: relative;
        left:32px;
        font-size: 13px;
      }
      .word2 {
        position: relative;
        left:32px;
        font-size: 13px;
      }
      .triangle-green {
        width: 10%;
				height: 0;
				padding-top: 10%;
				border: 1px solid rgb(252, 250, 250);
				background: #b1fd2f;
      }
      .triangle-red {
        width: 10%;
				height: 0;
				padding-top: 10%;
				border: 1px solid rgb(252, 250, 250);
				background: #dd6d73;
      }//
      .triangle-grey {
        width: 10%;
				height: 0;
				padding-top: 10%;
				border: 1px solid rgb(252, 250, 250);
				background: #969797;
      }
      .triangle-purple {
        width: 10%;
				height: 0;
				padding-top: 10%;
				border: 1px solid rgb(252, 250, 250);
				background: #d516fb;
      }
    }
  }
</style>
