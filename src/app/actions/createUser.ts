'use server';
import prisma from '../lib/dbConnect'

async function createUser(userData : any) {
    try{
        const userInfo = await prisma.user.create({
            data : userData
        })
        return {
            message : 'Successfully saved', 
            userInfo,
        }
    }catch (err: any) {
        return{
            message : "Failed to create user", 
            err,
        };
    }
}

export default createUser;