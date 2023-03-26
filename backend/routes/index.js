var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const TableModel = require('../model/m_user_info');
const rc = require('./../controllers/responseController');
const { asyncHandler } = require('../middleware/asyncHandler');

/* GET home page. */
router.get('/', function(req, res, next) {
 res.status(200).json({path:"/",status:"success"});
});

router.post('/api/Login', asyncHandler(
    async (req, res) => {
        const user_id = req.body.user_id
        const password = req.body.password
        const data = await TableModel.getLoginData(user_id);
        if (data) {
            const passwordmatch = await bcrypt.compare(password, data.password);
            if (passwordmatch) {
                return rc.setResponse(res, {
                    success: true,
                    msg: 'Data Fetched',
                    data: data.token
                });
            } else {
                return rc.setResponse(res, {
                    msg: "Invalid Password"
                })
            }

        } else {
            return rc.setResponse(res, {
                msg: "User not Found",
                data: { user_id: user_id }
            })
        }
    }
));

module.exports = router;