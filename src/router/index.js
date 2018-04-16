import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home/home.vue';
import Login from '@/page/login/login.vue';

import StageWrapper from '@/page/stage/stage-wrapper.vue';
import WorkFlowWrapper from '@/page/workflow/workflow-wrapper.vue';
import FlowSubWrapper from '@/page/flowsub/flowsub-wrapper.vue';
import Gateway from '@/page/gateway.vue';
import GetToPost from '@/page/gettopost.vue';
import Payment from '@/page/payment/index.vue';
//项目/分期/面积/价格/供货/签约/成本支付
const Project = r => require.ensure([], () => r(require('../page/project/index.vue')), 'project');

const ProjectAdd = r => require.ensure([], () => r(require('../page/project/project-add.vue')), 'project-add');
const Stage = r => require.ensure([], () => r(require('../page/stage/index.vue')), 'stage');
const Area = r => require.ensure([], () => r(require('../page/area/index.vue')), 'area');
const ToExamine = r => require.ensure([], () => r(require('../page/area/to-examine.vue')), 'toExamine');
const Price = r => require.ensure([], () => r(require('../page/price/index.vue')), 'price');

const Supply = r => require.ensure([], () => r(require('../page/supply/index.vue')), 'supply');
const Sign = r => require.ensure([], () => r(require('../page/sign/index.vue')), 'sign');
const Cost = r => require.ensure([], () => r(require('../page/cost/index.vue')), 'cost');
const Team = r => require.ensure([], () => r(require('../page/team/index.vue')), 'team');
const Assessment = r => require.ensure([], () => r(require('../page/assessment/index.vue')), 'assessment');
const Rate = r => require.ensure([], () => r(require('../page/rate/index.vue')), 'rate');
// const Payment = r => require.ensure([], () => r(require('../page/payment/index.vue')), 'payment');
// import Supply from '@/page/supply/index.vue';
// import Sign from '@/page/sign/index.vue';

//审批流程相关
const Apply = r => require.ensure([], () => r(require('../page/workflow/apply.vue')), 'apply');
const Approval = r => require.ensure([], () => r(require('../page/workflow/approval.vue')), 'approval');
const Draft = r => require.ensure([], () => r(require('../page/workflow/draft.vue')), 'draft');
const History = r => require.ensure([], () => r(require('../page/workflow/history.vue')), 'history');
const Todo = r => require.ensure([], () => r(require('../page/workflow/todo.vue')), 'todo');
//审批流程-->flowsub
const ApplicationUpVersion = r => require.ensure([], () => r(require('../page/flowsub/application-upversion.vue')), 'application-upversion');
const AreaUpVersion = r => require.ensure([], () => r(require('../page/flowsub/area-upversion.vue')), 'area-upversion');
const CostUpVersion = r => require.ensure([], () => r(require('../page/flowsub/cost-upversion.vue')), 'cost-upversion');
const InstalmentUpVersion = r => require.ensure([], () => r(require('../page/flowsub/instalment-upversion.vue')), 'instalment-upversion');
const PriceUpVersion = r => require.ensure([], () => r(require('../page/flowsub/price-upversion.vue')), 'price-upversion');
const ReturnMoneyUpVersion = r => require.ensure([], () => r(require('../page/flowsub/returnmoney-upversion.vue')), 'returnmoney-upversion');
const SignUpVersion = r => require.ensure([], () => r(require('../page/flowsub/sign-upversion.vue')), 'sign-upversion');
const SupplyUpVersion = r => require.ensure([], () => r(require('../page/flowsub/supply-upversion.vue')), 'supply-upversion');
//城市公司
const Company = r => require.ensure([], () => r(require('../page/company/index.vue')), 'company');
//集团该公司
const Group = r => require.ensure([], () => r(require('../page/group/index.vue')), 'group');
//报表
const Report = r => require.ensure([], () => r(require('../page/report/index.vue')), 'report');
const Loading = r => require.ensure([], () => r(require('../components/loading.vue')), 'loading');

Vue.use(Router);

/**
 * 注意: 如果需要使用 Keep-Alive 缓存组件的, 属性需要修改成 meta: {keepAlive: true}
 */
export default new Router({
  routes: [
    {
      path: '/gettopost/:IASID/:TimeStamp',
      name: 'gettopost',
      component: GetToPost
    },
    {
      path: '/gateway/:userName/:empName/:token',
      name: 'gateway',
      component: Gateway
    },
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      redirect: '/workflow/todo'
      // component: Home,
      // meta: {keepAlive: false}
    },
    {
      path: '/project',
      name: 'project',
      component: Project,
      meta: {keepAlive: false}
    },
    {
      path: '/company',
      name: 'company',
      component: Company,
      meta: {keepAlive: false}
    },
    {
      path: '/group',
      name: 'group',
      component: Group,
      meta: {keepAlive: false}
    },
    {
      path: '/report',
      name: 'report',
      component: Report,
      meta: {keepAlive: true}
    },
    {
      path: '/projectAdd',
      name: 'projectAdd',
      component: ProjectAdd,
      meta: {keepAlive: false}
    },
    {
      path: '/stage',
      redirect: '/stage/info'
    },
    {
      path: '/stage',
      name: 'stage',
      component: StageWrapper,
      children: [
        {
          path: 'info',
          name: 'stageInfo',
          component: Stage,
          meta: {keepAlive: false}
        },
        {
          path: 'area',
          name: 'area',
          component: Area,
          meta: {keepAlive: false}
        },
        {
          path: 'toExamine',
          name: 'to-examine',
          component: ToExamine,
          meta: {keepAlive: true}
        },
        {
          path: 'price',
          name: 'price',
          // redirect: '/stage/loading'
          component: Price,
          meta: {keepAlive: false}
        },
        {
          path: 'supply',
          name: 'supply',
          component: Supply,
          meta: {keepAlive: false}
        },
        {
          path: 'sign',
          name: 'sign',
          component: Sign,
          meta: {keepAlive: false}
        },
        {
          path: 'cost',
          name: 'cost',
          component: Cost,
          meta: {keepAlive: false}
         // redirect: '/stage/loading'
        },
        {
          path: 'team',
          name: 'team',
          component: Team,
          meta: {keepAlive: false}
        },
        {
          path: 'payment',
          name: 'payment',
          component: Payment,
          meta: {keepAlive: false}
        },
        {
          path: 'assessment',
          name: 'assessment',
          component: Assessment,
          meta: {keepAlive: false}
        },
        {
          path: 'rate',
          name: 'rate',
          component: Rate,
          meta: {keepAlive: false}
        },
        {
          path: 'loading',
          name: 'loading',
          component: Loading,
          meta: {keepAlive: false}
        }
      ],
    },
    {
      path: '/workflow',
      redirect: '/workflow/todo'
    },
    {
      path: '/workflow',
      name: 'workflow',
      component: WorkFlowWrapper,
      children: [
        {
          path: 'apply',
          name: 'apply',
          component: Apply,
          meta: {keepAlive: false}
        },
        {
          path: 'approval',
          name: 'approval',
          component: Approval,
          meta: {keepAlive: false}
        },
        {
          path: 'draft',
          name: 'draft',
          component: Draft,
          meta: {keepAlive: false}
        },
        {
          path: 'history',
          name: 'history',
          component: History,
          meta: {keepAlive: true}
        },
        {
          path: 'todo',
          name: 'todo',
          component: Todo,
          meta: {keepAlive: false}
        },
      ],
    },
    {
      path: '/flowsub',
      name: 'flowsub',
      component: FlowSubWrapper,
      children: [
        {
          path: 'applicationUpVersion',
          name: 'applicationUpVersion',
          component: ApplicationUpVersion,
          meta: {keepAlive: false}

        },
        {
          path: 'areaUpVersion',
          name: 'areaUpVersion',
          component: AreaUpVersion,
          meta: {keepAlive: false}
        },
        {
          path: 'costUpVersion',
          name: 'costUpVersion',
          component: CostUpVersion,
          meta: {keepAlive: false}
        },
        {
          path: 'instalmentUpVersion',
          name: 'instalmentUpVersion',
          component: InstalmentUpVersion,
          meta: {keepAlive: false}
        },
        {
          path: 'priceUpVersion',
          name: 'priceUpVersion',
          component: PriceUpVersion,
          meta: {keepAlive: false}
        },
        {
          path: 'returnMoneyUpVersion',
          name: 'returnMoneyUpVersion',
          component: ReturnMoneyUpVersion,
          meta: {keepAlive: false}
        },
        {
          path: 'signUpVersion',
          name: 'signUpVersion',
          component: SignUpVersion,
          meta: {keepAlive: false}
        },
        {
          path: 'supplyUpVersion',
          name: 'supplyUpVersion',
          component: SupplyUpVersion,
          meta: {keepAlive: false}
        },
      ]
    }
  ]
})
