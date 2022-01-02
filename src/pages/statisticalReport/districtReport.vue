<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">统计报表</p>
      <div class="op-flex" id="box2">
        <el-cascader
            v-model="place"
            :options="options"
            :props="myprops"
            :show-all-levels="false"
            ref="require"
            placeholder="选择行政区域"
            @expand-change="handleItemChange"
            collapse-tags="true"
            style="left: 370px;min-width: 220px;max-height:40px"
            clearable/>
        <el-select
            v-model="searchTimeType"
            placeholder="选择时间段"
            @change="handleChange"
            class="margin-right"
            style="left:360px;min-width: 90px"
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
              style="left:370px;min-width: 200px"
              v-if="timeActive === '日报'"
          ></el-date-picker>
          <el-date-picker
              v-model="searchTime"
              type="month"
              placeholder="选择某月"
              class="search"
              style="left:390px;width: 200px"
              v-if="timeActive === '月报'"
          ></el-date-picker>
          <el-date-picker
              v-model="searchTime"
              type="year"
              placeholder="选择某年"
              class="search"
              style="left:390px;width: 200px"
              v-if="timeActive === '年报'"
          ></el-date-picker>
        </div>
        <el-button type="primary" class="search-btn" @click="search">查询</el-button>
        <el-button type="primary" class="export-btn" @click="exportCSV">导出</el-button>
      </div>
    </div>
    <div class="p-body" id="box">
      <el-table
          :data="data"
          height="70vh"
          border
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          stripe
          style="width: 100%"  empty-text=" "
      >
        <el-table-column min-width="1" align="center" prop="place" label="行政区域"></el-table-column>
        <el-table-column sortable min-width="2" align="center" prop="valveVolume"
                         label="阀门用水量(m³)"></el-table-column>
        <el-table-column sortable min-width="2" align="center" prop="hydrantVolume"
                         label="消防栓用水量(m³)"></el-table-column>
        <el-table-column sortable min-width="2" align="center" prop="totalVolume"
                         label="总用水量(m³)"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {multiply} from 'lodash'
import {getCurrentInstance, onMounted, ref} from 'vue'
import {ElLoading} from 'element-plus'
import {
  fetchCityList,
  fetchDistrictList,
  fetchTownList,
  fetchVillageList,
  fetchRoadList,
  fetchSectionList,
  fetchSuper,
} from '../../apis/2.0/addr'
import {
  fetchCityReport,
  fetchDistrictReport,
  fetchTownReport,
  fetchVillageReport,
  fetchRoadReport,
  fetchSectionReport,
} from '../../apis/2.0/newReport'
import {exportExcel} from '../../utils/exportExcel'
import {dateTimeTrans} from '../../utils/mrWang'

emits: ['handleItemChange']
let options = ref([])
let require = ref(null)
let myprops = ref()
let place = ref()
let searchTimeType = ref('日报')
let searchTime = ref(new Date())
let timeActive = ref('日报')
let data = ref([])
let allData = ref([])
const {proxy} = getCurrentInstance()
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
myprops = {
  label: 'name',
  value: 'message',
  checkStrictly: true,
  children: 'child',
  multiple: 'true'
}

const getList = async (type, zoneId) => {
  let place, newplace;
  if (type === 'district') {
    place = (await fetchDistrictList() || []).filter(value => value.pid == zoneId);
    newplace = place.map((item, index) => {
      return {
        name: item.district,
        message: {
          zoneId: item.zoneId,
          type: type,
          name: item.district
        },
        child: []
      }
    })
  } else if (type === 'town') {
    place = (await fetchTownList() || []).filter(value => value.pid == zoneId);
    newplace = place.map((item, index) => {
      return {
        name: item.town,
        message: {
          zoneId: item.zoneId,
          type: type,
          name: item.town
        },
        child: []
      }
    })
  } else if (type === 'village') {
    place = (await fetchVillageList() || []).filter(value => value.pid == zoneId);
    newplace = place.map((item, index) => {
      return {
        name: item.village,
        message: {
          zoneId: item.zoneId,
          type: type,
          name: item.village
        },
        child: []
      }
    })
  } else if (type === 'road') {
    place = (await fetchRoadList() || []).filter(value => value.pid == zoneId);
    newplace = place.map((item, index) => {
      return {
        name: item.road,
        message: {
          zoneId: item.zoneId,
          type: type,
          name: item.road
        },
        child: []
      }
    })
  } else if (type === 'section') {
    place = (await fetchSectionList() || []).filter(value => value.pid == zoneId);
    newplace = place.map((item, index) => {
      return {
        name: item.road,
        message: {
          zoneId: item.zoneId,
          type: type,
          name: item.section
        },
        child: null
      }
    })
  }
  console.log("newplace: ", newplace);
  return newplace;
}

const getNodes = async (val) => {
  if (!val) {
    let rawcity = [];
    rawcity = await fetchCityList();
    console.log("rawcity: ", rawcity);
    const city = rawcity.map((item, index) => {
      return {
        name: item.city,
        message: {
          zoneId: item.zoneId,
          type: "city",
          name: item.city
        },
        child: []
      }
    })
    console.log("city: ", city);
    options.value = city;
    console.log("options: ", options);
  } else if (val.length === 1) {
    options.value.map(async (item, index) => {
      if (item.message.zoneId === val[0].zoneId) {
        if (item.child.length === 0) {
          let district = await getList('district', item.message.zoneId)
          if (district.length === 0 ) {
            item.child = null;
          } else {
            item.child = [].concat(district)
          }
        }
      }
    })
    console.log("options: ", options.value)
  } else if (val.length === 2) {
    options.value.map(async (item, index) => {
      if (item.message.zoneId === val[0].zoneId) {
        item.child.map(async (item1) => {
          if (item1.message.zoneId === val[1].zoneId && item1.message.type === 'district') {
            if (item1.child.length === 0) {
              let town = await getList('town', val[1].zoneId)
              console.log("town: ", town)
              if (town.length === 0) {
                item1.child = null;
              } else {
                item1.child = [].concat(town)
              }
            }
          }
        })
      }
    })
  } else if (val.length === 3) {
    options.value.map(async (item, index) => {
      if (item.message.zoneId === val[0].zoneId) {
        item.child.map(async (item1) => {
          if (item1.message.zoneId === val[1].zoneId && item1.message.type === 'district') {
            item1.child.map(async (item2) => {
              if (item2.message.zoneId === val[2].zoneId) {
                if (item2.child.length === 0) {
                  let village = await getList('village', val[2].zoneId)
                  console.log("village: ", village)
                  if (village.length === 0) {
                    item2.child = null
                  } else {
                    item2.child = [].concat(village)
                  }
                }
              }
            })
          }
        })
      }
    })
  } else if (val.length === 4) {
    options.value.map(async (item, index) => {
      if (item.message.zoneId === val[0].zoneId) {
        item.child.map(async (item1) => {
          if (item1.message.zoneId === val[1].zoneId && item1.message.type === 'district') {
            item1.child.map(async (item2) => {
              if (item2.message.zoneId === val[2].zoneId) {
                item2.child.map(async (item3) => {
                  if (item3.message.zoneId === val[3].zoneId) {
                    if (item3.child.length === 0) {
                      let road = await getList('road', val[3].zoneId)
                      console.log("road", road)
                      if (road.length === 0) {
                        item3.child = null;
                      } else {
                        item3.child = [].concat(road)
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
  } else if(val.length===5){
    options.value.map(async (item, index) => {
      if (item.message.zoneId === val[0].zoneId) {
        item.child.map(async (item1) => {
          if (item1.message.zoneId === val[1].zoneId && item1.message.type === 'district') {
            item1.child.map(async (item2) => {
              if (item2.message.zoneId === val[2].zoneId) {
                item2.child.map(async (item3) => {
                  if (item3.message.zoneId === val[3].zoneId) {
                    item3.child.map(async (item4)=>{
                        if (item4.child.length === 0) {
                        let section = await getList('section', val[4].zoneId)
                        console.log("section", section)
                        if (section.length === 0) {
                          item4.child = null;
                        } else {
                          item4.child = [].concat(section)
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
    })
  }

}
const handleItemChange = async (val) => {
  console.log("点击的val", val)
  fetchMychoice()
  getNodes(val)//加速，非必要
}

function fetchMychoice() {//important
  let ineed = proxy.$refs.require.getCheckedNodes().map((item) => {
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
      label: searchTimeType.value + '阀门用水量(m³)',
      name: 'valveVolume',
      default: '0',
    },
    {
      label: searchTimeType.value + '消防栓用水量(m³)',
      name: 'hydrantVolume',
      default: '0',
    },
    {
      label: searchTimeType.value + '总用水量(m³)',
      name: 'totalVolume',
      default: '0',
    },
  ]
  excel.body = data.value
  excel.fileName = '区域统计报表'
  exportExcel(excel)
}

async function init() {
  let myData = ([1]).map(async (item) => {
    let valveVolume, hydrantVolume, totalVolume, type
    if (searchTimeType.value === '年报') {
      type = 'year'
    } else if (searchTimeType.value === '月报') {
      type = 'month'
    } else if (searchTimeType.value === '日报') {
      type = 'day'
    }
    const temp1 = await fetchCityReport({
      type: type,
      currentTime: dateTimeTrans(searchTime.value, searchTimeType.value),
    })
    temp1.map((item1) => {
      if (item1.id === 1) {
        valveVolume = item1.valveVolume
        hydrantVolume = item1.hydrantVolume
        totalVolume = item1.totalVolume
      }
    })
    return {
      place: "阜阳市",
      valveVolume: valveVolume,
      hydrantVolume: hydrantVolume,
      totalVolume: totalVolume,
    }
  })
  data.value = await Promise.all(myData)//important
}

async function search() {
  console.log("options", options)
  console.log("我的当前选择", fetchMychoice())
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  let myData = (fetchMychoice() || []).map(async (item) => {
    let valveVolume, hydrantVolume, totalVolume, type
    if (searchTimeType.value === '年报') {
      type = 'year'
    } else if (searchTimeType.value === '月报') {
      type = 'month'
    } else if (searchTimeType.value === '日报') {
      type = 'day'
    }
    if (item.type === 'city') {
      const temp1 = await fetchCityReport({
        type: type,
        currentTime: dateTimeTrans(searchTime.value, searchTimeType.value),
      })
      temp1.map((item1) => {
        if (item1.id === item.zoneId) {
          valveVolume = item1.valveVolume
          hydrantVolume = item1.hydrantVolume
          totalVolume = item1.totalVolume
        }
      })
    }  else if (item.type === 'district') {
      const temp1 = await fetchDistrictReport({
        type: type,
        currentTime: dateTimeTrans(searchTime.value, searchTimeType.value),
      })
      temp1.map((item1) => {
        if (item1.id === item.zoneId) {
          valveVolume = item1.valveVolume
          hydrantVolume = item1.hydrantVolume
          totalVolume = item1.totalVolume
        }
      })
    } else if (item.type === 'town') {
      const temp1 = await fetchTownReport({
        type: type,
        currentTime: dateTimeTrans(searchTime.value, searchTimeType.value),
      })
      temp1.map((item1) => {
        if (item1.id === item.zoneId) {
          valveVolume = item1.valveVolume
          hydrantVolume = item1.hydrantVolume
          totalVolume = item1.totalVolume
        }
      })
    } else if (item.type === 'village') {
      const temp1 = await fetchVillageReport({
        type: type,
        currentTime: dateTimeTrans(searchTime.value, searchTimeType.value),
      })
      temp1.map((item1) => {
        if (item1.id === item.zoneId) {
          valveVolume = item1.valveVolume
          hydrantVolume = item1.hydrantVolume
          totalVolume = item1.totalVolume
        }
      })
    } else if (item.type === 'road') {
      const temp1 = await fetchRoadReport({
        type: type,
        currentTime: dateTimeTrans(searchTime.value, searchTimeType.value),
      })
      temp1.map((item1) => {
        if (item1.id === item.zoneId) {
          valveVolume = item1.valveVolume
          hydrantVolume = item1.hydrantVolume
          totalVolume = item1.totalVolume
        }
      })
    }else if (item.type === 'section') {
      const temp1 = await fetchSectionReport({
        type: type,
        currentTime: dateTimeTrans(searchTime.value, searchTimeType.value),
      })
      temp1.map((item1) => {
        if (item1.id === item.zoneId) {
          valveVolume = item1.valveVolume
          hydrantVolume = item1.hydrantVolume
          totalVolume = item1.totalVolume
        }
      })
    }

    return {
      place: item.name,
      valveVolume: valveVolume,
      hydrantVolume: hydrantVolume,
      totalVolume: totalVolume,
    }
  })
  //console.log("测试测试",myData)
  data.value = await Promise.all(myData)//important
  console.log("测试测试",data.value)
  loadingInstance.close()
}

onMounted(async () => {
  const loadingInstance = ElLoading.service({fullscreen: true})
  // getNodes()
  const temp = await fetchSuper()
  options.value = temp
  init()
  loadingInstance.close()
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
    margin-left: 20px;
  }

  .search {
    position: relative;
    margin-left: 20px;

  }
}

.search-btn {
  display: flex;
  margin-left: 400px;
}

.p-body {
  margin-top: 10px;
}
</style>
