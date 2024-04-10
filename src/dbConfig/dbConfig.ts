import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection

        connection.on("connected", () =>{
            console.log("MONGODB Connected");
        });
        connection.on("error", (err) =>{
            console.log("MONGODB Error:"+ err);
            process.exit();
        });
    } catch (error) {
        console.log("DB connection Error : " + error);
    }
}