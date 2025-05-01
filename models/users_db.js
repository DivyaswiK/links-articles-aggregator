import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username : {type : String, required : true, unique : true},
    email : {type : String, required : true, unique :true},
    password : {type : String, required : true},
    preferences :{
        type : [String],
        default : [],
    } ,
    headings : {
        type : [String],
        default : [],
    },
    likedPosts: {
        type: [
            {
                title: String,
                content: String,
                image: String,
                link: String,
                createdAt: { type: Date, default: Date.now }
            }
        ],
        default: []
    },
    watchLater: {
        type: [
            {
                title: String,
                content: String,
                image: String,
                link: String,
                createdAt: { type: Date, default: Date.now }
            }
        ],
        default: []
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User',UserSchema);