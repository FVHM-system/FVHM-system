import request from "../../../apis/3.0/request";

export const fetchUpdateData = async ({
  valveId,
  // 时间
  createTime,
  valveCode,
  valveType,
  valveName,
  zoneId,
  zoneName,
  address,
  longitude,
  latitude,
  status,
  remark,
  meterCode,
  comNumber,
  applicantName,
  zoneType
}) => {
  return await request.put('/valveinfo/updatevalveinfo', {
    data: {
      valveId,
      // 时间
      createTime,
      valveCode,
      valveType,
      valveName,
      zoneId,
      zoneType,
      zoneName,
      address,
      longitude,
      latitude,
      status,
      remark,
      meterCode,
      comNumber,
      applicantName,
    },
  })
}
