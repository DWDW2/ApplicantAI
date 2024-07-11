import { envs } from "./config/env"
import mongoose from "mongoose"
const connectdb = async () => { 
    try{
        await mongoose.connect(envs.MONGO_URI)
        console.log('connected to mongo')
    }catch(err){
        console.log(err)
    }   
}

export default connectdb;