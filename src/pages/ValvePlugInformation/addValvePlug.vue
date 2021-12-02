<template>
  <el-button type="success"
             style="margin-right: 10px"
             @click="add">添加
  </el-button>
  <el-dialog
      v-model="dialogVisible"
      title="填写阀栓信息"
      width="50%"
      :before-close="handleClose">
    <el-form ref="form" :model="formData" label-width="120px">
      <el-form-item label="阀栓名称">
        <el-col :span="9">
          <el-input v-model="formData.valveName" style="width: 190px"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="阀栓编号" style="margin-left: 350px;margin-top: -70px">
        <el-col :span="10">
          <el-input v-model="formData.valveCode" style="width: 190px"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="所在位置">
        <el-cascader
            v-model="place"
            :options="optionss"
            :props="myprops"
            ref="require"
            placeholder="选择地址"
            :show-all-levels="false"
            style="width: 120px"
            clearable></el-cascader>
      </el-form-item>
      <el-form-item label="阀栓创建时间" style="margin-left: 350px;margin-top: -60px">
        <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="formData.createTime"
            type="datetime"
            placeholder="选择阀栓创建时间"
            style="width: 190px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="经度">
        <el-col :span="9">
          <el-input v-model="formData.longitude" style=" width: 150px"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="通讯编号" style="margin-left: 350px;margin-top: -60px">
        <el-col :span="9">
          <el-input v-model="formData.comNumber" style="width: 190px"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="纬度">
        <el-col :span="9">
          <el-input v-model="formData.latitude" style=" width: 150px"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="阀栓类型" style="margin-left: 350px;margin-top: -60px">
        <el-select v-model="formData.valveType" placeholder="Select" style="width: 120px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formData.status" placeholder="Select" style="width: 140px">
          <el-option
              v-for="item in statuss"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责部门" style="margin-left: 350px;margin-top: -60px">
        <el-col :span="9">
          <el-input v-model="formData.applicantName" style="width: 190px"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="监测设备编号">
        <el-col :span="9">
          <el-input v-model="formData.meterCode" style=" width: 150px"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="备注" style="margin-left: 350px;margin-top: -60px">
        <el-col :span="9">
          <el-input v-model="formData.remark" style="width: 190px"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">

        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm"
        >确认添加</el-button
        >
      </span>
      <p style="font-size: 3px;color: red" >(注：除备注外其他项均不可为空)</p>
    </template>
  </el-dialog>
</template>

<script setup>
import {defineComponent, defineProps, onMounted, ref} from 'vue'
import {ElMessageBox} from 'element-plus'
import {fetInsertValveInfo} from "./util/vpinformation";
import {ElMessage} from 'element-plus'
import {fetchSuper} from '@/apis/2.0/addr'
import axios from "axios";

let dialogVisible = ref(false)
let formData = ref({});
let input = ref('')
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
  }
  else {
    return input.toString()
  }
}
const genTwoLengthNumberString = n => (n >= 10 ? n : '0' + n)
const timeSolve = function (time) {
  let timeString = ref('')
  timeString.value = timeString.value + time.getFullYear()+ '-'
  timeString.value = timeString.value +  genTwoLengthNumberString(time.getMonth()) + '-'
  timeString.value = timeString.value +  genTwoLengthNumberString(time.getDay()) + ' '
  timeString.value = timeString.value + time.toString().split(' ')[4]
  return timeString.value
}
const confirm = async function () {
  if(formData.value.comNumber&&formData.value.createTime&&formData.value.latitude
      &&formData.value.longitude &&formData.value.meterCode&&formData.value.applicantName
      &&formData.value.status&&formData.value.valveCode&&formData.value.valveName
      &&formData.value.valveType&&place.value.length>0) {
    valveInfo = {}
    valveInfo.zoneId = place.value[4].zoneId
    valveInfo.applicantName = stringJudge(formData.value.applicantName)
    valveInfo.comNumber = stringJudge(formData.value.comNumber)
    valveInfo.createTime = timeSolve(formData.value.createTime)
    valveInfo.latitude = parseFloat(formData.value.latitude)
    valveInfo.longitude = parseFloat(formData.value.longitude)
    valveInfo.meterCode = stringJudge(formData.value.meterCode)
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
  }
  else {
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

const handleClose = (done) => {
  ElMessageBox.confirm('是否要退出编辑？')
  .then(() => {
    done()
  })
  .catch(() => {
    // catch error
  })
}
onMounted(async ()=>{
  optionss.value = await fetchSuper()
})
</script>

<style scoped>
.red{
  position: relative;
  color: red;
  font-size: 10px;
  left: -10px;
}
</style>