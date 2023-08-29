module.exports = (req) => {
  let entityValidator = {
    update: function () {
      req.checkQuery('type').exists().withMessage('required type');
      //     if (req.query.type == "parent") {
      //         req.check('studentName').exists().withMessage("invalid student name")
      //         req.check('grade').exists().withMessage("invalid grade")
      //         req.check('name').exists().withMessage("invalid name")
      //         req.check('gender').exists().withMessage("invalid gender")
      //         req.check('type').exists().withMessage("invalid type")
      //         req.check('typeLabel').exists().withMessage("invalid type label")
      //         req.check('phone1').exists().withMessage("invalid phone1")
      //         req.check('phone2').exists().withMessage("invalid phone2")
      //         req.check('address').exists().withMessage("invalid address")
      //         req.check('schoolId').exists().withMessage("invalid school id")
      //         req.check('schoolName').exists().withMessage("invalid school name")
      //         req.check('programId').exists().withMessage("invalid program id name")
      //         req.checkParams('_id').exists().withMessage("required parent registry id")
      //             .isMongoId().withMessage("invalid parent registry id")
      //     } else if (req.query.type == "teacher") {
      //         req.check('name').exists().withMessage("invalid name")
      //         req.check('qualifications').exists().withMessage("invalid qualifications")
      //         req.check('yearsOfExperience').exists().withMessage("invalid years of experience")
      //         req.check('yearsInCurrentSchool').exists().withMessage("invalid years in current school")
      //         req.check('schoolId').exists().withMessage("required school id")
      //             .isMongoId().withMessage("invalid school id")
      //         req.check('schoolName').exists().withMessage("invalid school name")
      //         req.check('programId').exists().withMessage("required program id")
      //             .isMongoId().withMessage("invalid program id")
      //         req.checkParams('_id').exists().withMessage("required teacher registry id")
      //             .isMongoId().withMessage("invalid teacher registry id")
      //     } else if (req.query.type = "schoolLeader") {
      //         req.check('name').exists().withMessage("invalid name")
      //         req.check('age').exists().withMessage("invalid age")
      //         req.check('gender').exists().withMessage("invalid gender")
      //         req.check('bio').exists().withMessage("invalid bio")
      //         req.check('experienceInEducationSector').exists().withMessage("invalid experience in education sector")
      //         req.check('experienceInCurrentSchool').exists().withMessage("invalid experience in current school")
      //         req.check('experienceAsSchoolLeader').exists().withMessage("invalid experience as school leader")
      //         req.check('dutiesOrResponsibility').exists().withMessage("invalid duties or responsibility")
      //         req.check('timeOfAvailability').exists().withMessage("invalid time of availability")
      //         req.check('nonTeachingHours').exists().withMessage("invalid non teaching hours")
      //         req.check('bestPart').exists().withMessage("invalid best part")
      //         req.check('challenges').exists().withMessage("invalid challenges")
      //         req.check('schoolId').exists().withMessage("invalid school id")
      //         req.check('schoolName').exists().withMessage("invalid school name")
      //         req.check('programId').exists().withMessage("required program id")
      //             .isMongoId().withMessage("invalid program id")
      //     }
    },
    add: function () {
      req.checkQuery('type').exists().withMessage('required type');
      req.checkBody('data').exists().withMessage('required data');
      //     if (req.query.type == "parent") {
      //         req.check('parents.*.studentName').exists().withMessage("invalid student name")
      //         req.check('parents.*.grade').exists().withMessage("invalid grade")
      //         req.check('parents.*.name').exists().withMessage("invalid name")
      //         req.check('parents.*.gender').exists().withMessage("invalid gender")
      //         req.check('parents.*.type').exists().withMessage("invalid type")
      //         req.check('parents.*.typeLabel').optional().withMessage("invalid type label")
      //         req.check('parents.*.phone1').exists().withMessage("invalid phone1")
      //         req.check('parents.*.phone2').exists().withMessage("invalid phone2")
      //         req.check('parents.*.address').exists().withMessage("invalid address")
      //         req.check('parents.*.schoolId').exists().withMessage("invalid school id")
      //         req.check('parents.*.schoolName').exists().withMessage("invalid school name")
      //         req.check('parents.*.programId').exists().withMessage("invalid program id name")
      //     } else if (req.query.type == "teacher") {
      //         req.check('teachers.*.name').exists().withMessage("invalid name")
      //         req.check('teachers.*.qualifications').exists().withMessage("invalid qualifications")
      //         req.check('teachers.*.yearsOfExperience').exists().withMessage("invalid years of experience")
      //         req.check('teachers.*.yearsInCurrentSchool').exists().withMessage("invalid years in current school")
      //         req.check('teachers.*.schoolId').exists().withMessage("required school id")
      //             .isMongoId().withMessage("invalid school id")
      //         req.check('teachers.*.schoolName').exists().withMessage("invalid school name")
      //         req.check('teachers.*.programId').exists().withMessage("required program id")
      //             .isMongoId().withMessage("invalid program id")
      //     } else if (req.query.type == "schoolLeader") {
      //         req.check('schoolLeaders.*.name').exists().withMessage("invalid name")
      //         req.check('schoolLeaders.*.age').exists().withMessage("invalid age")
      //         req.check('schoolLeaders.*.gender').exists().withMessage("invalid gender")
      //         req.check('schoolLeaders.*.bio').exists().withMessage("invalid bio")
      //         req.check('schoolLeaders.*.experienceInEducationSector').exists().withMessage("invalid experience in education sector")
      //         req.check('schoolLeaders.*.experienceInCurrentSchool').exists().withMessage("invalid experience in current school")
      //         req.check('schoolLeaders.*.experienceAsSchoolLeader').exists().withMessage("invalid experience as school leader")
      //         req.check('schoolLeaders.*.dutiesOrResponsibility').exists().withMessage("invalid duties or responsibility")
      //         req.check('schoolLeaders.*.timeOfAvailability').exists().withMessage("invalid time of availability")
      //         req.check('schoolLeaders.*.nonTeachingHours').exists().withMessage("invalid non teaching hours")
      //         req.check('schoolLeaders.*.bestPart').exists().withMessage("invalid best part")
      //         req.check('schoolLeaders.*.challenges').exists().withMessage("invalid challenges")
      //         req.check('schoolLeaders.*.schoolId').exists().withMessage("invalid school id")
      //         req.check('schoolLeaders.*.schoolName').exists().withMessage("invalid school name")
      //         req.check('schoolLeaders.*.programId').exists().withMessage("required program id")
      //             .isMongoId().withMessage("invalid program id")
      //     }
    },
    fetch: function () {
      req.checkQuery('type').exists().withMessage('required type');
      req.checkParams('_id').exists().withMessage('required entity id').isMongoId().withMessage('invalid entity id');
    },
    list: function () {
      req.checkQuery('type').exists().withMessage('required type');
      req.checkParams('_id').exists().withMessage('required entity id').isMongoId().withMessage('invalid entity id');
    },
    relatedEntities: function () {
      req.checkParams('_id').exists().withMessage('required Entity id');
    },
    listByLocationIds: function () {
      req.checkBody('locationIds').exists().withMessage('Location ids is required');
    },
    registryMappingUpload: function () {
      req.checkQuery('entityType').exists().withMessage('required entity type');
    },
  };

  if (entityValidator[req.params.method]) entityValidator[req.params.method]();
};
