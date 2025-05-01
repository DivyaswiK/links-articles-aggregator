import mongoose from "mongoose";

const TagSchemas = new mongoose.Schema({
    tag : {
        type: String, required : true, unique: true
    },

    links :[{
        url :{type: String , required:true },
        upvote :{type: Number, default : 0},
    }],   
}, {timestamps:true});

export default mongoose.models.Tag || mongoose.model('Tag', TagSchemas, 'links');
