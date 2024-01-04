import mongoose, { Schema } from "mongoose"

const noteSchema =new Schema({
    title: {
        type: String,
        required: true,
        maxlenght:100
    },
    content : {
        type:String,
        require: true,
        maxlenght:1000
    },
    createdBy: {
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{ timestamps : true });


export const Note = mongoose.model("Note", noteSchema)