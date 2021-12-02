<template>
  <div class="p-page2">
    <div class="p2-header">
      <p class="page2-name">巡视安排</p>
      <addr-select class="addrSelect2"></addr-select>
      <el-col :span="8">
        <el-input class="checkPeople" v-model="input" placeholder="请输入巡视人姓名"/>
      </el-col>
      <div class="vblock">
        <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="Start date"
            end-placeholder="End date"
        >
        </el-date-picker>
      </div>
      <div class="button2">
        <el-button v-model="search" type="primary">查询</el-button>
        <el-button type="info">重置</el-button>
        <el-button type="primary">导出</el-button>
      </div>
    </div>
    <el-scrollbar class="data-chart2">
      <el-table
          :data=tableData
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
      >
        <el-table-column label="任务编号" prop="id" width="120px"/>
        <el-table-column label="道路" prop="zoneName" width="120px"/>
        <el-table-column label="巡视人" prop="people" width="120px"/>
        <el-table-column label="电话号码" prop="phone" width="200px"/>
        <el-table-column label="巡视时间" prop="time" width="200px"/>
        <el-table-column label="状态" prop="complete" :formatter="statusFormate" width="200px"/>
        <el-table-column label="备注" prop="remark" width="200px"/>
        <el-table-column fixed="right" label="操作" width="360">
          <template #default="scope">
            <el-button>修改</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {
  fetchCheckInfo,
  fetchCheckInfoByConfig,
  changeCheck,
  deleteCheck,
  addCheck,
  updateCheck
} from '../../apis/2.0/newCheck'
</script>

<style lang="scss" scoped>
.p-page2 {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0;
}

.addrSelect2 {
  position: relative;
  top: 3px;
  margin-left: -25px;
}

.p2-header {
  background-color: #219ded0d;
  width: 100%;
  height: 100px;
  border: 1px solid #219ded0f;
}

.page2-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  position: relative;
}

.checkPeople {
  position: relative;
  top: 3px;
  left: 410px;
}

.vblock {
  position: relative;
  top: -37px;
  left: 625px;
}

.button2 {
  position: relative;
  margin-top: -77px;
  margin-left: 1035px;
  width: 260px;
}

.data-chart2 {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
</style>