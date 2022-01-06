<template>
  <div class="basicInformation">
    <div class="BInfo">
      <div style="height: 8%"></div>
      <el-form :model="formData" label-width="120px">
        <div style="width: 100%;display: flex;flex-direction: row">
          <el-form-item label="阀栓名称" prop="valveName" style="width: 45%">
            <el-input v-model="formData.valveName"></el-input>
          </el-form-item>
          <el-form-item label="阀栓编号" prop="valveCode" style="width: 45%">
            <el-input v-model="formData.valveCode"></el-input>
          </el-form-item>
        </div>
        <div style="width: 100%;display: flex;flex-direction: row;margin-top: 2.5%">
          <el-form-item prop="address" label="所在位置" style="width: 45%">
            <el-select v-model="formData.zoneId" placeholder="Select">
              <el-option
                  v-for="item in addrList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  style="width: 100%"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="createTime" label="创建时间" style="width: 47%">
            <el-date-picker
                v-model="formData.createTime"
                type="datetime"
                placeholder="选择阀栓创建时间"
                style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div style="width: 100%;display: flex;flex-direction: row ;margin-top: 2.5%">
          <el-form-item label="经度" prop="longitude" style="width: 45%">
            <el-input v-model="formData.longitude"></el-input>
          </el-form-item>
          <el-form-item label="通讯编号" prop="comNumber" style="width: 45%">
            <el-input v-model="formData.comNumber"></el-input>
          </el-form-item>
        </div>
        <div style="width: 100%; display: flex;flex-direction: row ;margin-top: 2.5%">
          <el-form-item prop="latitude" label="纬度" style="width: 45%">
            <el-input v-model="formData.latitude"></el-input>
          </el-form-item>
          <el-form-item prop="valveType" label="阀栓类型" style="width: 45%">
            <el-select v-model="formData.valveType" placeholder="Select">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  style="width: 100%"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="width: 100%;display: flex;flex-direction: row;margin-top: 2.5%">
          <el-form-item prop="status" label="状态" style="width: 45%">
            <el-select v-model="formData.status" placeholder="Select">
              <el-option
                  v-for="item in statuss"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="applicantId" label="所属单位" style="width: 45%">
            <el-select v-model="formData.applicantId" placeholder="选择所属单位">
              <el-option
                  v-for="item in applicantList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="width: 100%;display: flex;flex-direction: row;margin-top: 2.5%">
          <el-form-item prop="meterCode" label="监测设备编号" style="width: 45%">
            <el-input disabled v-model="formData.meterCode"></el-input>
          </el-form-item>
          <el-form-item label="备注" style="width: 45%">
            <el-input v-model="input"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-footer style="text-align: center;margin-top: 2%">
        <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon-color="red"
            title="是否要保存修改?"
            @confirm="updateInfo"
        >
          <template #reference>
            <el-button size="medium" type="primary"  :disabled="buttonState">保存修改
            </el-button>
          </template>
        </el-popconfirm>
      </el-footer>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, onMounted} from 'vue'
import {fetchDetailData} from "./util/detailData";
import {fetchUpdateData} from "./util/updateData";
import {ElMessage} from 'element-plus'
import {
  fetchAuthority,
  fetchUsername
} from '../../utils/mrWang'
import {getApplicant} from "../applicantMgmt/util/ApplicantMgmt";
import {fetchSectionList} from "../../apis/2.0/addr";

let addrList = ref({})
let authority = ref('')
let buttonState = ref(false)//禁用按钮
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
let applicantList = ref([])

async function getApplicantList() {
  let res = await getApplicant()
  //console.log(res.data)
  applicantList.value = res.data.map(item => {
    return {
      value: item.applicantId,
      label: item.applicantName
    }
  })
  //console.log(applicantList)
}

onMounted(async () => {
  authority.value = fetchAuthority()
  if (authority.value === 'ROLE_ADMIN') {
    buttonState.value = false
  } else {
    buttonState.value = true
  }
  let res = await fetchDetailData(props.valve_id_end)
  if (res.code === '200') {
    formData.value = res.data;
  }
  let res1 = await fetchSectionList()
  //console.log(res1)
  addrList.value = res1.map(item=>{
    return{
      value:item.zoneId,
      label:item.section
    }
  })
  //console.log(formData.value)
  await getApplicantList()
})
let valveInfo = {}
const updateInfo = async function () {
  valveInfo.valveId = formData.value.valveId;
  valveInfo.valveCode = formData.value.valveCode;
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
  valveInfo.applicantId = formData.value.applicantId
  //console.log('ssdsasad', valveInfo.applicantId)
  const res = await fetchUpdateData(valveInfo)
  //console.log(res)
  //console.log(valveInfo)
  if (res.code === '200') {
    ElMessage({
      type: 'success',
      message: '操作成功！',
    })
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
  display: flex;
  flex-direction: column;
  top: 8%;
  left: 4.5%;
  width: 85%;
  height: 85%;
}
</style>
