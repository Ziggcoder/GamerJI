module.exports.setResponse = (res, { success, msg, data,error }) => {
    // console.log("🚀 ~ file: responseController.js:2 ~ error", error)
    let resp = {
        success: success ? success : false,
        msg: msg ? msg :"",
        data: data ? data : {}
    };
    if(error){
        if(error.code===11000){
            resp.msg=`Duplicate Entry`
            resp.data=error.keyValue
        }
        else if(error.code===403){
            resp.msg=`Permission denied `
        }
        else if(error.name==="JsonWebTokenError"){
            resp.msg=`${error.name}:${error.message}`
        }
        else{
            resp.msg=error+""
            resp.data=""
        }
    }else{

    }

    res.json(resp);
}