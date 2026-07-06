import mongoose from "mongoose";

type Connectionobject = {
    isconnected?: number;
}

const connection: Connectionobject = {}

async function dbConnect() : Promise<void> {
    if (connection.isconnected) {
        console.log("Already connected to database");
        return;
    }

    try {
         const db = await mongoose.connect(process.env.MONGODB_URL as string);

         connection.isconnected = db.connections[0].readyState;

         console.log("Connected to database");


    } catch (error) {

        console.log("Error connecting to database", error);

        process.exit(1);
        
    }
    
}    

export default dbConnect;