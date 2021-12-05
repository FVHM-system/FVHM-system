<template>
  <div class="basicInformation">
    <div class="BInfo">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="阀栓名称" prop="valveName"
                      style="position:relative; left:-10px; top: 60px">
          <el-col :span="9">
            <el-input v-model="formData.valveName" style="width: 190px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="所在位置" style="position:relative; left:-10px; top: 70px">
          <el-col :span="9">
            <el-input v-model="formData.address" style="width: 190px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="经度" style="position:relative; left:-10px; top: 80px;">
          <el-col :span="9">
            <el-input v-model="formData.longitude" style=" width: 150px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="纬度" style="position:relative; left:-10px; top: 90px">
          <el-col :span="9">
            <el-input v-model="formData.latitude" style=" width: 150px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" style="position:relative; left:-10px; top: 100px">
          <el-select v-model="formData.status" placeholder="Select"
                     style="position: relative;left: -213px;width: 120px">
            <el-option
                v-for="item in statuss"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监测设备编号" style="position:relative; left:-10px; top: 110px">
          <el-col :span="9">
            <el-input v-model="formData.meterCode" style=" width: 150px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="阀栓编号" style="position:relative; left:300px; top: -310px">
          <el-col :span="9">
            <el-input v-model="formData.valveCode" style="width: 190px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="阀栓创建时间" style="position:relative; left:300px; top: -300px">
          <el-date-picker
              v-model="formData.createTime"
              type="datetime"
              placeholder="选择阀栓创建时间"
              style="position: relative;left: -177px; width: 190px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="通讯编号" style="position:relative; left:300px; top: -290px">
          <el-col :span="9">
            <el-input v-model="formData.comNumber" style="width: 190px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="阀栓类型" style="position:relative; left:300px; top: -280px">
          <el-select v-model="formData.valveType" placeholder="Select"
                     style="position: relative;left: -213px;width: 120px">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责部门" style="position:relative; left:300px; top: -270px">
          <el-col :span="9">
            <el-input v-model="formData.applicantName" style="width: 190px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" style="position:relative; left:300px; top: -260px">
          <el-col :span="9">
            <el-input v-model="input" style="width: 190px"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item style="position:relative; left:-60px; top: -275px">
          <el-button size="medium" type="primary" @click="updateInfo">保存修改</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, onMounted} from 'vue'
import {fetchDetailData} from "./util/detailData";
import {fetchUpdateData} from "./util/updateData";
import {ElMessage} from 'element-plus'

let formData = ref([]);
let options = ref([
  {
    value: 1,
    label: '阀门',
  },
  {
    value: 2,
    label: '消防栓',
  }
])
const statuss = [
  {
    value: 1001,
    label: '正常运行',
  },
  {
    value: 1002,
    label: '尚未安装',
  },
  {
    value: 1003,
    label: '已经停用',
  },
  {
    value: 4444,
    label: '正在报警',
  },
]
onMounted(async () => {
  let res = await fetchDetailData(props.valve_id_end)
  if (res.code === '200') {
    formData.value = res.data;
  }
  console.log(formData.value)
})
let valveInfo = {}
const updateInfo = async function () {
  valveInfo.valveId = formData.value.valveId;
  valveInfo.valveCode = formData.value.valveCode;
  valveInfo.zoneType = 2;
  valveInfo.valveType = formData.value.valveType;
  valveInfo.valveName = formData.value.valveName;
  valveInfo.zoneId = formData.value.zoneId;
  valveInfo.zoneName = formData.value.zoneName;
  valveInfo.longitude = formData.value.longitude;
  valveInfo.latitude = formData.value.latitude;
  valveInfo.status = formData.value.status;
  valveInfo.createTime = formData.value.createTime;
  valveInfo.remark = formData.value.remark;
  valveInfo.meterCode = formData.value.meterCode;
  valveInfo.comNumber = formData.value.comNumber;
  const res = await fetchUpdateData(valveInfo)
  console.log(res)
  console.log(valveInfo)
  if (res.code === '200') {
    ElMessage({
      type: 'success',
      message: '操作成功！',
    })
    // ElLoading.service(options)
    location.reload()

  }
}
const props = defineProps({
  valve_id_end: Number,
  valve_change_end: Boolean,
})
</script>

<style>
.basicInformation {
  background-color: #F8F8F8;
  position: relative;
  top: -15px;
  left: -15px;
  width: 51vw;
  height: 85vh;
}

.BInfo {
  background-color: white;
  position: relative;
  top: 8%;
  left: 4.5%;
  width: 85%;
  height: 80%;
}
</style>