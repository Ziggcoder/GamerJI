const rc = require('./../controllers/responseController');

module.exports.asyncHandler =(fn)=>async(req,res,next)=>{
   
    try{
        console.log(`${req.method}~${req.originalUrl}\nQ~${JSON.stringify(req.query)}\nP~${JSON.stringify(req.params)}\nB~${JSON.stringify(req.body)}`)
        await fn(req,res,next)
    }catch(error){
       console.log("🚀 ~ file: asyncHandler.js:11 ~ module.exports.asyncHandler= ~ error", error)
        return rc.setResponse(res, {
            error:error
        });
    }
}

module.exports.asyncHandler2 =(fn)=>async(data)=>{
   console.log("🚀 ~ file: asyncHandler.js:18 ~ module.exports.asyncHandler2= ~ data", data)
    try{
        await fn(data)
    }catch(error){
        console.log("🚀 ~ file: asyncHandler.js:26 ~ module.exports.asyncHandler2= ~ error", error)
        return rc.setResponse(res, {
            error:error
        });
    }
}

