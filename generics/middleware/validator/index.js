let fs = require("fs");
module.exports = (req, res, next) => {

    let validatorPath;
    
    if (req.params.file) {
        validatorPath =
         ROOT_PATH + `/module/${req.params.controller}/${req.params.file}/validator/${req.params.version}.js`;
    } else {
        validatorPath = 
        ROOT_PATH + `/module/${req.params.controller}/validator/${req.params.version}.js`;
    }

    if (fs.existsSync(validatorPath)) require(validatorPath)(req);

    next();

    return

}