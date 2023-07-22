const mongoose= require('mongoose');
const userSchema=new mongoose.Schema({
    
   order:[{ 
    name:{
        type: String,
        required: true,

    },
    cat:{
        type: String,
        required: true,

    },
    count:{
        type: Number,
        required:true,

    },
    total:{
        type: Number,
        required:true
    },
    table:{
        type :String,
        required:true
    },
    opt:{
        type:String,
        required:true
    }

}]},{
    timestamps: true,

});
const History =mongoose.model('History',userSchema);
module.exports = History;