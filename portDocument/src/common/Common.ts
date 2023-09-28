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
        nAuth: false
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
    branch: 'user',
    useMode: {
      title: '发送验证码',
      desc: '通过 email 来发送给其邮箱验证码，同时和 stuId 一同存进数据库',
      way: {
        url: '/api/user/email',
        method: 'POST',
        nLogin: false,
        nAuth: false
      }
    },
    paramsMode: {
      notice: 'stuId、email 是必填的',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
        { param: 'email', type: 'String', pattern: '邮箱格式' },
      ],
    },
    requestMode: {
      notice: '如果有之前登陆过，则不再存储数据库',
      reqjson: {
        stuId: 1118822,
        email: '12345@qq.com',
      }
    },
    successReturn: {
      response: {
        conditions: '匹配到并且发送成功',
        status: 200,
        exampleDesc: '同时会记录时间戳，1分钟之内不能再次请求'
      },
      jsonObj: {
        code: 200,
        data: {}
      }
    },
    failedReturn: {
      response: {
        conditions: '邮件错误',
        status: 402,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 402,
        message: '邮件格式错误'
      }
    },
    notice: '根据 Email 来发送6位数字验证码，一分钟多次请求会返回状态码 429'
  },
  {
    id: '7',
    branch: 'user',
    useMode: {
      title: '校验验证码|下发jwt',
      desc: '通过 code 来检验缓存内是否相匹配，匹配则下发 jwt',
      way: {
        url: '/api/user/veifycode',
        method: 'POST',
        nLogin: false,
        nAuth: false
      }
    },
    paramsMode: {
      notice: 'code 是必填的',
      params: [
        { param: 'code', type: 'Number', pattern: '6位数字' },
      ],
    },
    requestMode: {
      notice: '测试可以使用 111111 通过验证；其余则会查看同时符合设定时间内并且相匹配才会通过',
      reqjson: {
        code: 123123,
      }
    },
    successReturn: {
      response: {
        conditions: '查找到并合法',
        status: 200,
        exampleDesc: '同时会下发jwt到 headers 的 Authorization'
      },
      jsonObj: {
        code: 200,
        message: '验证码输入正确！'
      }
    },
    failedReturn: {
      response: {
        conditions: '验证码不合法',
        status: 401,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 401,
        message: '验证码已过期！'
      }
    },
    notice: '前端可以根据下发的jwt来做校验登录信息'
  },
  {
    id: '8',
    branch: 'user',
    useMode: {
      title: '校验jwt|续期',
      desc: '通过 req.headers.authorization 拿到jwt信息，通过jwt.verify校验或者续期',
      way: {
        url: '/api/user/verify/jwt',
        method: 'GET',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '请求token需要自动绑定上headers里的authorization',
      params: [
        { param: '无', type: '', pattern: '' },
      ],
    },
    requestMode: {
      notice: '',
      reqjson: {
      }
    },
    successReturn: {
      response: {
        conditions: '校验通过并续期',
        status: 200,
        exampleDesc: '同时会重新下发jwt到 headers 的 Authorization'
      },
      jsonObj: {
        code: 200,
        message: 'JWT token is valid.'
      }
    },
    failedReturn: {
      response: {
        conditions: '校验不通过',
        status: 401,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 401,
        message: '无效的JWT令牌'
      }
    },
    notice: '前端可以使用全局拦截器每次先校验jwt'
  },
  {
    id: '9',
    branch: 'user',
    useMode: {
      title: '查询未交的名单',
      desc: '通过 classId，stuIds（已经提交过的学号） 来查询数据库，找到未提交的数据',
      way: {
        url: '/api/user/total',
        method: 'GET',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: 'stuIds是一个number类型的数组, 是已经提交过的学号',
      params: [
        { param: 'classId', type: 'Number', pattern: '6位数字' },
        { param: 'stuIds', type: 'Number[]', pattern: '包含学号的数组' },
      ],
    },
    requestMode: {
      notice: '会通过classId先查找所有数据，通过stuIds来过滤未提交',
      reqjson: {
        classId: 123123,
        stuIds: [123, 456, 789]
      }
    },
    successReturn: {
      response: {
        conditions: '执行完成并返回数据只包含stuId、 classId、 name',
        status: 200,
        exampleDesc: ''
      },
      jsonObj: {
        code: 200,
        data: [{ stuId: 111, classId: 123123, name: '小王' }]
      }
    },
    failedReturn: {
      response: {
        conditions: '没有班级信息，班级码错误',
        status: 402,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 402,
        message: '未找到班级信息'
      }
    },
    notice: '可以进一步通过未交名单做处理，比如：发邮件通知'
  },
  {
    id: '10',
    branch: 'user',
    useMode: {
      title: '发送邮件给未交同学',
      desc: '通过 stuIds,url,user,branch,content,cutTime来发送邮件给相关（stuIds是同学学号数组）的同学',
      way: {
        url: '/api/user/email/unsubmit',
        method: 'POST',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: 'stuIds是一个number类型的数组, 是已经提交过的学号，其他是需要邮件传递的信息',
      params: [
        { param: 'stuIds', type: 'Number[]', pattern: '包含学号的数组' },
        { param: 'url', type: 'String', pattern: '' },
        { param: 'user', type: 'String', pattern: '' },
        { param: 'branch', type: 'String', pattern: '' },
        { param: 'content', type: 'String', pattern: '' },
        { param: 'cutTime', type: 'String', pattern: '' },
        { param: 'unSubmit', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: '会通过stuIds遍历所有同学学号，依次发送邮件通知',
      reqjson: {
        stuIds: [123, 456, 789],
        url: 'http://www.baidu.com/',
        user: '发布作业者',
        branch: '某学科',
        content: '这个作业要.....,一定要完成',
        cutTime: '2023-09-01',
        unSubmit: '8（未交数量）',
      }
    },
    successReturn: {
      response: {
        conditions: '执行完成并返回message',
        status: 200,
        exampleDesc: ''
      },
      jsonObj: {
        code: 200,
        message: 'ok'
      }
    },
    failedReturn: {
      response: {
        conditions: '发送失败',
        status: 400,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 400,
        message: '发送失败'
      }
    },
    notice: '发邮件通知可以让用户更方便的了解其详情并快捷提交'
  },
  {
    id: '11',
    branch: 'user',
    useMode: {
      title: '判断信息是否被篡改 | 权限信息是否正确',
      desc: '通过 stuId, email, name 来判断这个用户有没有被篡改信息',
      way: {
        url: '/api/user/isself/auth',
        method: 'POST',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: 'stuId, email, name缺一不可',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
        { param: 'email', type: 'String', pattern: '邮箱格式' },
        { param: 'name', type: 'String', pattern: '' },
      ],
    },
    requestMode: {
      notice: '如果用户是总裁权限，则会直接通过校验',
      reqjson: {
        stuIds: 2001,
        email: '123456@qq.com',
        name: '小王',
      }
    },
    successReturn: {
      response: {
        conditions: '个人信息没错返回message',
        status: 200,
        exampleDesc: '三项信息校验成功'
      },
      jsonObj: {
        code: 200,
        message: 'ok'
      }
    },
    failedReturn: {
      response: {
        conditions: '个人信息有错返回message',
        status: 401,
        exampleDesc: '返回message:'
      },
      jsonObj: {
        code: 401,
        message: '个人信息有误，请重新登录！'
      }
    },
    notice: '前端可以全局校验信息是否正确或被篡改来防止违规人员操作'
  },
  {
    id: '12',
    branch: 'user',
    useMode: {
      title: '查询总裁权限',
      desc: '通过 stuId 来判断这个用户有没有总裁权限',
      way: {
        url: '/api/user/root/auth',
        method: 'GET',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: 'stuId查数据库的信心是否有isRoot字段',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: '如果用户是总裁权限，则会直接通过校验',
      reqjson: {
        stuId: 2001,
      }
    },
    successReturn: {
      response: {
        conditions: '是总裁isRoot',
        status: 200,
        exampleDesc: '返回Boolean'
      },
      jsonObj: {
        code: 200,
        data: true
      }
    },
    failedReturn: {
      response: {
        conditions: '不是总裁isRoot',
        status: 200,
        exampleDesc: '返回Boolean'
      },
      jsonObj: {
        code: 200,
        data: false
      }
    },
    notice: '一些总要操作需要总裁权限可以以此做判断'
  },
  {
    id: '13',
    branch: 'user',
    useMode: {
      title: '设置总裁权限|默认设置总裁权限',
      desc: '传入stuId, isRoot；如果传入isRoot=true，设置管理员权限',
      way: {
        url: '/api/user/president/set',
        method: 'POST',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: 'stuId查数据库的信息是否有isRoot字段',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
        { param: 'isRoot', type: 'Boolean', pattern: '可选' },
      ],
    },
    requestMode: {
      notice: '更新数据库信息，如果传入isRoot连同isAuth一块更新',
      reqjson: {
        stuId: 2001,
        isRoot: true,
      }
    },
    successReturn: {
      response: {
        conditions: '设定成功',
        status: 200,
        exampleDesc: '返回Boolean'
      },
      jsonObj: {
        code: 200,
        data: true
      }
    },
    failedReturn: {
      response: {
        conditions: '设定失败（没有该同学）',
        status: 400,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 400,
        message: '没有该同学信息！'
      }
    },
    notice: '设定权限，才能做更多的事情'
  },
  {
    id: '13',
    branch: 'user',
    useMode: {
      title: '删除所有权限',
      desc: '传入stuId',
      way: {
        url: '/api/user/president/delete',
        method: 'POST',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: '有stuId信息就删掉所有权限',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: '更新数据库信息',
      reqjson: {
        stuId: 2001,
      }
    },
    successReturn: {
      response: {
        conditions: '删除成功',
        status: 200,
        exampleDesc: '返回Boolean'
      },
      jsonObj: {
        code: 200,
        data: true
      }
    },
    failedReturn: {
      response: {
        conditions: '删除失败（没有该同学）',
        status: 400,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 400,
        message: '没有该同学信息！'
      }
    },
    notice: '设定权限，才能做更多的事情'
  },
  {
    id: '13',
    branch: '文件上传',
    useMode: {
      title: '上传作业',
      desc: '传入file类型文件',
      way: {
        url: '/api/upload/file',
        method: 'POST',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '通过cos上传到腾讯云',
      params: [
        { param: 'file', type: 'File', pattern: '文件类型' },
      ],
    },
    requestMode: {
      notice: '',
      reqjson: {
        file: {},
      }
    },
    successReturn: {
      response: {
        conditions: '上传成功',
        status: 200,
        exampleDesc: '返回文件信息'
      },
      jsonObj: {
        code: 200,
        message: '上传成功',
        fileName: '文件名',
        url: '文件地址',
      }
    },
    failedReturn: {
      response: {
        conditions: '上传失败',
        status: 500,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 500,
        message: '上传失败'
      }
    },
    notice: '先同步至腾讯云，再做进一步处理'
  },
  {
    id: '14',
    branch: '作业相关',
    useMode: {
      title: '班级下所有作业',
      desc: '通过classId,page来查询',
      way: {
        url: '/api/work',
        method: 'GET',
        nLogin: false,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '一次返回5条数据',
      params: [
        { param: 'classId', type: 'Number', pattern: '' },
        { param: 'page', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: '每次查询5条数据，page必填',
      reqjson: {
        classId: 123123,
        page: 1
      }
    },
    successReturn: {
      response: {
        conditions: '查询成功',
        status: 200,
        exampleDesc: '返回当前数据信息'
      },
      jsonObj: {
        code: 200,
        message: '查询成功',
        data: [],
        pagination: {
          total: 25,
          currentPage: 1,
          totalPages: 5,
          perPage: 5,
        },
      }
    },
    failedReturn: {
      response: {
        conditions: '查询失败',
        status: 500,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 500,
        message: '查询失败'
      }
    },
    notice: '一般用作首页数据展示'
  },
  {
    id: '15',
    branch: '作业相关',
    useMode: {
      title: '单个人所有作业',
      desc: '通过 stuId 来查询并限制最多5条',
      way: {
        url: '/api/work/mywork',
        method: 'GET',
        nLogin: false,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '返回5条数据',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: '',
      reqjson: {
        stuId: 12122,
      }
    },
    successReturn: {
      response: {
        conditions: '查询成功',
        status: 200,
        exampleDesc: '返回当前数据信息'
      },
      jsonObj: {
        code: 200,
        data: [],
      }
    },
    failedReturn: {
      response: {
        conditions: '查询失败',
        status: 500,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 500,
        message: '服务器错误！'
      }
    },
    notice: '用作首页展示自己的轮播图展示'
  },
  {
    id: '16',
    branch: '作业相关',
    useMode: {
      title: '某班级下的所有提交作业',
      desc: '通过 classId 来查询并查询最近30天',
      way: {
        url: '/api/work/classwork',
        method: 'GET',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '返回5条数据',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: '',
      reqjson: {
        stuId: 12122,
      }
    },
    successReturn: {
      response: {
        conditions: '查询成功',
        status: 200,
        exampleDesc: '返回当前数据信息'
      },
      jsonObj: {
        code: 200,
        data: [],
      }
    },
    failedReturn: {
      response: {
        conditions: '查询为空',
        status: 500,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 500,
        message: '没有相关数据！'
      }
    },
    notice: '查询某班级提交作业时候使用'
  },
  {
    id: '17',
    branch: '作业相关',
    useMode: {
      title: '单人某项作业',
      desc: '通过 作业id 来查询并查询最近30天',
      way: {
        url: '/api/work/otherwork',
        method: 'GET',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '返回5条数据',
      params: [
        { param: 'id', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: '',
      reqjson: {
        stuId: 12122,
      }
    },
    successReturn: {
      response: {
        conditions: '查询成功',
        status: 200,
        exampleDesc: '返回当前数据信息'
      },
      jsonObj: {
        code: 200,
        data: [],
      }
    },
    failedReturn: {
      response: {
        conditions: '查询为空',
        status: 402,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 402,
        message: '未找到相关信息！'
      }
    },
    notice: '单个作业详情页展示'
  },
  {
    id: '18',
    branch: '作业相关',
    useMode: {
      title: '某同学的某个作业分支的作业信息',
      desc: '通过 stuId, branch 来查询一条',
      way: {
        url: '/api/work/one',
        method: 'GET',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '返回1条数据',
      params: [
        { param: 'stuId', type: 'Number', pattern: '' },
        { param: 'branch', type: 'String', pattern: '' },
      ],
    },
    requestMode: {
      notice: '',
      reqjson: {
        stuId: 12122,
        branch: '数据分析(作业分支名称)',
      }
    },
    successReturn: {
      response: {
        conditions: '查询成功',
        status: 200,
        exampleDesc: '返回当前数据信息'
      },
      jsonObj: {
        code: 200,
        data: {},
      }
    },
    failedReturn: {
      response: {
        conditions: '查询错误',
        status: 500,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 500,
        message: 'error'
      }
    },
    notice: '为提供次作业分支提交的详情信息'
  },
  {
    id: '19',
    branch: '作业相关',
    useMode: {
      title: '已批改的作业',
      desc: '通过 classId, branch 来查询班级下此分支已经批改的作业',
      way: {
        url: '/api/work/correct/work',
        method: 'GET',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '返回 多/0 条数据',
      params: [
        { param: 'classId', type: 'Number', pattern: '' },
        { param: 'branch', type: 'String', pattern: '' },
      ],
    },
    requestMode: {
      notice: '',
      reqjson: {
        classId: 12312123,
        branch: '数据分析(作业分支名称)',
      }
    },
    successReturn: {
      response: {
        conditions: '查询成功',
        status: 200,
        exampleDesc: '返回当前数据信息'
      },
      jsonObj: {
        code: 200,
        data: [],
      }
    },
    failedReturn: {
      response: {
        conditions: '查询错误',
        status: 500,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 500,
        message: 'error'
      }
    },
    notice: '查询到已经通过老师批改的作业'
  },
  {
    id: '20',
    branch: '作业相关',
    useMode: {
      title: '多项作业',
      desc: '通过 classId, branch 来查询班级下此分支已经提交的作业',
      way: {
        url: '/api/work/class/allWork',
        method: 'GET',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '返回 多/0 条数据',
      params: [
        { param: 'classId', type: 'Number', pattern: '' },
        { param: 'branch', type: 'String', pattern: '' },
      ],
    },
    requestMode: {
      notice: '',
      reqjson: {
        classId: 12312123,
        branch: '数据分析(作业分支名称)',
      }
    },
    successReturn: {
      response: {
        conditions: '查询成功',
        status: 200,
        exampleDesc: '返回当前数据信息'
      },
      jsonObj: {
        code: 200,
        data: [],
      }
    },
    failedReturn: {
      response: {
        conditions: '查询为空',
        status: 402,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 402,
        message: '还没有人提交！'
      }
    },
    notice: '查询到已经通过老师批改的作业'
  },
  {
    id: '21',
    branch: '作业相关',
    useMode: {
      title: '删除作业信息',
      desc: '通过 _id 来删除此作业',
      way: {
        url: '/api/work/delete',
        method: 'POST',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: '删除相应作业一条',
      params: [
        { param: '_id', type: 'Number', pattern: '' },
      ],
    },
    requestMode: {
      notice: '_id必填',
      reqjson: {
        _id: 12312123,
      }
    },
    successReturn: {
      response: {
        conditions: '删除成功',
        status: 200,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 200,
        message: '删除成功！',
      }
    },
    failedReturn: {
      response: {
        conditions: '查询为空',
        status: 402,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 402,
        message: '未找到相关作业！'
      }
    },
    notice: '自己可以删除自己的作业'
  },
  {
    id: '22',
    branch: '作业相关',
    useMode: {
      title: '更新作业信息',
      desc: '通过 Work:{} 来删除此作业',
      way: {
        url: '/api/work/upload',
        method: 'POST',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: '修改相应作业一条',
      params: [
        { param: 'work', type: 'Object', pattern: '' },
      ],
    },
    requestMode: {
      notice: 'work包含{_id, id, classId, name, stuId, subject, branch, file, content, score, tComments, favor, isPass, cutTime, user }字段',
      reqjson: {
        _id: 12312123,
        id: 123,
        classId: 123123,
        name: '小王',
        stuId: 2001,
        subject: '数据分析',
        branch: '抖音数据采集',
        file: 'File文件',
        content: '详情',
        score: 0,
        tComments: '教师评论',
        favor: false,
        isPass: false,
        cutTime: '2023-9-2',
        user: '小李',
      }
    },
    successReturn: {
      response: {
        conditions: '更新成功',
        status: 200,
        exampleDesc: '返回成功信息'
      },
      jsonObj: {
        code: 200
      }
    },
    failedReturn: {
      response: {
        conditions: '查询为空',
        status: 402,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 402,
        message: '未找到相关作业！'
      }
    },
    notice: '自己可以更新自己的作业'
  },
  {
    id: '23',
    branch: '作业相关',
    useMode: {
      title: '下载作业（多项）',
      desc: '通过 classId, branch, subject 来查找到作业',
      way: {
        url: '/api/work/download',
        method: 'GET',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: '可以下载多项作业',
      params: [
        { param: 'classId', type: 'Number', pattern: '' },
        { param: 'branch', type: 'String', pattern: '' },
        { param: 'subject', type: 'String', pattern: '' },
      ],
    },
    requestMode: {
      notice: 'classId, branch, subject必填',
      reqjson: {
        classId: 123123,
        branch: '数据分析',
        subject: "抖音数据采集"
      }
    },
    successReturn: {
      response: {
        conditions: '返回带有file文件的数据',
        status: 200,
        exampleDesc: '返回成功信息'
      },
      jsonObj: {
        code: 200,
        stuIds: [2001, 2002],
        data: {
          file: {
            fileUrl: 'xxx',
            fileName: 'yyy'
          },
          stuId: 2001
        }
      }
    },
    failedReturn: {
      response: {
        conditions: '查询为空',
        status: 402,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 402,
        message: '未找到相关作业！'
      }
    },
    notice: '适合一键下载所有同学的作业'
  },
  {
    id: '24',
    branch: '作业相关',
    useMode: {
      title: '下载作业（单项）',
      desc: '通过 classId, branch, subject 来查找到作业',
      way: {
        url: '/api/work/download/one',
        method: 'GET',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: '可以下载单项作业',
      params: [
        { param: 'classId', type: 'Number', pattern: '' },
        { param: 'branch', type: 'String', pattern: '' },
        { param: 'subject', type: 'String', pattern: '' },
      ],
    },
    requestMode: {
      notice: 'classId, branch, subject必填',
      reqjson: {
        classId: 123123,
        branch: '数据分析',
        subject: "抖音数据采集"
      }
    },
    successReturn: {
      response: {
        conditions: '返回带有file文件的数据',
        status: 200,
        exampleDesc: '返回成功信息'
      },
      jsonObj: {
        code: 200,
        stuIds: [2001],
        data: {
          file: {
            fileUrl: 'xxx',
            fileName: 'yyy'
          },
          stuId: 2001
        }
      }
    },
    failedReturn: {
      response: {
        conditions: '查询错误',
        status: 500,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 500,
        message: 'error'
      }
    },
    notice: '适合下载单个同学的作业'
  },
  {
    id: '25',
    branch: '作业相关',
    useMode: {
      title: '上传作业',
      desc: '通过 classId, branch, subject 来查找到作业',
      way: {
        url: '/api/work/submit',
        method: 'POST',
        nLogin: true,
        nAuth: false
      }
    },
    paramsMode: {
      notice: '上传作业',
      params: [
        { param: 'work', type: 'Object', pattern: '' },
      ],
    },
    requestMode: {
      notice: 'work包含{_id, id, classId, name, stuId, subject, branch, file, content, score, tComments, favor, isPass, cutTime, user }字段',
      reqjson: {
        _id: 12312123,
        id: 123,
        classId: 123123,
        name: '小王',
        stuId: 2001,
        subject: '数据分析',
        branch: '抖音数据采集',
        file: 'File文件',
        content: '详情',
        score: 0,
        tComments: '教师评论',
        favor: false,
        isPass: false,
        cutTime: '2023-9-2',
        user: '小李',
      }
    },
    successReturn: {
      response: {
        conditions: '上传成功',
        status: 200,
        exampleDesc: '返回成功信息'
      },
      jsonObj: {
        code: 200,
        data: {}
      }
    },
    failedReturn: {
      response: {
        conditions: '查询错误',
        status: 500,
        exampleDesc: '返回message'
      },
      jsonObj: {
        code: 500,
        message: '服务器错误'
      }
    },
    notice: '每个同学提交作业通过此接口'
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
  return +x.id
}