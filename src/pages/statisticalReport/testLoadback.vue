<template>
    <div class="p-page">
        <div class="p-header">
            <p class="page-name">统计报表</p>
            <div class="op-flex">
                   <el-cascader 
                      v-model="place"
                      :options="options" 
                      :props="myprops"
                      :show-all-levels="false"
                      ref="require" 
                      placeholder="选择行政区域"
                      @expand-change="handleItemChange"
                      collapse-tags="true"
                      style="width: 200px"
                      clearable/>
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
                   <div>
                      <el-date-picker
                        v-model="searchTime"
                        type="date"
                        placeholder="选择某天"
                        class="search"
                        style="width: 200px"
                        v-if="timeActive === '日'"
                      ></el-date-picker>
                      <el-date-picker
                        v-model="searchTime"
                        type="month"
                        placeholder="选择某月"
                        class="search"
                        style="width: 200px"
                        v-if="timeActive === '月'"
                      ></el-date-picker>
                      <el-date-picker
                        v-model="searchTime"
                        type="year"
                        placeholder="选择某年"
                        class="search"
                        style="width: 200px"
                        v-if="timeActive === '年'"
                      ></el-date-picker>
                   </div>
                   <el-button type="primary" class="search-btn" @click="search">查询</el-button>
                   <el-button type="primary" class="export-btn" @click="exportCSV">导出</el-button>
            </div>
        </div>
        <div class="p-body">
          <el-table
          :data="data"
          height="70vh"
          border
          stripe
          style="width: 100%"
          >
              <el-table-column min-width="1" align="center" prop="place" label="行政区域"> </el-table-column>
              <el-table-column sortable min-width="2" align="center" prop="valveVolume" label="阀门用水量(万m³)"> </el-table-column>
              <el-table-column sortable min-width="2" align="center" prop="hydrantVolume" label="消防栓用水量(万m³)"> </el-table-column>
              <el-table-column sortable min-width="2" align="center" prop="totalVolume" label="总用水量(万m³)"> </el-table-column>
          </el-table>
        </div>
    </div>
</template>

<script setup>
import { multiply } from 'lodash'
import {getCurrentInstance, onMounted,ref} from 'vue'
import {fetchCityList,
        fetchAreaList,
        fetchDistrictList,
        fetchTownList,
        fetchVillageList,
        fetchRoadList,
        fetchSuper,
  } from '../../apis/2.0/addr'
import {fetchCityReport,
        fetchAreaReport,
        fetchDistrictReport,
        fetchTownReport,
        fetchVillageReport,
        fetchRoadReport,
  } from '../../apis/2.0/newReport'
import { exportExcel } from '../../utils/exportExcel'
import {dateTimeTrans} from '../../utils/mrWang'
emits: ['handleItemChange']
let options=ref([])
let require=ref(null)
let myprops=ref()
let place =ref()
let searchTimeType=ref('日')
let searchTime = ref(new Date())
let timeActive = ref('日')
let data=ref([])
let allData=ref([])
const {proxy} = getCurrentInstance() 
const timeTypes = [
    {
      value: '日',
      lable: '日报',
    },
    {
      value: '月',
      lable: '月报',
    },
    {
      value: '年',
      lable: '年报',
    },
  ]
myprops={
  label:'name',
  value:'message',
  checkStrictly:true,
  children: 'child',
  multiple: 'true'
}
const getList=async(type,zoneId)=>{
  let place,newplace;
  if(type==='area'){
    place=(await fetchAreaList()||[]).filter(value=>value.pid==zoneId);
    newplace=place.map((item,index)=>{
              return{
                name: item.area,
                message: {zoneId: item.zoneId,
                          type:type,
                          name:item.area
                },
                child:null
              }
            })
  }
  else if(type==='district'){
    place=(await fetchDistrictList()||[]).filter(value=>value.pid==zoneId);
    newplace=place.map((item,index)=>{
              return{
                name: item.district,
                message: {zoneId: item.zoneId,
                          type:type,
                          name:item.district
                },
                child:[]
              }
            })
  }
  else if(type==='town'){
    place=(await fetchTownList()||[]).filter(value=>value.pid==zoneId);
    newplace=place.map((item,index)=>{
              return{
                name: item.town,
                message: {zoneId: item.zoneId,
                          type:type,
                          name:item.town
                },
                child:[]
              }
            })
  }
  else if(type==='village'){
    place=(await fetchVillageList()||[]).filter(value=>value.pid==zoneId);
    newplace=place.map((item,index)=>{
              return{
                name: item.village,
                message: {zoneId: item.zoneId,
                          type:type,
                          name:item.village
                },
                child:[]
              }
            })
  }
  else if(type==='road'){
    place=(await fetchRoadList()||[]).filter(value=>value.pid==zoneId);
    newplace=place.map((item,index)=>{
              return{
                name: item.road,
                message: {zoneId: item.zoneId,
                          type:type,
                          name:item.road
                },
                child:null
              }
            })
  }
  console.log("newplace: ",newplace);
  return newplace;
}
const getNodes=async(val)=>{
  if(!val){
    let rawcity=[];
    rawcity= await fetchCityList();
    console.log("rawcity: ",rawcity);
    const city=rawcity.map((item,index)=>{
      return{
        name: item.city,
        message: {zoneId: item.zoneId,
                  type:"city",
                  name:item.city
        },
        child:[]
      }
    })
    console.log("city: ",city);
    options.value=city;
    console.log("options: ",options);
  }
  else if(val.length===1){
    options.value.map(async(item,index)=>{
      if(item.message.zoneId===val[0].zoneId){
        if(item.child.length===0){
          let area = await getList('area',item.message.zoneId)
          let district=await getList('district',item.message.zoneId)
          if(district.length===0&&area.length===0){
            item.child=null;
          }
          else{
            item.child=[].concat(district).concat(area)
          }
        }
      }
    })
    console.log("options: ",options.value)
  }
  else if(val.length===2){
    options.value.map(async(item,index)=>{
      if(item.message.zoneId===val[0].zoneId){
        item.child.map(async(item1)=>{
          if(item1.message.zoneId===val[1].zoneId&&item1.message.type==='district'){
            if(item1.child.length===0){
              let town=await getList('town',val[1].zoneId)
              console.log("town: ",town)
              if(town.length===0){
                item1.child=null;
              }
              else{
                item1.child=[].concat(town)
              }
            }
          }
        })
      }
    })
  }
  else if(val.length===3){
    options.value.map(async(item,index)=>{
      if(item.message.zoneId===val[0].zoneId){
        item.child.map(async(item1)=>{
          if(item1.message.zoneId===val[1].zoneId&&item1.message.type==='district'){
            item1.child.map(async(item2)=>{
              if(item2.message.zoneId===val[2].zoneId){
                if(item2.child.length===0){
                  let village=await getList('village',val[2].zoneId)
                  console.log("village: ",village)
                  if(village.length===0){
                    item2.child=null
                  }
                  else{
                    item2.child=[].concat(village)
                  }
                }
              }
            })
          }
        })
      }
    })
  }
  else if(val.length===4){
    options.value.map(async(item,index)=>{
      if(item.message.zoneId===val[0].zoneId){
        item.child.map(async(item1)=>{
          if(item1.message.zoneId===val[1].zoneId&&item1.message.type==='district'){
            item1.child.map(async(item2)=>{
              if(item2.message.zoneId===val[2].zoneId){
                item2.child.map(async(item3)=>{
                  if(item3.message.zoneId===val[3].zoneId){
                    if(item3.child.length===0){
                      let road=await getList('road',val[3].zoneId)
                      console.log("road",road)
                      if(road.length===0){
                        item3.child=null;
                      }
                      else{
                        item3.child=[].concat(road)
                      }
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  }

}
const handleItemChange=async(val)=> {
  console.log("点击的val",val)
  fetchMychoice()
  getNodes(val)
}
function fetchMychoice(){//important
  let ineed=proxy.$refs.require.getCheckedNodes().map((item)=>{
    return item.data.message
  })
  return ineed
}
function handleChange() {
    timeActive.value = searchTimeType.value
  }
function exportCSV() {
    const excel = {}
    excel.props = [
      {
        label: '行政区域',
        name: 'place',
      },
      {
        label: searchTimeType.value +'阀门用水量(万m³)',
        name: 'valveVolume',
        default: '0',
      },
      {
        label: searchTimeType.value + '消防栓用水量(万m³)',
        name: 'hydrantVolume',
        default: '0',
      },
      {
        label: searchTimeType.value + '总用水量(万m³)',
        name: 'totalVolume',
        default: '0',
      },
    ]
    excel.body = data.value
    excel.fileName = '区域统计报表'
    exportExcel(excel)
  }
  async function init(){
    let myData=([1]).map(async(item)=>{
      let valveVolume,hydrantVolume,totalVolume,type
      if(searchTimeType.value==='年'){
        type='year'
      }else if(searchTimeType.value==='月'){
        type='month'
      }else if(searchTimeType.value==='日'){
        type='day'
      }
      const temp1=await fetchCityReport({
        type: type,
        currentTime: dateTimeTrans(searchTime.value,searchTimeType.value) ,
      })
      temp1.map((item1)=>{
        if(item1.id===1){
          valveVolume=item1.valveVolume
          hydrantVolume=item1.hydrantVolume
          totalVolume=item1.totalVolume
        }
      })
      return{
        place: "中卫市",
        valveVolume:valveVolume,
        hydrantVolume:hydrantVolume,
        totalVolume:totalVolume,
      }
    })
    data.value=await Promise.all(myData)//important
  }
  async function search(){
    console.log("options",options)
    console.log("我的当前选择",fetchMychoice())
    let myData=(fetchMychoice()||[]).map(async(item)=>{
      let valveVolume,hydrantVolume,totalVolume,type
      if(searchTimeType.value==='年'){
        type='year'
      }else if(searchTimeType.value==='月'){
        type='month'
      }else if(searchTimeType.value==='日'){
        type='day'
      }
      if(item.type==='city'){
        const temp1=await fetchCityReport({
          type: type,
          currentTime: dateTimeTrans(searchTime.value,searchTimeType.value) ,
        })
        temp1.map((item1)=>{
          if(item1.id===item.zoneId){
            valveVolume=item1.valveVolume
            hydrantVolume=item1.hydrantVolume
            totalVolume=item1.totalVolume
          }
        })
      }
      else if(item.type==='area'){
        const temp1=await fetchAreaReport({
          type: type,
          currentTime: dateTimeTrans(searchTime.value,searchTimeType.value) ,
        })
        temp1.map((item1)=>{
          if(item1.id===item.zoneId){
            valveVolume=item1.valveVolume
            hydrantVolume=item1.hydrantVolume
            totalVolume=item1.totalVolume
          }
        })
      }
      else if(item.type==='district'){
        const temp1=await fetchDistrictReport({
          type: type,
          currentTime: dateTimeTrans(searchTime.value,searchTimeType.value) ,
        })
        temp1.map((item1)=>{
          if(item1.id===item.zoneId){
            valveVolume=item1.valveVolume
            hydrantVolume=item1.hydrantVolume
            totalVolume=item1.totalVolume
          }
        })
      }
      else if(item.type==='town'){
        const temp1=await fetchTownReport({
          type: type,
          currentTime: dateTimeTrans(searchTime.value,searchTimeType.value) ,
        })
        temp1.map((item1)=>{
          if(item1.id===item.zoneId){
            valveVolume=item1.valveVolume
            hydrantVolume=item1.hydrantVolume
            totalVolume=item1.totalVolume
          }
        })
      }
      else if(item.type==='village'){
        const temp1=await fetchVillageReport({
          type: type,
          currentTime: dateTimeTrans(searchTime.value,searchTimeType.value) ,
        })
        temp1.map((item1)=>{
          if(item1.id===item.zoneId){
            valveVolume=item1.valveVolume
            hydrantVolume=item1.hydrantVolume
            totalVolume=item1.totalVolume
          }
        })
      }
      else if(item.type==='road'){
        const temp1=await fetchRoadReport({
          type: type,
          currentTime: dateTimeTrans(searchTime.value,searchTimeType.value) ,
        })
        temp1.map((item1)=>{
          if(item1.id===item.zoneId){
            valveVolume=item1.valveVolume
            hydrantVolume=item1.hydrantVolume
            totalVolume=item1.totalVolume
          }
        })
      }
      return{
        place: item.name,
        valveVolume:valveVolume,
        hydrantVolume:hydrantVolume,
        totalVolume:totalVolume,
      }
    })
    //console.log("测试测试",myData)
    data.value=await Promise.all(myData)//important
  }
onMounted(async()=>{
  // getNodes()
  // init()
  const temp=await fetchSuper()
  console.log("啊啊啊啊",temp)
  options.value=temp
})
</script>

<style lang="scss" scoped>
  .op-flex {
    display: flex;
    position: relative;
    top: 4px;
    right: -160px;
    width: 1000px;
    .margin-right {
      position: relative;
      margin-left: 20 px;
    }
    .search {
      position: relative;
      margin-left: 20 px;
      
    }
  }
  .search-btn {
    display: flex;
    margin-left: 400px;
  }
</style>