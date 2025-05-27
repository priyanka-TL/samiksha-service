/**
 * name : addTenantAndOrgInRequest.js
 * author : Mallanagouda R Biradar
 * Date : 26-May-2025
 * Description : addTenantAndOrgInRequest middleware.
 */

module.exports = async function (req, res, next) {
  let paths = ['solutions/targetedSolutions', 'solutions/details', 'solutions/verifyLink', 'programs/targetedPrograms','surveys/details','solutions/detailsBasedOnRoleAndLocation'];

  let performTenantAndOrgCheck = false;

  await Promise.all(
    paths.map(async function (path) {
      if (req.path.includes(path)) {
        performTenantAndOrgCheck = true;
      }
    })
  );

  if (performTenantAndOrgCheck) {
    let tenantFilter = gen.utils.returnTenantDataFromToken(req.userDetails);
    req.body['tenantId'] = tenantFilter.tenantId;
    req.body['organizations'] = [tenantFilter.orgId];
  }

  next();
  return;
};
