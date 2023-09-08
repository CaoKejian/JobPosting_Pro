export type Root = Root2[]

export interface Root2 {
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
  reqjson: Reqjson
}

export interface Reqjson {
  name: string
  sex: string
  age: number
}

export interface SuccessReturn {
  response: Response
  jsonObj: JsonObj
}

export interface Response {
  conditions: string
  status: number
  exampleDesc: string
}

export interface JsonObj {
  data: any[]
  code: number
  message: string
}

export interface FailedReturn {
  response: Response2
  jsonObj: JsonObj2
}

export interface Response2 {
  conditions: string
  status: number
  exampleDesc: string
}

export interface JsonObj2 {
  data: any[]
  code: number
  message: string
}

export const portTree: Root = [
  {
    useMode: {
      title: '更新用户信息',
      desc: '通过name来找相关用户，更新信息',
      way: {
        url: '/api/user/upload',
        method: 'POST',
        nLogin: true,
        nAuth: true
      }
    },
    paramsMode: {
      notice: 'stuId 是必填的，根据它有很多重要操作',
      params: [
        { param: 'name', type: 'String', pattern: '' },
        { param: 'stuId', type: 'String', pattern: '' },
        { param: 'classId', type: 'String', pattern: '6位数字' }
      ],
    },
    requestMode: {
      notice: 'name必传',
      reqjson: {
        name: 'lucy',
        sex: 'female',
        age: 18,
      }
    },
    successReturn: {
      response: {
        conditions: 'stuId必填',
        status: 200,
        exampleDesc: '根据stuId来查询一个人，例如：'
      },
      jsonObj:{
        data:[],
        code: 200,
        message: '成功'
      }
    },
    failedReturn: {
      response: {
        conditions: 'stuId必填',
        status: 400,
        exampleDesc: 'stuId没有注册，也就是stuId错误，返回例如：'
      },
      jsonObj:{
        data:[],
        code: 200,
        message: '成功'
      }
    },
    notice: '如果用户的用户信息不存在，将会使用请求的数据创建一个新的用户信息。'
  }
]