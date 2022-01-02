<template>
  <el-button type="success"
             style="margin-right: 10px"
             @click="add"
             :disabled="buttonState"
  >添加
  </el-button>
  <el-dialog
      v-model="dialogVisible"
      title="填写阀栓信息"
      width="50%"
      :before-close="handleClose">
    <el-form :model="formData" label-width="120px">
      <div style="display: flex;flex-direction: row">
      <el-form-item label="阀栓名称" >
          <el-input v-model="formData.valveName" style="width: 190px"></el-input>
      </el-form-item>
      <el-form-item label="阀栓编号">
          <el-input v-model="formData.valveCode" style="width: 190px"></el-input>
      </el-form-item>
      </div>
      <div style="margin-top:10px;display: flex;flex-direction: row">
      <el-form-item label="所在位置">
        <el-cascader
            v-model="place"
            :options="optionss"
            :props="myprops"
            ref="require"
            placeholder="选择地址"
            :show-all-levels="false"
            style="width: 190px"
            clearable></el-cascader>
      </el-form-item>
      <el-form-item label="阀栓创建时间" >
        <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="formData.createTime"
            type="datetime"
            placeholder="选择阀栓创建时间"
            style="width: 190px"
        >
        </el-date-picker>
      </el-form-item>
      </div>
      <div style="display: flex;margin-top:10px;flex-direction: row;">
      <el-form-item label="经度">
          <el-input v-model="formData.longitude" style="width: 150px"></el-input>
      </el-form-item>
        <el-form-item label="通讯编号" style="margin-left: 40px">
          <el-input v-model="formData.comNumber" style="width: 190px"></el-input>
        </el-form-item>
      </div>
      <div style="display: flex;margin-top:10px;flex-direction: row">
      <el-form-item label="纬度">
          <el-input v-model="formData.latitude" style=" width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="阀栓类型" style="margin-left: 40px;">
        <el-select v-model="formData.valveType" placeholder="选择类型" style="width: 120px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      </div>
      <div style="display: flex;margin-top:10px;flex-direction: row">
      <el-form-item label="状态">
        <el-select v-model="formData.status" placeholder="选择状态" style="width: 140px">
          <el-option
              v-for="item in statuss"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属单位" style="margin-left: 50px;">
        <el-select v-model="formData.applicantName" placeholder="选择所属单位" style="width: 190px">
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
      <div style="display: flex;margin-top:10px;flex-direction: row">
      <el-form-item label="备注" >
          <el-input v-model="formData.remark" style="width: 190px"></el-input>
      </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">

        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm"
        >确认添加</el-button
        >
      </span>
      <p style="font-size: 3px;color: red">(注：除备注外其他项均不可为空)</p>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref} from 'vue'
import {ElMessageBox} from 'element-plus'
import {fetInsertValveInfo} from "./util/vpinformation";
import {ElMessage} from 'element-plus'
import {fetchSuper} from '../../apis/2.0/addr'
import axios from "axios";
import {
  fetchAuthority ,
  fetchUsername
} from '../../utils/mrWang'
import {getApplicant} from "../applicantMgmt/util/ApplicantMgmt";

let authority=ref('')
let buttonState=ref(false)//禁用按钮
let dialogVisible = ref(false)
let formData = ref({});
let input = ref('')
let applicantList = ref([])
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
let place = ref()
let myprops = ref()
myprops = {
  label: 'name',
  value: 'message',
  children: 'child',
}
let optionss = ref([])
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
const add = function () {
  dialogVisible.value = true
}
let valveInfo
const stringJudge = function (input) {
  if (!input) {
    return ''
  } else {
    return input.toString()
  }
}
const genTwoLengthNumberString = n => (n >= 10 ? n : '0' + n)
const timeSolve = function (time) {
  let timeString = ref('')
  timeString.value = timeString.value + time.getFullYear() + '-'
  timeString.value = timeString.value + genTwoLengthNumberString(time.getMonth()+1) + '-'
  timeString.value = timeString.value + genTwoLengthNumberString(time.getDate()) + ' '
  timeString.value = timeString.value + time.toString().split(' ')[4]
  return timeString.value
}
const confirm = async function () {
  if (formData.value.comNumber && formData.value.createTime && formData.value.latitude
      && formData.value.longitude  && formData.value.applicantName
      && formData.value.status && formData.value.valveCode && formData.value.valveName
      && formData.value.valveType && place.value.length > 0) {
    valveInfo = {}
    valveInfo.zoneId = place.value[4].zoneId
    valveInfo.applicantName = stringJudge(formData.value.applicantName)
    valveInfo.comNumber = stringJudge(formData.value.comNumber)
    valveInfo.createTime = timeSolve(formData.value.createTime)
    valveInfo.latitude = parseFloat(formData.value.latitude)
    valveInfo.longitude = parseFloat(formData.value.longitude)
    valveInfo.remark = stringJudge(formData.value.remark)
    valveInfo.status = formData.value.status
    valveInfo.valveCode = stringJudge(formData.value.valveCode)
    valveInfo.valveId = 0
    valveInfo.zoneType = 2
    valveInfo.valveName = stringJudge(formData.value.valveName)
    valveInfo.valveType = formData.value.valveType
    console.log(valveInfo)
    valveInfo = JSON.stringify(valveInfo)
    console.log(timeSolve(formData.value.createTime))
    console.log(place)
    let res = await fetInsertValveInfo(valveInfo)
    console.log(res.code)
    console.log(res)
    if (res.code === '200') {
      ElMessage({
        type: 'success',
        message: '操作成功！',
      })
      dialogVisible.value = false
      location.reload()
    }
  } else {
    ElMessage({
      type: 'error',
      message: '未填写完整数据！',
    })
  }
}

function dateTimeTrans(d) {
  if (typeof d === 'string') {
    return d
  }
  if (!d) {
    return ''
  }
}
async function getApplicantList() {
  let res = await getApplicant()
  console.log(res.data)
  applicantList.value = res.data.map(item=>{
    return {
      value:item.applicantId,
      label:item.applicantName
    }
  })
  console.log(applicantList)
}



const handleClose = (done) => {
  ElMessageBox.confirm('是否要退出编辑？')
  .then(() => {
    done()
  })
  .catch(() => {
    // catch error
  })
}
onMounted(async () => {
  authority.value=fetchAuthority()
  if(authority.value==='ROLE_ADMIN'){
    buttonState.value=false
  }else{
    buttonState.value=true
  }
  optionss.value = await fetchSuper()
  await getApplicantList()
})
</script>

<style scoped>
.red {
  position: relative;
  color: red;
  font-size: 10px;
  left: -10px;
}
</style>
