const mongoose = require("mongoose");
const TableName = "product";

const TableSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true, 
  },
  categoryid:{
    type: String,
    require: true, 
  },
  subcategoryid:{
    type: String,
    require: true, 
  },
  price:{
    type:Number,
    require:true,
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
            "categoryid": {
              "$toObjectId": "$categoryid"
            },
    
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
        "$lookup": {
          "from": "categories",
          "localField": "categoryid",
          "foreignField": "_id",
          "as": "output2"
        }
      },
      { $unwind: "$output2" },
    {
      $project: {
        _id:1,
        name:1,
        description:1,
        created_by:"$output.user_id",
        categoryid:"$output2.name"
    }
    }
  ])

return data; 
};
module.exports.getDataforTablePagination = async (page, dataperpage) => {
  const skipdata = page * dataperpage - dataperpage;
  const dp = parseInt(dataperpage);
  let end = skipdata + parseInt(dataperpage);
  const data = await Table.aggregate([
    { $sort: { created_at: -1 } },
    {
      $match: {delete_status:false}
    },
    {
      $facet: {
        metadata: [
          { $count: "count" },
          {
            $addFields: { start: skipdata + 1, end: end, page: parseInt(page) },
          },
        ],
        data: [
          { $skip: skipdata },
          { $limit: dp },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              categoryid: {
                $toObjectId: "$categoryid",
              },
              subcategoryid: {
                $toObjectId: "$subcategoryid",
              },
              price: 1,
              created_by: {
                $toObjectId: "$created_by",
              },
              created_at: 1,
            },
          },
          {
            $lookup: {
              from: "user_infos",
              localField: "created_by",
              foreignField: "_id",
              as: "output",
            },
          },
          { $unwind: "$output" },
          {
            $lookup: {
              from: "categories",
              localField: "categoryid",
              foreignField: "_id",
              as: "output2",
            },
          },
          { $unwind: "$output2" },
          {
            $lookup: {
              from: "subcategories",
              localField: "subcategoryid",
              foreignField: "_id",
              as: "output3",
            },
          },
          { $unwind: "$output3" },
          {
            $project: {
              _id: 1,
              "name": "$name",
              "category":"$output2.name",
              "sub category":"$output3.name",
              description: 1,
              price: "$price",
              "created by": "$output.user_id",
              // "created at": {
              //   $dateToString: {
              //     format: "%Y-%m-%d %H:%M:%S",
              //     date: "$created_at",
              //     timezone: "Asia/Kolkata",
              //   },
              // },
            },
          },
        ],
      },
    },
  ]);
  const jsonData = {
    metadata: data[0].metadata[0],
    data: data[0].data,
  };
    console.log("🚀 ~ file: m_product.js:207 ~ module.exports.getDataforTablePagination= ~ data:", data)
  console.log("🚀 ~ file: m_product.js:206 ~ module.exports.getDataforTablePagination= ~ jsonData:", jsonData)

  return jsonData;
};
module.exports.getDataforTablePaginationWithQuery = async (page, dataperpage,query) => {
  console.log("🚀 ~ file: m_product.js:172 ~ module.exports.getDataforTablePaginationWithQuery= ~ query:", query)
  const skipdata = page * dataperpage - dataperpage;
  const dp = parseInt(dataperpage);
  let end = skipdata + parseInt(dataperpage);
  query.delete_status=false
  const data = await Table.aggregate([
    {
      $match: query
    },
    { $sort: { created_at: -1 } },
    {
      $facet: {
        metadata: [
          { $count: "count" },
          {
            $addFields: { start: skipdata + 1, end: end, page: parseInt(page) },
          },
        ],
        data: [
          { $skip: skipdata },
          { $limit: dp },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              categoryid: {
                $toObjectId: "$categoryid",
              },
              subcategoryid: {
                $toObjectId: "$subcategoryid",
              },
              price: 1,
              created_by: {
                $toObjectId: "$created_by",
              },
              created_at: 1,
            },
          },
          {
            $lookup: {
              from: "user_infos",
              localField: "created_by",
              foreignField: "_id",
              as: "output",
            },
          },
          { $unwind: "$output" },
          {
            $lookup: {
              from: "categories",
              localField: "categoryid",
              foreignField: "_id",
              as: "output2",
            },
          },
          { $unwind: "$output2" },
          {
            $lookup: {
              from: "subcategories",
              localField: "subcategoryid",
              foreignField: "_id",
              as: "output3",
            },
          },
          { $unwind: "$output3" },
          {
            $project: {
              _id: 1,
              "name": "$name",
              "category":"$output2.name",
              "sub category":"$output3.name",
              description: 1,
              price: "$price",
              "created by": "$output.user_id",
              // "created at": {
              //   $dateToString: {
              //     format: "%Y-%m-%d %H:%M:%S",
              //     date: "$created_at",
              //     timezone: "Asia/Kolkata",
              //   },
              // },
            },
          },
        ],
      },
    },
  ]);
  const jsonData = {
    metadata: data[0].metadata[0],
    data: data[0].data,
  };
  if(jsonData.metadata){
    return jsonData;
  }else{
    throw "Data Not found"
  }
 
 
};

module.exports.getDataByQueryFilterDataOne = async (query) => {
  const data = await Table.findOne(query, {
    delete_status: 0,
    created_at: 0,
    last_update: 0,
    __v: 0,
  });

  
  return data;
};


module.exports.getId = async (query) => {
  const data = await Table.findOne(query);
  return data.id;
};
///Internal use 
module.exports.getDataCountByQuery = async (query) => {
  const data = await Table.find(query).count();
  return data;
};

