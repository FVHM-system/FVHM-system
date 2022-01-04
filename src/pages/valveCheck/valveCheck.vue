<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">巡视安排</p>
      <div style="position:absolute;right:-32px;top:30px">
      <el-input v-model="input1" placeholder="请输入巡视人" style="margin-left: 170px;margin-top:3px;width: 150px"/>

      <el-select v-model="input2" placeholder="选择状态" style="margin-left:10px;width: 120px;margin-top: 3px">
        <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="button-group" style="margin-left:460px">
        <el-button v-model="search" type="primary" @click="dataSearch" >查询</el-button>
        <el-button type="success" @click="addModal.open()" :disabled="buttonState">新增</el-button>
        <el-button type="info" @click="reload">重置</el-button>
        <el-button type="primary" @click="exportCSV">导出</el-button>
      </div>
      </div>
    </div>
    <div class="data-chart2" id="box">
        <el-table
            :data=tableData
            :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
          :height="tableHeight"
        >
          <!-- <el-table-column label="任务编号" prop="taskId" width="120px"/> -->
          <el-table-column label="巡视人" prop="people" min-width="120px"/>
          <el-table-column label="电话号码" prop="phone" min-width="200px"/>
          <!-- <el-table-column label="完成状态" prop="complete"  width="200px">

          </el-table-column> -->
          <el-table-column label="完成状态"  min-width="200px">
            <template #default="scope">
              <el-progress type="circle" width="50" :percentage="scope.row.complete*100" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="200px"/>
          <el-table-column label="任务时间" prop="inspectTime" min-width="200px"/>
          <el-table-column label="备注" prop="remark" min-width="200px"/>
          <el-table-column fixed="right" label="操作" min-width="300">
            <template #default="scope">
              <el-button type="primary" @click="editModal.open(scope.row)" :disabled="buttonState">编辑</el-button>
              <el-button type="primary" @click="detailModal.open(scope.row)">详情</el-button>
              <el-button type="danger" @click="myFunc.delete(scope.row)" :disabled="buttonState">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
  </div>
  <el-dialog v-model="editState" :title="modalTitle"  center>
        <el-form :model="addForm" label-width="100px" :inline="false">
        <el-form-item label="巡视人" required>
            <el-select v-model="addForm.peopleId" clearable style="width: 330px" placeholder="请选择">
            <el-option v-for="item in peopleList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="任务时间" >
            <el-date-picker
                    v-model="addForm.inspectTime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    type="datetime"
                    placeholder="请选择"
                    >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" >
            <el-input v-model="addForm.remark" style="width: 360px"></el-input>
        </el-form-item>
        </el-form>
        <template #footer>
        <el-button type="primary" class="search-btn" @click="modal.submit()">保存</el-button>
        <el-button @click="modal.cancel()">取消</el-button>
        </template>
   </el-dialog>
  <el-dialog v-model="detailState" :title="modalTitle"  center width="65%">
    <el-button type="primary" class="detail-btn" @click="valveDetail.detailAdd()" :disabled="buttonState">新增任务阀栓</el-button>
    <el-table
      :data="taskData"
      :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      :row-style="{fontSize:'14px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
      style="width: 100%"
      height="350"
    >
      <el-table-column label="阀栓编号" prop="valveId" width="60px" />
      <el-table-column label="阀栓名" prop="valveName" width="150px"/>
      <el-table-column label="地址" prop="address" width="180px"/>
      <el-table-column label="完成状态" prop="complete" width="60px">
         <template #default="scope">
              <el-progress type="circle" width="50" v-if="scope.row.complete*100===100" :percentage="scope.row.complete*100" status="success"/>
              <el-progress type="circle" width="50" v-if="scope.row.complete*100===0" :percentage="scope.row.complete*100+100" status="exception"/>
         </template>
      </el-table-column>>
      <el-table-column label="完成时间" prop="completeTime" width="160px"/>
      <el-table-column label="备注" prop="remark" width="120px"/>
      <el-table-column  label="操作" width="180px">
            <template #default="scope">
              <el-button type="primary" @click="valveDetail.detailEdit(scope.row)" >编辑</el-button>
              <el-button type="danger" @click="valveDetail.detailDelete(scope.row)" :disabled="buttonState">删除</el-button>
            </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <el-dialog v-model="editDetailState" title="编辑"  center>
        <el-form :model="detailForm" label-width="100px" :inline="false">
        <el-form-item label="完成状态" required>
            <el-select v-model="detailForm.complete" clearable style="width: 330px" placeholder="请选择">
            <el-option v-for="item in status" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="完成时间" required>
            <el-date-picker
                    v-model="detailForm.completeTime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    type="datetime"
                    placeholder="请选择"
                    >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" >
            <el-input v-model="detailForm.remark" style="width: 360px"></el-input>
        </el-form-item>
        </el-form>
        <template #footer>
        <el-button type="primary" class="search-btn" @click="valveDetail.submitEdit()">保存</el-button>
        <el-button @click="valveDetail.detailCancel()">取消</el-button>
        </template>
   </el-dialog>
   <el-dialog v-model="missionValveState" title="新增任务阀栓"  center>
        <el-form :model="addForm" label-width="100px" :inline="false">
        <el-form-item label="选择阀栓" required>
            <el-cascader
            v-model="place"
            :options="options"
            :props="myprops"
            :show-all-levels="false"
            ref="require"
            placeholder="选择阀栓"
            @expand-change="handleItemChange"
            collapse-tags="true"
            style="left: 100px;width: 220px"
            clearable/>
        </el-form-item>

        </el-form>
        <template #footer>
        <el-button type="primary" class="search-btn" @click="valveDetail.submitAdd()">保存</el-button>
        <el-button @click="valveDetail.detailCancel()">取消</el-button>
        </template>
   </el-dialog>
   <el-dialog v-model="modalState" title="新增任务"  center>
        <el-form :model="addForm" label-width="100px" :inline="false">

        <el-form-item label="选择阀栓" required>
            <el-cascader
            v-model="place"
            :options="options"
            :props="myprops"
            :show-all-levels="false"
            ref="require"
            placeholder="选择阀栓"
            @expand-change="handleItemChange"
            collapse-tags="true"
            style="left: 100px;width: 220px"
            clearable/>
        </el-form-item>
        <el-form-item label="选择巡视人" required>
            <el-select v-model="addForm.peopleId" clearable style="left: 100px;width: 220px" placeholder="请选择">
            <el-option v-for="item in peopleList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="任务时间" >
            <el-date-picker
                    v-model="addForm.inspectTime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    type="datetime"
                    placeholder="请选择"
                    style="left:100px"
                    >
            </el-date-picker>
        </el-form-item>

        </el-form>
        <template #footer>
        <el-button type="primary" class="search-btn" @click="addModal.submit()">保存</el-button>
        <el-button @click="addModal.cancel()">取消</el-button>
        </template>
   </el-dialog>
</template>

<script setup>
import{ElLoading} from 'element-plus'
import { onMounted, ref,  reactive, computed} from 'vue'
import { exportExcel } from '../../utils/exportExcel'
import {
    fetchCheckInfo,
    fetchCheckInfoByConfig,
    deleteCheck,
    addCheck,
    updateCheck,
    fetchCheckDetail,
    changeDetail,
    fetchPeopleList,
    addMissionValves,
    deleteMissionValves,
} from '../../apis/2.0/newCheck'
import {
  fetchRoadList,
  fetchSuperWithValves,
} from '../../apis/2.0/addr'
import { ElMessageBox, ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import {
  fetchAuthority ,
  fetchUsername
} from '../../utils/mrWang'
const status = [
  {
    value: 1,
    label: '已完成',
  },
  {
    value: 0,
    label: '未完成',
  },
]
let input1 = ref('')
let input2 = ref('')
let value1 = ref('')
let authority=ref('')
let tableData = ref([])
let tempData = ref([])
let taskData=ref([])
let options = ref([])
let place = ref([])
//place.value
let buttonState=ref(false)//禁用按钮
let editState = ref(false)
let detailState=ref(false)
let modalState=ref(false)
let editDetailState=ref(false)
let missionValveState=ref(false)
let roadList=ref([])
let mode=ref('')
let modal = ref()
let peopleList=ref([])
let tableHeight = window.innerHeight - 230
let modalTitle = computed(() => {
    let res
    if (mode.value === 'add') {
      res = '新增巡视任务'
    } else if (mode.value === 'edit') {
      res = '编辑巡视任务'
    } else if(mode.value==='detail'){
      res='任务详情'
    }
    return res
  })
let myprops = {
  label: 'name',
  value: 'message',
  checkStrictly: false,//是否能选择任意一级选项
  children: 'child',
  multiple: 'true'
}
const addForm = reactive({
    taskId: '',
    peopleId:'',
    people: '',
    phone: '',
    createTime: '',
    inspectTime:'',
    complete: '',
    remark:'',
    valveIds: [],
  })
const detailForm = reactive({
  id:'',
  complete: '',
  completeTime: '',
  remark:''
})



const valveDetail={
    async detailAdd(){
      missionValveState.value=true
    },
    async detailEdit(item){
      editDetailState.value=true
      detailForm.id=item.id
      detailForm.complete=item.complete
      detailForm.completeTime=item.completeTime
      detailForm.remark=item.remark
    },
    async detailDelete(item){
      ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                const r = await deleteMissionValves({ id: item.id })
                if (r.code === '200') {
                    const res1=await fetchCheckDetail({taskId: addForm.taskId})//刷新表格数据
                    taskData.value=res1.data
                    ElMessage({
                    type: 'success',
                    message: '删除成功!',
                    })
                }
                })
                .catch(() => {})
    },
    detailCancel(){
      editDetailState.value=false
      missionValveState.value=false
    },
    async submitEdit(){
      console.log("id",detailForm.id)
      console.log("完成状态",detailForm.complete)
      console.log("完成时间",dayjs(detailForm.completeTime).format('YYYY-MM-DD HH:mm:ss'))
      console.log("备注",detailForm.remark)
      if (!detailForm.id||!detailForm.completeTime) {
        ElMessage({
            type: 'info',
            message: '必要信息不能为空',
        })
        return
      }
      const r=await changeDetail({
        id:detailForm.id,
        complete:detailForm.complete,
        remark:detailForm.remark,
        completeTime:dayjs(detailForm.completeTime).format('YYYY-MM-DD HH:mm:ss'),
      })
      if (r.code === '200') {
        ElMessage({
          type: 'success',
          message: '操作成功!',
        })
        const res1=await fetchCheckDetail({taskId: addForm.taskId})//刷新表格数据
        taskData.value=res1.data
      }
      myFunc.search()
      this.detailCancel()
    },
    async submitAdd(){
      console.log("我的选择",place.value)
      let myData=place.value.map(item=>{
        let myId
        let temp=item.map(item1=>{
          if(item1.type==='hydrant'||item1.type==='valve'){
            myId=item1.zoneId
          }
        })
        return myId
      })
      console.log("阀栓id",myData)
      console.log("taskId",addForm.taskId)
      const r=await addMissionValves({
        taskId:addForm.taskId,
        valveIds:myData,
        })
        if(r.code==='200'){
          ElMessage({
            type: 'success',
            message: '操作成功!',
          })
          const res1=await fetchCheckDetail({taskId: addForm.taskId})//刷新表格数据
          taskData.value=res1.data
        }
      myFunc.search()
      place.value=[]
      this.detailCancel()
    },
}

async function exportCSV() {
    const excel = {}
    excel.props = [
      // {
      //   label: '任务编号',
      //   name: 'taskId',
      // },
      {
        label: '巡视人',
        name: 'people',
      },
      {
        label: '电话号码',
        name: 'phone',
      },
      {
        label: '完成状态',
        name: 'complete',
        default: '0',
      },
      {
        label:'创建时间',
        name:'createTime',
      },
      {
        label: '任务时间',
        name: 'inspectTime',
      },
      {
        label: '备注',
        name: 'remark',
      },
    ]
    let temp=await fetchCheckInfo()
    temp.data.map(item=>{
        item.complete=item.complete*100+'%'
    })
    excel.body = temp.data
    excel.fileName = '巡视任务表'
    exportExcel(excel)
  }
async function dataSearch(){
    console.log("value1",value1.value)
    let res
    if(value1.value===''){
        res=await fetchCheckInfoByConfig({
        people: input1.value,
        complete: input2.value,
      })
    }
    else{
          res=await fetchCheckInfoByConfig({
          people: input1.value,
          complete: input2.value,
          startTime:dayjs(value1.value[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime:dayjs(value1.value[1]).format('YYYY-MM-DD HH:mm:ss'),
      })
    }
    console.log("people",input1.value)
    console.log("complete",input2.value)
    console.log("startTime",dayjs(value1.value[0]).format('YYYY-MM-DD HH:mm:ss'))
    console.log("endTime",dayjs(value1.value[1]).format('YYYY-MM-DD HH:mm:ss'))

    if(res.code==='200' && res.data.length!==0){
    ElMessage({
      type: 'success',
      message: '查询成功！',
    })
    tableData.value = res.data;
    console.log("all data",res.data)
    }
    else {
        ElMessage({
        type: 'warning',
        message: '数据未找到！',
        })
        tableData.value=[]
    }

}
const myFunc={
        async search(){
          let res = await fetchCheckInfo()
          if(authority.value==='ROLE_ADMIN'){
            tableData.value = res.data; //巡视人只显示自己的任务
          }else{
            tableData.value = res.data.filter(item=>{
              if(item.people===fetchUsername()){
                return true
              }else{
                return false
              }
            })
            console.log("本人",tableData.value)
          }

          const temp1=await fetchRoadList()
          roadList.value=temp1
          console.log("所有信息",roadList.value)

          const temp2=await fetchPeopleList({role:'ROLE_INSPECT'})//获取所有巡视人
          if(temp2.code==='200'){
            peopleList.value=temp2.data
            console.log("所有人",peopleList.value)
          }else{
            console.log("失败")
          }

        },
        async add() {
            let myData=place.value.map(item=>{
              let myId
              let temp=item.map(item1=>{
                if(item1.type==='hydrant'||item1.type==='valve'){
                  myId=item1.zoneId
                }
              })
              return myId
            })
            console.log("1",addForm.peopleId)
            console.log("2",myData)
            console.log("3",dayjs(addForm.inspectTime).format('YYYY-MM-DD HH:mm:ss'))
            console.log("4",dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            const r = await addCheck({
              peopleId:addForm.peopleId,
              valveIds:myData,
              inspectTime: dayjs(addForm.inspectTime).format('YYYY-MM-DD HH:mm:ss'),
              createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            })
            if (r.code === '200') {
                ElMessage({
                type: 'success',
                message: '操作成功!',
                })
                this.search()
                return true
            }
            return false
        },
        async edit() {
            console.log(addForm.taskId)
            console.log(addForm.peopleId)
            console.log(dayjs(addForm.inspectTime).format('YYYY-MM-DD HH:mm:ss'))
            console.log(dayjs(addForm.createTime).format('YYYY-MM-DD HH:mm:ss'))
            console.log(addForm.remark)
            const r = await updateCheck({
                taskId: addForm.taskId,
                peopleId: addForm.peopleId,
                inspectTime: dayjs(addForm.inspectTime).format('YYYY-MM-DD HH:mm:ss'),
                createTime: dayjs(addForm.createTime).format('YYYY-MM-DD HH:mm:ss'),
                remark: addForm.remark,
            })
            if (r.code === '200') {
                ElMessage({
                type: 'success',
                message: '操作成功!',
                })
                this.search()
                return true
            }
            return false
        },
        async delete(item) {
            ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                const r = await deleteCheck({ taskId: item.taskId })
                if (r.code === '200') {
                    this.search()
                    ElMessage({
                    type: 'success',
                    message: '删除成功!',
                    })
                }
                })
                .catch(() => {})
        },
  }
    const addModal = {
        changeState(e) {
        modalState.value = e
        },
        state: modalState,
        async submit() {
        if (!addForm.peopleId  ) {
            ElMessage({
            type: 'info',
            message: '必要信息不能为空',
            })
            return
        }
        const r = await myFunc.add()
        if (r) {
            this.changeState(false)
        }
        place.value=[]
        },
        cancel() {
        this.changeState(false)
        },
        open() {
        this.changeState(true)
        mode.value = 'add'
        addForm.taskId = ''
        addForm.people = ''
        addForm.peopleId = ''
        addForm.phone=''
        addForm.createTime=''
        addForm.inspectTime=''
        addForm.complete=''
        addForm.remark=''
        modal.value = addModal
        },
    }

    const editModal = {
    changeState(e) {
        editState.value = e
    },
    state: editState,
    async submit() {
        if (!addForm.people || !addForm.phone) {
        ElMessage({
            type: 'info',
            message: '必要信息不能为空',
        })
        return
        }
        const r = await myFunc.edit()
        if (r) {
        this.changeState(false)
        }
    },
    cancel() {
        this.changeState(false)
    },
    open(item) {
        this.changeState(true)
        mode.value = 'edit'
        modal.value = editModal
        addForm.taskId=item.taskId
        addForm.peopleId=item.peopleId
        addForm.people = item.people
        addForm.phone=item.phone
        addForm.createTime=item.createTime
        addForm.inspectTime=item.inspectTime
        addForm.complete=item.complete
        addForm.remark=item.remark
        addForm.valveIds=item.valveIds
        console.log("hahahaha",addForm)
    },
    }
    const detailModal={
        changeState(e) {
          detailState.value = e
        },
        state: detailState,
        cancel() {
          this.changeState(false)
        },
        async open(item) {
        const res1=await fetchCheckDetail({taskId: item.taskId})
        taskData.value=res1.data
        this.changeState(true)
        mode.value = 'detail'
        modal.value = detailModal
        addForm.taskId=item.taskId
        addForm.people = item.people
        addForm.phone=item.phone
        addForm.createTime=item.createTime,
        addForm.inspectTime=item.inspectTime,
        addForm.complete=item.complete
        addForm.remark=item.remark
        console.log("hahahaha",addForm)
        },
    }
const reload = async function () {
  input1.value=''
  input2.value=''
  myFunc.search()
}


onMounted(async () => {
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  authority.value=fetchAuthority()
  if(authority.value==='ROLE_ADMIN'){
    buttonState.value=false
  }else{
    buttonState.value=true
  }
  myFunc.search()
  const temp = await fetchSuperWithValves()
  options.value = temp
  loadingInstance.close()

})
</script>

<style lang="scss" scoped>
.button-group{
  position: relative;
  margin-top: -40px;
  margin-left: 950px;
  width: 400px;
}
.p-page {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0;
}
.detail-btn{
  position: relative;
  left: 82.5%;
  top: -15px;
}
.p-header {
  background-color: #219ded0d;
  width: 100%;
  height: 100px;
  border: 1px solid #219ded0f;
}
.data-chart2 {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
.page-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  width: 100px;
  position: relative;
}
</style>
