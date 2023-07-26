const mongoose= require('mongoose');
const userSchema=new mongoose.Schema({
    
    
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

});
const Pending =mongoose.model('Pending',userSchema);
module.exports = Pending;