import { cloneDeep } from 'lodash'
import { funcListConfigs } from './router'

const operationConfigs = [
  {
    name: 'func-well-add',
    label: '添加阀门',
    belong: 'page-well',
  },
  {
    name: 'func-well-edit',
    label: '修改阀门',
    belong: 'page-well',
  },
  {
    name: 'func-well-delete',
    label: '删除阀门',
    belong: 'page-well',
  },
  {
    name: 'func-well-export',
    label: '导出阀门',
    belong: 'page-well',
  },
  {
    name: 'func-well-file',
    label: '进入一井一档',
    belong: 'page-well',
  },
  {
    name: 'func-monitor-export',
    label: '导出监测信息',
    belong: 'page-monitor',
  },
  {
    name: 'func-monitor-remark',
    label: '备注监测信息',
    belong: 'page-monitor',
  },
]

export const genType = (type, configs) => {
  configs.forEach(item => {
    item.children &&
      item.children.forEach(it => {
        it.type = type
      })
    item.type = type
  })
  return configs
}

const genMapConfigs = (res, configs) => {
  configs.forEach(item => {
    if (!item.belong) {
      res.push(item)
    }
  })
  configs.forEach(item => {
    if (item.belong) {
      const r = res.find(it => it.name === item.belong)
      item.link || (r && (item.link = r.link))
      r && (r.children = (r.children || [r]).concat(item))
    }
  })
}

const genListConfigs = (res, configs) => {
  configs.forEach(item => {
    res.push(item)
    item.children &&
      item.children.forEach(it => {
        it.belong = item.name
        res.push(it)
      })
  })
}

const mergeByGen = (conA, conB, gen) => {
  const res = []
  const a = cloneDeep(conA)
  const b = cloneDeep(conB)
  gen(res, a)
  gen(res, b)
  return res
}

const genIndex = con => {
  return con.map((item, index) => {
    item.index = index
    if (item.children) {
      item.children = item.children.map((it, idx) => {
        it.index = index + '-' + idx
        return it
      })
    }
    return item
  })
}

export const mergeMapConfigs = conA => {
  return genIndex(mergeByGen(conA, genType('func', cloneDeep(operationConfigs)), genMapConfigs))
}

export const mergeListConfigs = conA => {
  return mergeByGen(conA, operationConfigs, genListConfigs)
}
