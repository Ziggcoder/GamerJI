const mongoose = require("mongoose");
const TableName = "category";

const TableSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true, 
  },
  keyword:{
    type: String,
    require: true, 
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    require: true, 
  },
  last_update: {
    type: Date,
  },
   delete_status: {
    type:Boolean,
    require:true,
    default:false
}
});
const Table = (module.exports = mongoose.model(TableName, TableSchema));
module.exports.addRow = async (newRow) => {
  const data = await newRow.save();
  return data;
};
module.exports.getDataListByQuery = async () => {
  const data = await Table.find(
    {delete_status:false},
    { id: 1,name:1 }
  );
  return data;
};
module.exports.updateByQuery = async (query,newdata) => {
  const data = await Table.findOneAndUpdate(query, { $set: newdata });
  return data;
};
module.exports.dataDeleteByQuery = async (query) => {
  newdata={delete_status:true}
  const data = await Table.findOneAndUpdate(query, { $set: newdata });
  return data;
};
module.exports.getDataforTable = async () => {

  const data= Table.aggregate([
    {
      $match: {delete_status:false}
    },
    {
        "$project": {
            _id:1,
            name:1,
            description:1,
          "created_by": {
            "$toObjectId": "$created_by"
          }
        }
      },
      {
        "$lookup": {
          "from": "user_infos",
          "localField": "created_by",
          "foreignField": "_id",
          "as": "output"
        }
      },
      { $unwind: "$output" },
    {
      $project: {
        _id:1,
        name:1,
        description:1,
        created_by:"$output.user_id"
    }
    }
  ])

return data; 
};


///Internal use 
module.exports.getDataByQueryFilterDataOne = async (query) => {
  const data = await Table.findOne(
    query,
    { delete_status: 0,created_at:0,last_update:0, __v: 0 }
  );
  return data;
};

module.exports.getDataCountByQuery = async (query) => {
  const data = await Table.find(query).count();
  return data;
};

module.exports.getId = async (query) => {
  const data = await Table.findOne(query);
  return data.id;
};
