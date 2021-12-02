import request from "./request"

export const fetchCheckInfo=async()=>{
    return await request.Pget('/inspect/getinspectinfos')
}

export const fetchCheckInfoByConfig=async({roadId,status,people,startTime,endTime,complete})=>{
    return await request.Pget('/inspect/findinspectinfo',{
        params:{
            roadId,
            status,
            people,
            startTime,
            endTime,
            complete
        },
    })
}

export const changeCheck=async({inspectId,complete})=>{
    return await request.put('/inspect/updatecomplete',{
        params:{
            inspectId,
            complete
        },
    })
}

export const deleteCheck=async({inspectId})=>{
    return await request.delete('/inspect/deleteinspectinfo',{
        params:{
            inspectId
        },
    })
}

export const addCheck=async({inspectInfo})=>{
    return await request.put('/inspect/insertinpectinfo',{
        data:inspectInfo,
    })
}

export const updateCheck=async({inspectInfo})=>{
    return await request.put('/inspect/updateinspectinfo',{
        data:inspectInfo,
    })
}