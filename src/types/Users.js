process.env.NODE_ENV==='dev'&& console.log('src/types/Users')

import {User} from './User'

export class Users
{
  constructor({res,error,errors})
  {
    if(res)
    {
      this.res=res.map(user=>
        {
          const out=new User(user)
          return out
        })
    }
    this.error=error
    this.errors=errors
  }
  res()
  {
    return this.res
  }
  error()
  {
    return this.error
  }
  errors()
  {
    return this.errors
  }
}
