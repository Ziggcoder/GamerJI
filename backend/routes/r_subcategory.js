const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const TableModel = require('../model/m_subcategory');
const TableModelCategory = require('../model/m_category');
const rc = require('../controllers/responseController');
const { asyncHandler } = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');

router.post('/', auth, asyncHandler(
    async (req, res) => {
        if (req.user.role === "SuperAdmin") {
             query={
                name:req.body.categoryid,
                delete_status:false
               }
                var cdata = await TableModelCategory.getDataByQueryFilterDataOne(query);
                if (cdata){
                    query={name:req.body.name,
                        delete_status:false}
                  const count = await TableModel.getDataCountByQuery(query); 
                if(!count){
                    console.log("🚀 ~ file: r_country.js:129 ~ count", count)
                    req.body.categoryid=cdata.id
                let newRow = new TableModel(req.body);
                newRow.created_by=req.user.id
                if (!newRow) {
                    return rc.setResponse(res, {
                        msg: 'No Data to insert'
                    });
                }
                const data = await TableModel.addRow(newRow);
                if (data) {
                    return rc.setResponse(res, {
                        success: true,
                        msg: 'Data Inserted',
                        data: data
                    });
                }
            }else{
                return rc.setResponse(res, {
                    msg: "SubCategory Already Exist"
                })
            }
            } else {
                return rc.setResponse(res, { error: "Category Not Exist" });
            }
        } else {
            return rc.setResponse(res, { error: { code: 403 } });
        }
    }
)
);
router.get('/',auth, asyncHandler( //getDataByQueryFilterData
    async (req, res, next) => {
    if (req.user.role === "SuperAdmin") {
        const data = await TableModel.getDataforTable();
        if (data) {
            return rc.setResponse(res, {
                success: true,
                msg: 'Data Fetched',
                data: data
            });
        } else {
            return rc.setResponse(res, {
                msg: "Data not Found"
            })
        }
    } else {
        return rc.setResponse(res, { error: { code: 403 } });
    }
    }
));
router.get('/Datalist',auth, asyncHandler(//getDataListByQuery
    async (req, res, next) => {
       let query={}
        const data = await TableModel.getDataListByQuery(query);
        if (data) {
            return rc.setResponse(res, {
                success: true,
                msg: 'Data Fetched',
                data: data
            });
        } else {
            return rc.setResponse(res, {
                msg: "Data not Found"
            })
        }
    
    }
));
// router.get('/:id', auth, asyncHandler( //outdated//FIXME:Copy from User info
//     async (req, res, next) => {
//         const admin=req.user.id
//         const id = req.params.id;
//         if (req.user.role === "SuperAdmin") {
//         const data = await TableModel.getDataByIdData(id);
//         if (data) {
//             return rc.setResponse(res, {
//                 success: true,
//                 msg: 'Data Fetched',
//                 data: data
//             });
//         } else {
//             return rc.setResponse(res, {
//                 msg: "Data not Found"
//             })
//         }
//     } else {
//         return rc.setResponse(res, { error: { code: 403 } });
//     }
//     }
// ));
router.patch(
  "/:id",
  auth,
  asyncHandler(async (req, res, next) => {
    const newData = req.body;
    newData.created_by = req.user.id;
    newData.last_update = Date.now();
    
    if (req.user.role === "SuperAdmin") {
        query={
            name:req.body.categoryid,
            delete_status:false
           }
            var cdata = await TableModelCategory.getDataByQueryFilterDataOne(query);
            if (cdata) {
         query = { _id: req.params.id, delete_status: false };
         newData.categoryid=cdata.id
      const data = await TableModel.updateByQuery(query, newData);
      if (data) {
        return rc.setResponse(res, {
          success: true,
          msg: "Data Fetched",
          data: data,
        });
      } else {
        return rc.setResponse(res, {
          msg: "Data not Found",
        });
      }
    } else {
        return rc.setResponse(res, { error: "Category Not Exist" });
    }
    } else {
      return rc.setResponse(res, { error: { code: 403 } });
    }
  })
);
router.delete('/:id', auth, asyncHandler( 
    async (req, res, next) => {
      
        if (req.user.role === "SuperAdmin") {
            query={_id:req.params.id, delete_status:false}
            const data = await TableModel.dataDeleteByQuery(query);
            if (data) {
                return rc.setResponse(res, {
                    success: true,
                    msg: 'Data Fetched',
                    data: data
                });
            } else {
                return rc.setResponse(res, {
                    msg: "Data not Found"
                })
            }

        // }else{
        //     console.log("🚀 ~ file: r_country.js:129 ~ count", count)
        //     return rc.setResponse(res, {
        //         msg: "Can't Delete this Country It has State Data"
        //     })
        // }
    } else {
        return rc.setResponse(res, { error: { code: 403 } });
    }  
       
    }
));


module.exports = router;