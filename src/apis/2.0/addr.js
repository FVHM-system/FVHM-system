import request from './request'

export const fetchSuper = async () => {
  return await request.Pget('/city/getalladdress')
}  
export const fetchSuperWithValves = async () => {
  return await request.Pget('/city/getalladdressandvalves')
}  

// 仍在使用的旧接口
export const fetchVillageInfo = async () => {
  return await request.Pget('/village/getvillagerelationship')
}

// 仍在使用的旧接口
export const fetchTownInfo = async () => {
  return await request.Pget('/town/gettownrelationship')
}

export const fetchCityInfo = async () => {
  return await request.Pget('/city/getcityinfo')
}

export const fetchDistrictInfo = async () => {
  return await request.Pget('/district/getdistrictrelationship')
}

export const fetchAreaInfo = async () => {
  return await request.Pget('/area/getarearelationship')
}
//list
export const fetchDistrictList = async () => {
  return await request.Pget('/district/getdistrictinfo')
}

export const fetchCityList = async () => {
  return await request.Pget('/city/getcityinfo')
}

export const fetchAreaList = async () => {
  return await request.Pget('/area/getareainfo')
}

export const fetchTownList = async () => {
  return await request.Pget('/town/gettowninfo')
}

export const fetchVillageList = async () => {
  return await request.Pget('/village/getvillageinfo')
}

export const fetchRoadList=async()=>{
  return await request.Pget('/road/getroadinfo')
}

export const fetchSectionList=async()=>{
  return await request.Pget('/section/getsectioninfo')
}




export const AddVillageInfoByConfig = async ({ townId, villageId,villageName }) => {
  return await request.post('/village/insertvillageinfo', {
    data: {
      townId,
      villageId,
      villageName,
    },
  })
}

export const editDistrictInfoByConfig = async ({ cityId, districtId, districtName }) => {
  return await request.put('/district/updatedistrictinfo', {
    data: {
      cityId,
      districtId,
      districtName,
    },
  })
}

export const editVillageInfoByConfig = async ({ townId, villageId, villageName }) => {
  return await request.put('/village/updatevillageinfo', {
    data: {
      townId,
      villageId,
      villageName,
    },
  })
}

export const editSectionInfoByConfig = async ({ roadId, sectionId, sectionName }) => {
  return await request.put('/section/updatesectioninfo', {
    data: {
      roadId,
      sectionId,
      sectionName,
    },
  })
}

export const AddTownInfoByConfig = async ({ districtId, townName }) => {
  return await request.post('/town/inserttowninfo', {
    data: {
      districtId,
      townName,
    },
  })
}

export const AddSectionInfoByConfig = async ({ roadId, sectionName }) => {
  return await request.post('/section/insertsectioninfo', {
    data: {
      roadId,
      sectionName,
    },
  })
}

export const AddCityInfoByConfig = async ({ cityId, cityName }) => {
  return await request.post('/city/insertcityinfo', {
    data: {
      cityId,
      cityName,
    },
  })
}

export const AddDistrictInfoByConfig = async ({ cityId, districtName }) => {
  return await request.post('/district/insertdistrictinfo', {
    data: {
      cityId,
      districtName,
    },
  })
}

export const AddAreaInfoByConfig = async ({ address, areaName ,cityId}) => {
  return await request.post('/area/insertareainfo', {
    data: {
      address,
      areaName,
      cityId,
    },
  })
}

export const editCityInfoByConfig = async ({ cityId, cityName }) => {
  return await request.put('/city/updatecityinfo', {
    data: {
      cityId,
      cityName,
    },
  })
}

export const editTownInfoByConfig = async ({ districtId, townId, townName }) => {
  return await request.put('/town/updatetowninfo', {
    data: {
      districtId,
      townId,
      townName,
    },
  })
}

export const editAreaInfoByConfig = async ({ address, areaId, areaName ,cityId}) => {
  return await request.put('/area/updateareainfo', {
    data: {
      address,
      areaId,
      areaName,
      cityId,
    },
  })
}

export const deleteDistrictInfoById = async ({ id }) => {
  return await request.delete('/district/deletedistrictinfo', {
    params: {
      districtId: id,
    },
  })
}

export const deleteAreaInfoById = async ({ id }) => {
  return await request.delete('/area/deleteareainfo', {
    params: {
      areaId: id,
    },
  })
}

export const deleteTownInfoById = async ({ id }) => {
  return await request.delete('/town/deletetowninfo', {
    params: {
      townId: id,
    },
  })
}

export const deleteVillageInfoById = async ({ id }) => {
  return await request.delete('/village/deletevillageinfo', {
    params: {
      villageId: id,
    },
  })
}

export const deleteSectionInfoById = async ({ id }) => {
  return await request.delete('/section/deletesectioninfo', {
    params: {
      sectionId: id,
    },
  })
}

export const deleteCityInfoById = async ({ id }) => {
  return await request.delete('/city/deletecityinfo', {
    params: {
      cityId: id,
    },
  })
}


export const deleteRoadInfoById = async ({ id }) => {
  return await request.delete('/road/deleteroadinfo', {
    params: {
      roadId: id,
    },
  })
}

export const editRoadInfoByConfig = async ({  roadId, roadName ,villageId}) => {
  return await request.put('/road/updateroadinfo', {
    data: {
      roadId,
      roadName,
      villageId,
    },
  })
}

export const AddRoadInfoByConfig = async ({  roadName ,villageId}) => {
  return await request.post('/road/insertroadinfo', {
    data: {
      roadName,
      villageId,
    },
  })
}



