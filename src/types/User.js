process.env.NODE_ENV==='dev'&& console.log('src/types/User')

export class User
{
  constructor(user)
  {
    this.user=user
  }
  id()
  {
    return this.user._id
  }
  name()
  {
    return this.user.name
  }
  email()
  {
    return this.user.email
  }
}
