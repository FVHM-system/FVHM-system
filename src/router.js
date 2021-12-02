import { createRouter, createWebHistory } from 'vue-router';
import homepage from '@/pages/homePage/homepage.vue';
import comprehensiveStatistics from '@/pages/comprehensiveStatistics/comprehensiveStatistics.vue'
import Example3 from '@/pages/example3.vue';
import Example4 from '@/pages/example4.vue';
import Example5 from '@/pages/example5.vue';
import MapContent from '@/pages/Map/mapcontent.vue';
import MapDetail from '@/pages/Map/mapdetail.vue';
import AlarmMgmt from '@/pages/AlarmMgmt/alarmMgmt.vue'
import VPInformation from '@/pages/ValvePlugInformation/valve_plug_information.vue'
import ValveDetail from '@/pages/ValvePlugInformation/valveDetail.vue'
import async from "async";
import EditFunction from '@/pages/EditFunction.vue';
import Manage from '@/pages/manage.vue';
import DistrictReport from '@/pages/statisticalReport/districtReport.vue';
import CityManage from './pages/addrmanage/cityManage.vue';
import DistrictManage from './pages/addrManage/districtManage.vue';
import AreaManage from './pages/addrManage/areaManage.vue';
import TownManage from './pages/addrManage/townManage.vue';
import VillageManage from './pages/addrManage/villageManage.vue';
import RoadManage from './pages/addrManage/roadManage.vue';
import waterConsumption from './pages/waterConsumption/waterConsumption.vue';
import valveCheck from './pages/valveCheck/valveCheck.vue';
import AcceptMange from '@/pages/SystemMgmt/acceptManage.vue'
import AccountMgmt from '@/pages/SystemMgmt/AccountMgmt.vue'
import AccountPostManage from '@/pages/SystemMgmt/accountPostManage.vue'
import ApiMgmt from './pages/SystemMgmt/ApiMgmt.vue'
import MenuMgmt from './pages/SystemMgmt/MenuMgmt.vue'
import PermissionManage from './pages/SystemMgmt/permissionManage.vue'
import PostMgmt from './pages/SystemMgmt/PostMgmt.vue'

 const configs = [
  {
    path: '/', // 路由地址，children 内路由地址 = 上一嵌套的路由地址（若无则为""） + 该path
    label: '首页', // 【必选】显示在菜单栏里的名字
    name: 'homepage', // 【必选】一定要有，且保证在 configs 内唯一
    icon: 'el-icon-s-comment', // 显示在菜单栏内的 icon
    component: homepage // 页面组件
  },
  {
    path: '/map',
    label: '一张图',
    icon: 'el-icon-s-opportunity',
    name: 'map',
    children:[
      {
        path:'/content',
        label:'内容',
        component: MapContent
      },
      {
        path:'/detail',
        label:'详情',
        component: MapDetail
      }
    ]
  },
  {
    path: '/valve_plug_information',
    label: '阀栓信息',
    name: 'valve_plug_information',
    icon: 'el-icon-document',
    component: VPInformation
  },
   {
     path: '/valve_plug_information/valveDetail',
     label: '阀栓信息',
     name: 'valveDetail',
     icon: 'el-icon-document',
     hide: true,
     component: ValveDetail
   },
  {
    path: '/alarm_management',
    label: '报警管理',
    name: 'alarm_management',
    icon: 'el-icon-message-solid',
    component: AlarmMgmt
  },
  {
    path: '/comprehensive_statistics',
    label: '综合统计',
    name: 'comprehensive_statistics',
    icon: 'el-icon-s-grid',
    component: comprehensiveStatistics
  },
  {
    path: '/water_consumption',
    label: '用水统计',
    name: 'water_consumption',
    icon: 'el-icon-s-marketing',
    component: waterConsumption
  },
  {
    path: '/water_consumption_statistics',
    label: '统计报表',
    name: 'water_consumption_statistics',
    icon: 'el-icon-s-data',
    component: DistrictReport
  },
  {
    path: '/addr_management',
    label: '地址管理',
    name: 'addr_management',
    icon: 'el-icon-office-building',
    expanded:false,
    children:[
      {
        path:'/city',
        label:'城市管理',
        name:'page-addr-city',
        component: CityManage,
      },
      {
        path:'/district',
        label:'区县管理',
        name:'page-addr-district',
        component: DistrictManage,
      },
      {
        path:'/area',
        label:'工业区管理',
        name:'page-addr-area',
        component: AreaManage,
      },
      {
        path:'/town',
        label:'乡镇管理',
        name:'page-addr-town',
        component: TownManage,
      },
      {
        path:'/village',
        label:'村庄管理',
        name:'page-addr-village',
        component: VillageManage,
      },
      {
        path:'/road',
        label:'道路管理',
        name:'page-addr-road',
        component: RoadManage,
      },
    ]
  },
  {
    path: '/system_management',
    label: '系统管理',
    name: 'system_management',
    icon: 'el-icon-setting',
    children: [
      {
        path:'/user_anagement',
        label:'用户管理',
        component: AccountMgmt
      },
      {
        path:'/job_management',
        label:'岗位管理',
        component: PostMgmt
      },
      {
        path:'/permissionManage',
        label:'菜单权限',
        hide:true,
        component: PermissionManage
      },
      {
        path:'/accountPostManage',
        label:'分配用户',
        hide:true,
        component: AccountPostManage
      },
      {
        path:'/acceptMange',
        label:'API权限',
        hide:true,
        component: AcceptMange
      },
      {
        path:'/menu_management',
        label:'菜单管理',
        component: MenuMgmt
      },
      {
        path:'/api_management',
        label:'API管理',
        component: ApiMgmt
      }
    ]
  },
  {
    path: '/valve_check',
    label: '阀栓巡视',
    name: 'valve_check',
    icon: 'el-icon-s-opportunity',
    component: valveCheck
  },

];

const generateRouterConfigsFunc = (res, configs, { rootPath = '' }) => {
  configs.forEach(item => {
    const path = rootPath + (item.path || '');
    if (item.component && (!item.children || item.children.length === 0)) {
      res.push({
        name: item.name,
        path,
        component: item.component,
      });
    }
    if (item.children && item.children.length > 0) {
      generateRouterConfigsFunc(res, item.children, { rootPath: path });
    }
  })
}

const generateMenuConfigsFunc = (res, configs, { rootPath = '' }) => {
  configs.forEach(item => {
    const path = rootPath + (item.path || '');
    if (!item.hide) {
      const children = [];
      if (item.children && item.children.length > 0) {
        generateMenuConfigsFunc(children, item.children, {
          rootPath: path
        });
      }
      res.push({
        name: item.name,
        label: item.label,
        icon: item.icon,
        children,
        index: path,
      });
    }
  })
}

const generateMenuExpandedConfigsFunc = (res, configs) => {
  configs.forEach(item => {
    if (item.expanded) {
      res.push(item.name)
    }
    if (item.children && item.children.length > 0) {
      generateMenuExpandedConfigsFunc(res, item.children);
    }
  })
}

const generateFuncListFunc = (res, configs) => {
  configs.forEach(item => {
    if (item.component) {
      res.push({
        name: item.name,
        label: item.label
      })
    }
    if (!item.component && item.children && item.children.length > 0) {
      generateFuncListFunc(res, item.children);
    }
  })
}

const generate = (configs, genFunc) => {
  const res = [];
  genFunc(res, configs, {});
  return res;
};

export const generateRouterConfigs = (configs) => generate(configs, generateRouterConfigsFunc);
export const generateMenuConfigs = (configs) => generate(configs, generateMenuConfigsFunc);
export const generateMenuExpandedConfigs = (configs) => generate(configs, generateMenuExpandedConfigsFunc);
export const generateFuncListConfigs = (configs) => generate(configs, generateFuncListFunc);

export const routerConfigs = generateRouterConfigs(configs)
export const menuConfigs = generateMenuConfigs(configs)
export const menuExpandedConfigs = generateMenuExpandedConfigs(configs)
export const funcListConfigs = generateFuncListConfigs(configs)

export const router = createRouter({
  history: createWebHistory(),
  routes: routerConfigs,
});
