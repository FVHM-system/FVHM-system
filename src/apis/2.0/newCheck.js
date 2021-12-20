
import request from "../3.0/request";

export const fetchCheckInfo=async()=>{
    return await request.get('/inspect/getinspectinfos')
}

export const fetchCheckInfoByConfig=async({roadId,status,people,startTime,endTime,complete})=>{
    return await request.get('/inspect/findinspectinfo',{
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

export const fetchCheckDetail=async({taskId})=>{
    return await request.get('/inspect/gettaskdetail',{
        params:{
            taskId,
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
}//????

export const changeDetail=async({id,complete,remark,completeTime})=>{
    return await request.put('/inspect/updatecomplete',{
        params:{
            id,
            complete,
            remark,
            completeTime,
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

export const addCheck=async({id,zoneId,people,phone,time,complete,remark})=>{
    return await request.post('/inspect/insertinspectinfo',{
        data:{
            id,
            zoneId,
            people,
            phone,
            time,
            complete,
            remark
        },
    })
}

export const updateCheck=async({id,zoneId,people,phone,time,complete,remark})=>{
    return await request.put('/inspect/updateinspectinfo',{
        data:{
            id,
            zoneId,
            people,
            phone,
            time,
            complete,
            remark
        },
    })
}