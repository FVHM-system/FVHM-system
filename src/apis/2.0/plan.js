import request from './request'

// 4.6 新接口
// 通过阀门 id，获取年度用水量列表
export const fetchYearPlanListById = async ({ id }) => {
  return await request.get('/wellinfo/getplanwater', {
    params: {
      well_id: id,
    },
  })
}

// 4.8 新接口
// 通过阀门 id，更新年度计划用水量
export const updateYearPlanById = async ({ applicantId, planType, planVolume, planYear }) => {
  return await request.post('/plan/insertplanvolume', {
    data: {
      applicantId,
      planType,
      planVolume: (planVolume || 0) * 10000,
      planYear,
    },
  })
}

export const addYearPlanById = async ({ wellId, planVolume, planYear }) => {
  return await request.post('/wellinfo/insertplanwater', {
    data: {
      wellId,
      planVolume,
      planYear,
    },
  })
}
