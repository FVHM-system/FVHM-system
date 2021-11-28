import request from './request'

export const fetchCityReport = async({ type, currentTime })=>{
    return await request.Pget('/report/getcityreport', {
        params: {
          type,
          currentTime,
        },
      })
}

export const fetchAreaReport = async({ type, currentTime })=>{
    return await request.Pget('/report/getareareport', {
        params: {
          type,
          currentTime,
        },
      })
}

export const fetchDistrictReport = async({ type, currentTime })=>{
    return await request.Pget('/report/getdistrictreport', {
        params: {
          type,
          currentTime,
        },
      })
}

export const fetchTownReport = async({ type, currentTime })=>{
    return await request.Pget('/report/gettownreport', {
        params: {
          type,
          currentTime,
        },
      })
}

export const fetchVillageReport = async({ type, currentTime })=>{
    return await request.Pget('/report/getvillagereport', {
        params: {
          type,
          currentTime,
        },
      })
}

export const fetchRoadReport = async({ type, currentTime })=>{
    return await request.Pget('/report/getroadreport', {
        params: {
          type,
          currentTime,
        },
      })
}