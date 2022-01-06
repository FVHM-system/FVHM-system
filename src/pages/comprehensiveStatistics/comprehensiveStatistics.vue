<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">月度综合统计</p>
      <div class="op-flex" style="position:absolute;right:170px;top:30px">
        <div>
          <el-date-picker
              v-model="searchTime"
              type="month"
              value-format="YYYY-MM"
              placeholder="选择某月"
              class="search"
              style="width: 200px"
              v-if="searchTimeType = '月报'"
          ></el-date-picker>
        </div>
        <el-button type="primary" class="search-btn" @click="search">查询</el-button>
      </div>
    </div>
    <div class="p-body" id="box">
      <el-scrollbar>
        <el-table
            :data="data"
            :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="margin-top:10px;width: 100%" size="medium" :height="tableHeight" empty-text=" " stripe
            row-key="id"
            :key="fresh"
            lazy
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :load="load"
        >
          <el-table-column prop="name" label="行政区域" width="340" ></el-table-column>
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
import {ElLoading} from 'element-plus'
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
import dayjs from 'dayjs'

let searchTime = ref(dayjs(new Date()).format('YYYY-MM'))
let searchTimeType = ref('月报')
let data = ref([])
let tableHeight = window.innerHeight - 240

const load = async (tree, treeNode, resolve) => {
  let r1 = [], r2 = [], r3 = [], r4 = [], r5 = []
  let res
  if (tree.type === 'city') {
    //区县
    const district = (await fetchDistrictList() || []).filter(item => item.pid == tree.zoneId)
    res = (await fetchMonthDistrict({
      month: searchTime.value,
      list: district.map(item => {
        return item.zoneId;
      }),
    }))
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
  }
  if (tree.type == 'district') {
    //乡镇
    const town = (await fetchTownList() || []).filter(item => item.pid == tree.zoneId)
    res = (await fetchMonthTown({
      month: searchTime.value,
      list: town.map(item => {
        return item.zoneId;
      }),
    }))
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
  }
  if (tree.type == 'town') {
    //村庄
    const village = (await fetchVillageList() || []).filter(item => item.pid == tree.zoneId)
    res = (await fetchMonthVillage({
      month: searchTime.value,
      list: village.map(item => {
        return item.zoneId;
      }),
    }))
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
  }
  if (tree.type == 'village') {
    //道路
    const road = (await fetchRoadList() || []).filter(item => item.pid == tree.zoneId)
    res = (await fetchMonthRoad({
      month: searchTime.value,
      list: road.map(item => {
        return item.zoneId;
      }),
    }))
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
  }
  if (tree.type == 'road') {
    //路段
    const section = (await fetchSectionList() || []).filter(item => item.pid == tree.zoneId)
    res = (await fetchMonthSection({
      month: searchTime.value,
      list: section.map(item => {
        return item.zoneId;
      }),
    }))
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
  }
  resolve([].concat(r2).concat(r3).concat(r4).concat(r5).concat(r1))

}

async function search() {
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: true})
  let city = []
  city = await fetchCityList()

  const res = await fetchMonthCity({
    month: searchTime.value,
    list: city.map(item => {
      return item.zoneId;
    }),
  })
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
  data.value = r
  loadingInstance.close()
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
