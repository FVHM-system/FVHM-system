import request from './request'

// 根据阀门id获得设备信息
export const fetchDevicesById = async ({ well_id }) => {
  return await request.get('/wellinfo/findmeterbywellid', {
    params: {
      wellId: well_id,
    },
  })
}
