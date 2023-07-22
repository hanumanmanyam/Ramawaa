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
    price:{
        type: Number,
        required:true
    }

});
const Menu1 =mongoose.model('Menu1',userSchema);
module.exports = Menu1;