import { Log } from '../models/log.model';

export const createLog = async( userId: string, data: any ) =>{
    return await Log.create({
        user: userId,
        ...data,
    })
}

export const gatherUserLogs = async( userId: string ) => {
    return await Log.find({ user: userId }).sort({ date: -1 });
}