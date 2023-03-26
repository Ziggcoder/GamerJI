const express = require('express');
const router = express.Router();
const TableModel = require('../model/m_product');
const TableModelCategory = require('../model/m_category');
const TableModelSubCategory = require('../model/m_subcategory');
const rc = require('../controllers/responseController');
const { asyncHandler } = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');


router.get('/Datalist', auth, asyncHandler(//getDataListByQuery
    async (req, res, next) => {
        const query = {
            admin: req.user.id
        }
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
router.get('/Table/:page/:dataperpage', auth, asyncHandler(
    async (req, res, next) => {
        const page = req.params.page
        const dataperpage = req.params.dataperpage
      
            const data = await TableModel.getDataforTablePagination(page, dataperpage);
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
router.post('/Search/:page/:dataperpage', auth, asyncHandler(
    async (req, res) => {
        const page = req.params.page
        const dataperpage = req.params.dataperpage
        const searchData = req.body
        var searchdata = req.body
      
        if (searchdata.subcategoryid) {
            console.log("subcategory available")
            const query = {
                name:searchdata.subcategoryid
            }
            searchdata.subcategoryid = await TableModelSubCategory.getId(query);

        } else if (searchdata.categoryid) {
            console.log("category available")
            const query = {
                name:searchdata.categoryid
            }
            searchdata.categoryid = await TableModelCategory.getId(query);
        } else {
            return rc.setResponse(res, {
                msg: "Data not Found"
            })
        }
         query=searchData
            const data = await TableModel.getDataforTablePaginationWithQuery(page, dataperpage, query);
            console.log("🚀 ~ file: r_product.js:30 ~ data:", data)
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
)
);
router.post('/', auth, asyncHandler(
    async (req, res) => {
        if (req.user.role === "SuperAdmin") {
            query = {
                name: req.body.categoryid,
                delete_status: false
            }
            var cdata = await TableModelCategory.getDataByQueryFilterDataOne(query);
            if (cdata) {
                query = {
                    name: req.body.subcategoryid,
                    delete_status: false
                }
                var sdata = await TableModelSubCategory.getDataByQueryFilterDataOne(query);
                if (sdata) {
                    query = {
                        name: req.body.name,
                        delete_status: false
                    }
                    const count = await TableModel.getDataCountByQuery(query);
                    if (!count) {
                        console.log("🚀 ~ file: r_country.js:129 ~ count", count)
                        req.body.categoryid = cdata.id
                        req.body.subcategoryid = sdata.id
                        let newRow = new TableModel(req.body);
                        newRow.created_by = req.user.id
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
                    } else {
                        return rc.setResponse(res, {
                            msg: "Product is Already Exist"
                        })
                    }
                } else {
                    return rc.setResponse(res, { error: "SubCategory Not Exist" });
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
router.get('/:id',auth, asyncHandler( //getDataByQueryFilterData
    async (req, res, next) => {
    if (req.user.role === "SuperAdmin") {
        const id = req.params.id
            const query = {
                _id: id
            }
            var pdata = await TableModel.getDataByQueryFilterDataOne(query);
            if (pdata) {
                const query = {
                    _id:pdata.categoryid
                }
                const cdata = await TableModelCategory.getDataByQueryFilterDataOne(query);
                if(cdata){
                    const query = {
                        _id:pdata.subcategoryid
                    }
                    const sdata = await TableModelSubCategory.getDataByQueryFilterDataOne(query);
                    if(sdata){
                       pdata.subcategoryid=sdata.name
                       pdata.categoryid=cdata.name
                       return rc.setResponse(res, {
                        success: true,
                        msg: 'Data Fetched',
                        data: pdata
                    });

                    }else{
                        return rc.setResponse(res, {
                            msg: "Data not Found"
                        })
                    }
                }else{
                    return rc.setResponse(res, {
                        msg: "Data not Found"
                    })
                }
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
router.put("/:id", auth, asyncHandler(
    async (req, res, next) => {
        const newData = req.body;
        newData.created_by = req.user.id;
        newData.last_update = Date.now();
        if (req.user.role === "SuperAdmin") {
            query = {
                name: req.body.categoryid,
                delete_status: false
            }
            var cdata = await TableModelCategory.getDataByQueryFilterDataOne(query);
            if (cdata) {
                query = {
                    name: req.body.subcategoryid,
                    delete_status: false
                }
                var sdata = await TableModelSubCategory.getDataByQueryFilterDataOne(query);
                if (sdata) {
                query = { _id: req.params.id, delete_status: false };
                newData.categoryid = cdata.id
                newData.subcategoryid = sdata.id
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
                return rc.setResponse(res, { error: "SubCategory Not Exist" });
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
    } else {
        return rc.setResponse(res, { error: { code: 403 } });
    }  
       
    }
));






module.exports = router;