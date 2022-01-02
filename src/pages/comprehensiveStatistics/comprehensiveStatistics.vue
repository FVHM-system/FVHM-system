<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">月度综合统计</p>
      <div class="op-flex">
        <div>
          <el-date-picker
              v-model="searchTime"
              type="month"
              placeholder="选择某月"
              class="search"
              style="width: 200px"
              v-if="searchTimeType = '月'"
          ></el-date-picker>
        </div>
        <el-button type="primary" class="search-btn" @click="search">查询</el-button>
      </div>
    </div>
    <div class="p-body">
      <el-scrollbar>
        <el-table
            border
            highlight-current-row
            :data="data"
            :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :row-style="{fontSize:'17px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
            style="width: 100%"
            height="520"
            row-key="id"
            :key="fresh"
            lazy
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :load="load"
        >
          <el-table-column prop="name" label="行政区域" min-width="260" ></el-table-column>
          <el-table-column prop="planVolume" label="计划用水量(m³)" min-width="200"></el-table-column>
          <el-table-column prop="licenseVolume" label="许可用水量(m³)"
                           min-width="200"></el-table-column>
          <el-table-column prop="valveVolume" label="阀门用水量(m³)" min-width="200"></el-table-column>
          <el-table-column prop="hydrantVolume" label="消防栓用水量(m³)"
                           min-width="200"></el-table-column>
          <el-table-column prop="totalVolume" label="总用水量(m³)" min-width="200"></el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import {
  fetchMonthCity,
  fetchMonthTown,
  fetchMonthDistrict,
  fetchMonthVillage,
  fetchMonthRoad,
  fetchMonthSection,
} from '../../apis/2.0/newMonth'
import {
  fetchCityList,
  fetchDistrictList,
  fetchTownList,
  fetchVillageList,
  fetchRoadList,
  fetchSectionList,
} from '../../apis/2.0/addr'
import {dateTimeTrans} from '../../utils/mrWang'

let searchTime = ref(new Date())
let searchTimeType = ref('月')
let data = ref([])

const load = async (tree, treeNode, resolve) => {
  let r1 = [], r2 = [], r3 = [], r4 = [], r5 = []
  let res
  if (tree.type === 'city') {
    //区县
    const district = (await fetchDistrictList() || []).filter(item => item.pid == tree.zoneId)
    console.log("district: ", district)
    res = (await fetchMonthDistrict({
      month: dateTimeTrans(searchTime.value, searchTimeType.value),
      list: district.map(item => {
        return item.zoneId;
      }),
    }))
    console.log("res: ", res)
    r2 = res.map((item, index) => {
      return {
        ...item,
        zoneId: district[index].zoneId,
        name: district[index].district,
        hasChildren: true,
        type: 'district',
        id: 'district' + district[index].zoneId,
      }
    })
    console.log("r2: ", r2)
  }
  if (tree.type == 'district') {
    //乡镇
    const town = (await fetchTownList() || []).filter(item => item.pid == tree.zoneId)
    console.log("town: ", town)
    res = (await fetchMonthTown({
      month: dateTimeTrans(searchTime.value, searchTimeType.value),
      list: town.map(item => {
        return item.zoneId;
      }),
    }))
    console.log("res: ", res)
    r3 = res.map((item, index) => {
      return {
        ...item,
        zoneId: town[index].zoneId,
        name: town[index].town,
        hasChildren: true,
        type: 'town',
        id: 'town' + town[index].zoneId,
      }
    })
    console.log("r3: ", r3)
  }
  if (tree.type == 'town') {
    //村庄
    const village = (await fetchVillageList() || []).filter(item => item.pid == tree.zoneId)
    console.log("village: ", village)
    res = (await fetchMonthVillage({
      month: dateTimeTrans(searchTime.value, searchTimeType.value),
      list: village.map(item => {
        return item.zoneId;
      }),
    }))
    console.log("res: ", res)
    r4 = res.map((item, index) => {
      return {
        ...item,
        zoneId: village[index].zoneId,
        name: village[index].village,
        hasChildren: true,
        type: 'village',
        id: 'village' + village[index].zoneId,
      }
    })
    console.log("r4: ", r4)
  }
  if (tree.type == 'village') {
    //道路
    const road = (await fetchRoadList() || []).filter(item => item.pid == tree.zoneId)
    console.log("road: ", road)
    res = (await fetchMonthRoad({
      month: dateTimeTrans(searchTime.value, searchTimeType.value),
      list: road.map(item => {
        return item.zoneId;
      }),
    }))
    console.log("res: ", res)
    r5 = res.map((item, index) => {
      return {
        ...item,
        zoneId: road[index].zoneId,
        name: road[index].road,
        hasChildren: true,
        type: 'road',
        id: 'road' + road[index].zoneId,
      }
    })
    console.log("r5: ", r5)
  }
  if (tree.type == 'road') {
    //路段
    const section = (await fetchSectionList() || []).filter(item => item.pid == tree.zoneId)
    console.log("section: ", section)
    res = (await fetchMonthSection({
      month: dateTimeTrans(searchTime.value, searchTimeType.value),
      list: section.map(item => {
        return item.zoneId;
      }),
    }))
    console.log("res: ", res)
    r1 = res.map((item, index) => {
      return {
        ...item,
        zoneId: section[index].zoneId,
        name: section[index].section,
        hasChildren: false,
        type: 'section',
        id: 'section' + section[index].zoneId,
      }
    })
    console.log("r1: ", r1)
  }
  resolve([].concat(r2).concat(r3).concat(r4).concat(r5).concat(r1))

}

async function search() {

  let city = []
  city = await fetchCityList()
  console.log("city: ", city)

  const res = await fetchMonthCity({
    month: dateTimeTrans(searchTime.value, searchTimeType.value),
    list: city.map(item => {
      return item.zoneId;
    }),
  })
  console.log("res: ", res)
  const n = Date.now()
  const r = res.map((item, index) => {
    return {
      ...item,
      zoneId: city[index].zoneId,
      name: city[index].city,
      hasChildren: true,
      type: 'city',
      id: 'city' + city[index].zoneId + n,
    }
  })
  console.log("r: ", r)
  data.value = r

}

onMounted(async () => {
  search()

})
</script>

<style lang="scss" scoped>
.op-flex {
  display: flex;
  position: relative;
  top: 0px;
  right: -1000px;
  width: 150px;

}

.search-btn {
  display: flex;
  margin-left: 10px;
}

.p-body {
  margin-top: 10px;
}
</style>
