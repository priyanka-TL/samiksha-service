module.exports = async function (req, res, next) {
    
    
    let paths = [
        'solutions/targetedSolutions',
        'solutions/details',
        'solutions/verifyLink',
        'programs/targetedPrograms'
    ]

    let performTenantAndOrgCheck = false;


  await Promise.all(
    paths.map(async function (path) {
      if (req.path.includes(path)) {
        performTenantAndOrgCheck = true;
      }
    })
  );

  if(performTenantAndOrgCheck){
    let tenantFilter =  gen.utils.returnTenantDataFromToken(req.userDetails);
    req.body['tenantId'] = tenantFilter.tenantId
    req.body['orgId'] = tenantFilter.orgId
  }


    next();
    return;
  };
  