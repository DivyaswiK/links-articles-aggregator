import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI){
    throw new Error('Please define the correct connection URI.');
}
async function ConnetToDb() {
    try{
        if(mongoose.connection.readyState === 1){
            console.log("Already connected to the database.");
            return;
        }

        await mongoose.connect(MONGODB_URI);

        console.log("Connected to db");
    }catch(error){
        console.error("Error connecting to the database:", error);
        throw new Error("Database connection failed.");
    }
}

export default ConnetToDb;