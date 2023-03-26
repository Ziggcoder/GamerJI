const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const TableName = "user_info";

const TableSchema = mongoose.Schema({
   
    user_id: {
        type:String,
        required: true,
        trim: true,
        unique: true
    },
    first_name: {
        type: String,
        // required: true,
        trim: true
    },
    last_name: {
         type: String,
        // required: true,
        trim: true   
     },
    email: {
        type: String,
    },
    role: {
        type:String,
        require:true,
        default:"Role N/A"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_update: {
        type: Date,
    },
    delete_status: {
        type:Boolean,
        require:true,
        default:false
    },
    token: {
            type: String,
            required: true
        },
    password:{
        type: String,
        required: true,

    },
    admin: {
            type: String,
            required: true,
            default:"null"
    }  

});

//middleware for JWT TOken.....
TableSchema.methods.generateAuthToken = async function () { //middleware for generate token and store this registration token in DB token array
       // console.log("generating token ")
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);//generate token by jwt.sign method.
       // console.log(token);
        this.token=token;
        doc= await this.save()
       // console.log("🚀 ~ file: m_user_info.js:115 ~ doc", doc)  
        return token;// return token to middleware method call in server.js   
}

const Table = (module.exports = mongoose.model(TableName, TableSchema));
//const OldTable = mongoose.model("old" + TableName, TableSchema);
//TODO:THIS IS USING at /SuperAdminRegistration
module.exports.addRow = async (newRow) => {
    const data = await  newRow.save();
    return data;
};
//TODO:THIS IS USING at /User/:id
module.exports.getLoginData = async (user_id) => {

    const data = await Table.findOne({user_id:user_id},{token:1,password:1});
    return data; 
};
//TODO:THIS IS USING at Not using right now
module.exports.getDataByIdFullData = async (id,admin) => {
    const data = await Table.findOne({_id:id,admin:admin});
    return data; 
};
//TODO:THIS IS USING at GET /User/:id
module.exports.getDataByIdFilterData = async (id,admin) => {
    const data = await Table.findOne({_id:id,admin:admin},{delete_status:0,token:0,password:0,otp:0,__v:0});
    return data; 
};
module.exports.getDataByQueryFilterDataOne = async (query) => {
   //// console.log("🚀 ~ file: m_user_info.js:145 ~ module.exports.getDataByQueryFilterDataOne= ~ query", query)
    const data = await Table.findOne(
      query,
      { delete_status: 0,created_at:0,last_update:0,token:0,password:0,otp:0,admin:0,city:0,state:0,country:0,area:0,__v: 0 }
    );
    return data;
  };
module.exports.getDataCount = async (admin) => {
  // // console.log("🚀 ~ file: m_user_info.js:145 ~ module.exports.getDataCount= ~ admin", admin)
    const data = await Table.findOne({admin:admin}).count();
    return data; 
};
module.exports.getDataCountByQuery = async (query) => {
    
    const data = await Table.findOne(query).count();
    return data; 
};
module.exports.getAllData = async (admin) => {
    const data = await Table.find({admin:admin},{delete_status:0,token:0,password:0,otp:0,__v:0});
    return data; 
};
module.exports.getAllDataForTable  = async (admin) => {
   // const data = await Table.find({admin:admin},{user_id:1,display_name:1,role:1,admin:1});
    const data= Table.aggregate([
        {
          $match: {
            admin:admin
          }
        },
        {
            "$project": {
                _id:1,
                user_id:1,
                display_name:1,
                role:1,
              "admin": {
                "$toObjectId": "$admin"
              }
            }
          },
          {
            "$lookup": {
              "from": "user_infos",
              "localField": "admin",
              "foreignField": "_id",
              "as": "output"
            }
          },
          { $unwind: "$output" },
        {
          $project: {
            _id:1,
            "user id":"$user_id",
            "display name":"$display_name",
            role:1,
            admin:"$output.user_id"
        }
        }
      ])

    return data; 
};
module.exports.getDataList = async (admin) => {
    const data = await Table.find({admin:admin},{id:1,user_id:1,user_last_name:1,user_first_name:1});
    return data; 
};
module.exports.updateById = async (id,newdata,admin) => {
    newdata.last_update=Date.now()
     const data = await Table.findByIdAndUpdate(id, { $set: newdata });
     const token = await data.generateAuthToken();
    // console.log("🚀 ~ file: m_user_info.js:211 ~ module.exports.updateById= ~ token", token)
    //const data = await Table.find({admin:admin},{delete_status:0,token:0,password:0,otp:0,__v:0});
    return data; 
};
module.exports.dataDeleteByQuery = async (query) => {
    const data = await Table.findOneAndRemove(query);
    return data;
  };




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.getDataByFieldName = (fieldName, fieldValue, callback) => {
    let query = {};
    query[fieldName] = fieldValue;
    Table.find(query, callback);
};
module.exports.getDataByFieldNames = (fieldNames, fieldValues, callback) => {
    let query = {};
    for (let i = 0; i < fieldNames.length; i++) {
        const fieldName = fieldNames[i];
        const fieldValue = fieldValues[i];
        query[fieldName] = fieldValue;
    }
    Table.find(query, callback);
};