import request from "../../../apis/3.0/request";
import axios from "axios";

export const fetchVpinformation = async () => {
  return await request.get('/valveinfo/getvalveinfos', {
  })
}

export const fetchHasNoMeterVpinformation = async () => {
  return await request.get('/valveinfo/hasnometervalve', {
  })
}

export const fetFindVolumebyTime = async (valveId,startTime,endTime) => {
  return await request.get('/valveinfo/findvolumebytime',{
    params:{
      valveId:valveId,
      startTime:startTime,
      endTime:endTime
    }
  })
}
export const fetFindvolumebyyear = async (valveId) => {
  return await request.get('/valveinfo/findvolumebyyear',{
    params:{
      valveId:valveId,
    }
  })
}
export const fetFindvolumebyday = async (valveId,type,time) => {
  return await request.get('/valveinfo/findvolumebyday',{
    params:{
      valveId:valveId,
      type:type,
      time:time
    }
  })
}
export const fetFindmonthvolumebyyear= async (valveId,year) => {
  return await request.get('/valveinfo/findmonthvolumebyyear',{
    params:{
      valveId:valveId,
      year:year
    }
  })
}
export const fetInsertValveInfo = async (data) => {
  return await request.postJSON('/valveinfo/insertvalveinfo',data)
}
export const fetDeleteValveInfo = async ({valveId}) => {
  return await request.delete('/valveinfo/deletevalveinfo',{
    params:{
      valveId:valveId
    }
  })
}

export const fetUpdateStatus = async ({valveId,status}) => {
  return await request.put('/valveinfo/updatestatus',{
    params:{
      valveId:valveId,
      status:status
    }
  })
}
