module.exports = {
  async up(db) {
    global.migrationMsg = 'Migrated up transfer-programs-create-solutions';

    if (process.env.TRANSFER_FROM_DB !== '') {
      let sourceDB = global.transferFromDb;

      let programs = await sourceDB.collection('programs').find({}).toArray();

      let schoolEntity = await db
        .collection('entityTypes')
        .find({
          name: 'school',
        })
        .toArray();

      let teacherEntity = await db
        .collection('entityTypes')
        .find({
          name: 'teacher',
        })
        .toArray();

      let programsArray = new Array();

      let solutionsArray = new Array();

      let startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      let endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      let indexOfSolutions = -1;

      function getCriteriaIds(themes) {
        let allCriteriaIds = [];
        themes.forEach((theme) => {
          let criteriaIdArray = [];
          if (theme.children) {
            criteriaIdArray = getCriteriaIds(theme.children);
          } else {
            criteriaIdArray = theme.criteria;
          }
          criteriaIdArray.forEach((eachCriteria) => {
            if (eachCriteria.criteriaId) {
              allCriteriaIds.push(eachCriteria.criteriaId);
            } else {
              allCriteriaIds.push(eachCriteria);
            }
          });
        });
        return allCriteriaIds;
      }

      let sectionCode = {
        'Survey Questions': {
          code: 'SQ',
          name: 'Survey Questions',
        },
        'Data to be Filled': {
          code: 'DF',
          name: 'Data to be Filled',
        },
        'Group Interview': {
          code: 'GI',
          name: 'Group Interview',
        },
        'Individual Interview': {
          code: 'II',
          name: 'Individual Interview',
        },
        'Reading Fluency - English': {
          code: 'RFE',
          name: 'Reading Fluency - English',
        },
        'Reading Comprehension': {
          code: 'RC',
          name: 'Reading Comprehension',
        },
        'Math Assessment': {
          code: 'MA',
          name: 'Math Assessment',
        },
        'Reading Fluency - Telugu': {
          code: 'RFT',
          name: 'Reading Fluency - Telugu',
        },
      };

      for (let programsCounter = 0; programsCounter < programs.length; programsCounter++) {
        indexOfSolutions = solutionsArray.findIndex((solution) => {
          return solution._id.toString() == programs[programsCounter].components[0].id.toString();
        });

        if (indexOfSolutions < 0) {
          let evaluationFrameworkDocument = await sourceDB
            .collection('evaluationFrameworks')
            .find({
              _id: programs[programsCounter].components[0].id,
            })
            .toArray();

          if (!evaluationFrameworkDocument[0] || !evaluationFrameworkDocument[0].themes) {
            continue;
          }

          let frameworkCriteriaArray = getCriteriaIds(evaluationFrameworkDocument[0].themes);

          let criterias = await sourceDB
            .collection('criterias')
            .find(
              { _id: { $in: frameworkCriteriaArray } },
              {
                resourceType: 0,
                language: 0,
                keywords: 0,
                concepts: 0,
                createdFor: 0,
              },
            )
            .toArray();

          let evidenceMethods = {};
          let sections = {};

          criterias.forEach((criteria) => {
            criteria.evidences.forEach((evidence) => {
              evidenceMethods[evidence.externalId] = _.omit(evidence, ['sections']);
              evidence.sections.forEach((section) => {
                if (!sectionCode[section.name]) {
                  sectionCode[section.name] = {
                    code: section.name,
                    name: section.name,
                  };
                }
                sections[sectionCode[section.name].code] = sectionCode[section.name].name;
              });
            });
          });

          evaluationFrameworkDocument[0].isReusable = false;
          evaluationFrameworkDocument[0].noOfRatingLevels = 4;
          evaluationFrameworkDocument[0].isRubricDriven = true;

          evaluationFrameworkDocument[0].entityTypeId =
            programs[programsCounter].components[0].entities &&
            programs[programsCounter].components[0].entities.length > 0
              ? teacherEntity[0]._id
              : schoolEntity[0]._id;
          evaluationFrameworkDocument[0].entityType =
            programs[programsCounter].components[0].entities &&
            programs[programsCounter].components[0].entities.length > 0
              ? teacherEntity[0].name
              : schoolEntity[0].name;

          evaluationFrameworkDocument[0].type = 'assessment';
          if (programs[programsCounter].components[0].subType) {
            evaluationFrameworkDocument[0].subType = programs[programsCounter].components[0].subType;
          } else {
            evaluationFrameworkDocument[0].subType =
              programs[programsCounter].components[0].entities &&
              programs[programsCounter].components[0].entities.length > 0
                ? 'individual'
                : 'institutional';
          }

          evaluationFrameworkDocument[0].entities =
            programs[programsCounter].components[0].entities &&
            programs[programsCounter].components[0].entities.length > 0
              ? programs[programsCounter].components[0].entities
              : programs[programsCounter].components[0].schools;
          evaluationFrameworkDocument[0].roles = programs[programsCounter].components[0].roles
            ? programs[programsCounter].components[0].roles
            : '';
          evaluationFrameworkDocument[0].schoolProfileFieldsPerSchoolTypes = programs[programsCounter].components[0]
            .schoolProfileFieldsPerSchoolTypes
            ? programs[programsCounter].components[0].schoolProfileFieldsPerSchoolTypes
            : '';

          evaluationFrameworkDocument[0].programId = programs[programsCounter]._id;
          evaluationFrameworkDocument[0].programExternalId = programs[programsCounter].externalId;
          evaluationFrameworkDocument[0].programName = programs[programsCounter].name;
          evaluationFrameworkDocument[0].programDescription = programs[programsCounter].description;

          evaluationFrameworkDocument[0].startDate = startDate;
          evaluationFrameworkDocument[0].endDate = endDate;
          evaluationFrameworkDocument[0].status = 'active';

          evaluationFrameworkDocument[0].isDeleted = false;
          evaluationFrameworkDocument[0].updatedBy = evaluationFrameworkDocument[0].updatedBy
            ? evaluationFrameworkDocument[0].updatedBy
            : 'INITIALIZE';
          evaluationFrameworkDocument[0].createdBy = evaluationFrameworkDocument[0].updatedBy
            ? evaluationFrameworkDocument[0].updatedBy
            : 'INITIALIZE';
          evaluationFrameworkDocument[0].createdAt = evaluationFrameworkDocument[0].createdAt
            ? evaluationFrameworkDocument[0].createdAt
            : new Date();
          evaluationFrameworkDocument[0].updatedAt = evaluationFrameworkDocument[0].updatedAt
            ? evaluationFrameworkDocument[0].updatedAt
            : new Date();

          evaluationFrameworkDocument[0].evidenceMethods = evidenceMethods;
          evaluationFrameworkDocument[0].sections = sections;

          solutionsArray.push(evaluationFrameworkDocument[0]);
        }

        programs[programsCounter].components = [programs[programsCounter].components[0].id];
        programs[programsCounter].startDate = startDate;
        programs[programsCounter].endDate = endDate;
        programs[programsCounter].status = 'active';

        programs[programsCounter].isDeleted = false;
        programs[programsCounter].updatedBy = programs[programsCounter].updatedBy
          ? programs[programsCounter].updatedBy
          : 'INITIALIZE';
        programs[programsCounter].createdBy = programs[programsCounter].updatedBy
          ? programs[programsCounter].updatedBy
          : 'INITIALIZE';
        programs[programsCounter].createdAt = programs[programsCounter].createdAt
          ? programs[programsCounter].createdAt
          : new Date();
        programs[programsCounter].updatedAt = programs[programsCounter].updatedAt
          ? programs[programsCounter].updatedAt
          : new Date();

        programsArray.push(programs[programsCounter]);
      }

      global.migrationMsg = 'Total programs transferred - ' + programsArray.length;

      await db.collection('solutions').insertMany(solutionsArray);

      return await db.collection('programs').insertMany(programsArray);
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
