import request from "../../../apis/3.0/request";

export const fetchAlarmManage = async () => {
  return await request.get('/warn/getwarninfos', {})
}

export const fetchFindWarnInfo = async (address, valveType,warnType, status,starttime,endtime) => {
  return await request.get('/warn/findwarninfo', {
    params: {
      address: address,
      valveType: valveType,
      warnType:warnType,
      status: status,
      startTime:starttime,
      endTime:endtime
    }
  })
}
export const fetchUpdateWarnIdById = async (valveId, id, status) => {
  return await request.put('/warn/updatewarn', {
    params: {
      valveId: valveId,
      id: id,
      status: status
    }
  })
}
