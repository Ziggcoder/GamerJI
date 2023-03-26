const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const TableModel = require('../model/m_user_info');
const rc = require('./../controllers/responseController');
const { asyncHandler } = require('../middleware/asyncHandler');

router.post('/Registration', asyncHandler(
    async (req, res) => {
        if (req.body.role === "SuperAdmin") {
            if (req.body.password === req.body.cpassword) {
                const hashpassword = await bcrypt.hash(req.body.password, 10);
                let newRow = new TableModel(req.body);
                newRow.password = hashpassword
                if (!newRow) {
                    return rc.setResponse(res, {
                        msg: 'No Data to insert'
                    });
                }
                const token = await newRow.generateAuthToken();
                const data = await TableModel.addRow(newRow);
                if (data) {
                    return rc.setResponse(res, {
                        success: true,
                        msg: 'Data Inserted',
                        data: newRow.token
                    });
                }
            } else {
                return rc.setResponse(res, {
                    error: "Password and Confirm Password Not Matched"
                });
            }
        } else {
            return rc.setResponse(res, { error: { code: 403 } });
        }
    }
)
);



module.exports = router;