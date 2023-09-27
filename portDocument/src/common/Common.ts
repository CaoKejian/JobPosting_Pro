export type Root = Root2[]

export interface Root2 {
  id: string
  branch: string
  useMode: UseMode
  paramsMode: ParamsMode
  requestMode: RequestMode
  successReturn: SuccessReturn
  failedReturn: FailedReturn
  notice: string
}

export interface UseMode {
  title: string
  desc: string
  way: Way
}

export interface Way {
  url: string
  method: string
  nLogin: boolean
  nAuth: boolean
}

export interface ParamsMode {
  notice: string
  params: Param[]
}

export interface Param {
  param: string
  type: string
  pattern: string
}

export interface RequestMode {
  notice: string
  reqjson: any
}

export interface SuccessReturn {
  response: Response
  jsonObj: any
}

export interface Response {
  conditions: string
  status: number
  exampleDesc: string
}

export interface FailedReturn {
  response: Response2
  jsonObj: any
}

export interface Response2 {
  conditions: string
  status: number
  exampleDesc: string
}

export const portTree: Root = [
  {
    id: '1',
    branch: 'user',
    useMode: {
      title: '创建用户',
      desc: '通过stuId、email、name来创建用户，更新数据库',
      way: {
        url: '/api/user',
        method: 'POST',
        nLogin: false,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '字段都是是必填的，会先查找库中是否有这名同学',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
        { param: 'email', type: 'String', pattern: '邮箱' },
        { param: 'name', type: 'String', pattern: '' }
      ],
    },
    requestMode: {
      notice: 'email必须合法，三个字段必填',
      reqjson: {
        name: 'lucy',
        email: 'xxx@qq.com',
        stuId: 180123,
      }
    },
    successReturn: {
      response: {
        conditions: 'stuId、email、name必填',
        status: 201,
        exampleDesc: '用户创建成功，例如：'
      },
      jsonObj: {
        data: [],
        code: 201,
        message: '用户创建成功'
      }
    },
    failedReturn: {
      response: {
        conditions: 'stuId已存在',
        status: 500,
        exampleDesc: '用户创建失败，返回例如：'
      },
      jsonObj: {
        data: [],
        code: 500,
        message: '创建用户失败'
      }
    },
    notice: '如果用户的用户信息不存在，将会使用请求的数据创建一个新的用户信息。'
  },
  {
    id: '2',
    branch: 'user',
    useMode: {
      title: '查询所有已登录的同学和老师',
      desc: '通过page做分页，返回数据',
      way: {
        url: '/api/user/all',
        method: 'GET',
        nLogin: false,
        nAuth: false
      }
    },
    paramsMode: {
      notice: 'page 是必填的，根据它做分页操作',
      params: [
        { param: 'page', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: 'page必传',
      reqjson: {
        page: 1,
      }
    },
    successReturn: {
      response: {
        conditions: 'page必填',
        status: 200,
        exampleDesc: '根据stuId来查询一个人，例如：'
      },
      jsonObj: {
        code: 200,
        message: '查询成功',
        data: [],
        pagination: {
          total: 12,
          currentPage: 1,
          totalPages: 2,
          perPage: 10,
        },
      }
    },
    failedReturn: {
      response: {
        conditions: '',
        status: 500,
        exampleDesc: ''
      },
      jsonObj: {
        data: [],
        code: 500,
        message: '服务器出错'
      }
    },
    notice: '每次请求返回十条数据'
  },
  {
    id: '3',
    branch: 'user',
    useMode: {
      title: '查询本班所有同学',
      desc: '通过 classId 查询该班所有同学信息，返回数据',
      way: {
        url: '/api/user/aldemandl',
        method: 'GET',
        nLogin: false,
        nAuth: false
      }
    },
    paramsMode: {
      notice: 'classId 是必填的，根据它做查数据库',
      params: [
        { param: 'classId', type: 'Number', pattern: '6位数字' },
      ],
    },
    requestMode: {
      notice: 'classId必传',
      reqjson: {
        classId: 123123,
      }
    },
    successReturn: {
      response: {
        conditions: 'classId必填',
        status: 200,
        exampleDesc: '根据classId来查询班级每个人信息，例如：'
      },
      jsonObj: {
        code: 200,
        data: [
          { stuId: 123, name: 'colin', classId: 123123 }
        ],
      }
    },
    failedReturn: {
      response: {
        conditions: '班级下没有同学',
        status: 200,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 500,
        message: '班级下还没有同学注册！'
      }
    },
    notice: '不限制分页'
  },
  {
    id: '4',
    branch: 'user',
    useMode: {
      title: '根据type来查询同学信息',
      desc: '通过 type 的值查询该所有符合的同学，返回数据',
      way: {
        url: '/api/user/type/search',
        method: 'GET',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: 'page、type、value 是必填的，根据它查数据库',
      params: [
        { param: 'page', type: 'Number', pattern: '' },
        { param: 'type', type: 'String', pattern: 'name|stuId|clssId|Auth|Root' },
        { param: 'value', type: 'String', pattern: '' },
      ],
    },
    requestMode: {
      notice: 'value为查询的值，如果type为classId则有分页',
      reqjson: {
        value: 123123,
        type: "classId",
        page: 1
      }
    },
    successReturn: {
      response: {
        conditions: 'type为classId，才有type',
        status: 200,
        exampleDesc: '根据type，来查询信息，例如：'
      },
      jsonObj: {
        code: 200,
        data: [
          { stuId: 123, name: 'colin', classId: 123123, isAuth: false, isRoot: false }
        ],
        pagination: {
          total: 12,
          currentPage: 1,
          totalPages: 2,
          perPage: 10,
        }
      }
    },
    failedReturn: {
      response: {
        conditions: '班级下没有同学',
        status: 400,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 400,
        message: '未找到匹配的记录'
      }
    },
    notice: '一次查询十条；如果type为其他则是直接查询'
  },
  {
    id: '5',
    branch: 'user',
    useMode: {
      title: '添加至所选班级',
      desc: '通过 stuId, classId 的值将classId添加至该(stuId)同学，返回数据',
      way: {
        url: '/api/user/addclassId',
        method: 'GET',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: 'page、type、value 是必填的，根据它查数据库',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
        { param: 'classId', type: 'String', pattern: '6位数字' },
      ],
    },
    requestMode: {
      notice: '如果有匹配，就更新数据库，返回数据',
      reqjson: {
        stuId: 1118822,
        classId: 123123,
      }
    },
    successReturn: {
      response: {
        conditions: '匹配到并且更新成功',
        status: 200,
        exampleDesc: '根据stuId，来查询信息，例如：'
      },
      jsonObj: {
        code: 200,
        success: true,
        updatedData: []
      }
    },
    failedReturn: {
      response: {
        conditions: '班级下没有同学',
        status: 200,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 200,
        success: true,
        message: '学号没找到！'
      }
    },
    notice: '首先会查询，如果有就更新'
  },
  {
    id: '6',
    branch: 'xxx',
    useMode: {
      title: '添加至所选班级',
      desc: '通过 stuId, classId 的值将classId添加至该(stuId)同学，返回数据',
      way: {
        url: '/api/user/addclassId',
        method: 'GET',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: 'page、type、value 是必填的，根据它查数据库',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
        { param: 'classId', type: 'String', pattern: '6位数字' },
      ],
    },
    requestMode: {
      notice: '如果有匹配，就更新数据库，返回数据',
      reqjson: {
        stuId: 1118822,
        classId: 123123,
      }
    },
    successReturn: {
      response: {
        conditions: '匹配到并且更新成功',
        status: 200,
        exampleDesc: '根据stuId，来查询信息，例如：'
      },
      jsonObj: {
        code: 200,
        success: true,
        updatedData: []
      }
    },
    failedReturn: {
      response: {
        conditions: '班级下没有同学',
        status: 200,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 200,
        success: true,
        message: '学号没找到！'
      }
    },
    notice: '首先会查询，如果有就更新'
  }
]


const topLevelMenu = Array.from(new Set(portTree.map(item => item.branch)));
export const menuData = topLevelMenu.map(topLevelItem => {
  const subMenuItems = portTree
    .filter(item => item.branch === topLevelItem)
    .map(item => ({
      title: item.useMode.title,
    }));

  return {
    title: topLevelItem, // 一级菜单标题
    subMenu: subMenuItems, // 二级菜单项
  };
});

export const findIndex = (title: string) => {
  const x = portTree.find(item => {
    return item.useMode.title === title
  })
  if (!x) return
  return +x.id - 1 
}