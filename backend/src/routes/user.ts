import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { decode, verify, sign } from 'hono/jwt'
import { signupSchema, signinSchema } from '@amartyasharma/medium-common'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()



userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signupSchema.safeParse(body)
    if(!success){
        return c.json({
            messgae: "Wrong inputs"
        }, 411)
    }
    const existingUser = await prisma.user.findUnique({
        where: {email: body.email}
    })

    if(existingUser){
        return c.json({
            message: "UserExist"
        }, 409)
    }
    try{
        const user = await prisma.user.create({
            data: {
              firstName: body.firstName,
              lastName: body.lastName,
              email: body.email,
              password: body.password 
            }
          });
        const token = await sign({id: user.id}, c.env.JWT_SECRET)
        return c.json({
            jwt: token
        }, 200)
    }
    catch(error){
        return c.json({

            message: error
        }, 500)
    }
    
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signinSchema.safeParse(body)
    if(!success){
        return c.json({
            messgae: "Wrong inputs"
        }, 411)
    }
    const existingUser = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
    })

    if(!existingUser){
        return c.json({error: "User not found"})
    }

    try{
        const jwt = await sign({id: existingUser.id}, c.env.JWT_SECRET)
        return c.json({jwt})
    }
    catch(error){
        return c.json({error: error}, 500)
    }

})
