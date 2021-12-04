import request from './request'

// 多条件查询阀门详情信息
export const fetchMonitorByConfig = async ({ well_name, well_code, status, town_name, village_name, remark }) => {
  return await request.get('/monitor/findbycondition', {
    params: {
      well_name,
      well_code,
      status,
      town_name,
      village_name,
      remark,
    },
  })
}
