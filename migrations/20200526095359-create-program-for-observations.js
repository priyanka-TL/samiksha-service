const { ObjectID } = require('mongodb');

module.exports = {
  async up(db) {
    global.migrationMsg = 'Programs added for observations and observation submissions';

    // Dependencies
    const csv = require('csvtojson');
    const fs = require('fs');
    let path = 'observationSolutionToProgramMapping.csv';

    // Solution to program map from csv
    let solutionMapToProgram = {};

    if (fs.existsSync(path)) {
      let observationsCsvData = await csv().fromFile(path);

      if (observationsCsvData.length > 0) {
        observationsCsvData.forEach((observationSolution) => {
          if (observationSolution.newProgram.toLowerCase() !== 'yes') {
            solutionMapToProgram[observationSolution._id.toString()] = {
              externalId: observationSolution.existingProgramReference,
              existingProgram: true,
            };
          } else {
            solutionMapToProgram[observationSolution._id.toString()] = {
              externalId: observationSolution.programExternalId
                ? observationSolution.programExternalId
                : observationSolution.programName,

              name: observationSolution.programName,

              description: observationSolution.description
                ? observationSolution.description
                : observationSolution.programName,
              existingProgram: false,
            };
          }
        });
      }
    }

    let observationsSolution = await db
      .collection('solutions')
      .find({
        type: 'observation',
        isReusable: true,
      })
      .toArray();

    let createPrograms = {};
    let updatePrograms = {};
    let newSolutions = {};

    for (let observationSolution = 0; observationSolution < observationsSolution.length; observationSolution++) {
      let solutionData = observationsSolution[observationSolution];
      let programExternalId =
        solutionMapToProgram[solutionData._id] && solutionMapToProgram[solutionData._id].externalId
          ? solutionMapToProgram[solutionData._id].externalId
          : solutionData.externalId;

      // If solution is having existing program.

      if (solutionMapToProgram[solutionData._id] && solutionMapToProgram[solutionData._id].existingProgram) {
        let program = await db.collection('programs').findOneAndUpdate(
          {
            externalId: programExternalId,
          },
          {
            $addToSet: { components: ObjectID(solutionData._id) },
          },
          { returnNewDocument: true },
        );

        if (!updatePrograms[programExternalId]) {
          updatePrograms[programExternalId] = {};
          updatePrograms[programExternalId] = {
            name: program.value.name,
            externalId: programExternalId,
            _id: ObjectID(program.value._id),
            description: program.value.description,
          };
        }
      } else {
        if (!createPrograms[programExternalId]) {
          createPrograms[programExternalId] = {
            name:
              solutionMapToProgram[solutionData._id] && solutionMapToProgram[solutionData._id].name
                ? solutionMapToProgram[solutionData._id].name
                : solutionData.name,

            externalId: programExternalId,
            description:
              solutionMapToProgram[solutionData._id] && solutionMapToProgram[solutionData._id].description
                ? solutionMapToProgram[solutionData._id].description
                : solutionData.description,

            owner: solutionData.author,
            createdBy: solutionData.createdBy,
            updatedBy: solutionData.updatedBy,
            isDeleted: false,
            status: 'active',
            resourceType: ['program'],
            language: ['English'],
            keywords: [],
            concepts: [],
            createdFor: ['0126427034137395203', '0124487522476933120'],

            imageCompression: {
              quality: 10,
            },

            updatedAt: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            createdAt: new Date(),
            isAPrivateProgram: false,
            components: [],
          };
        }

        createPrograms[programExternalId].components.push(ObjectID(solutionData._id));
      }

      if (!newSolutions[solutionData.externalId]) {
        let newSolution = _.cloneDeep(solutionData);

        if (newSolution.externalId.includes('TEMPLATE')) {
          newSolution.externalId = newSolution.externalId.replace('-OBSERVATION-TEMPLATE', '');
          newSolution.externalId = newSolution.externalId.replace('-TEMPLATE', '');
        } else {
          newSolution.externalId = newSolution.externalId + '-BASE-SOLUTION';
        }

        newSolution.program = programExternalId;
        newSolution.isAPrivateProgram = false;
        newSolutions[solutionData.externalId] = _.omit(newSolution, ['_id']);
      }
    }

    let programDocuments = await db.collection('programs').insertMany(Object.values(createPrograms));

    let programExternalIdToData = programDocuments.ops.reduce(
      (ac, program) => ({
        ...ac,
        [program.externalId]: {
          name: program.name,
          externalId: program.externalId,
          _id: ObjectID(program._id),
          description: program.description,
        },
      }),
      {},
    );

    programExternalIdToData = _.merge(programExternalIdToData, updatePrograms);

    await Promise.all(
      observationsSolution.map(async (solution) => {
        let baseSolution = await db
          .collection('solutions')
          .insertOne(_.omit(newSolutions[solution.externalId], ['program']));

        let updateSolution = {
          programName: programExternalIdToData[newSolutions[solution.externalId].program].name,
          programExternalId: programExternalIdToData[newSolutions[solution.externalId].program].externalId,
          programId: programExternalIdToData[newSolutions[solution.externalId].program]._id,
          programDescription: programExternalIdToData[newSolutions[solution.externalId].program].description,
          parentSolutionId: ObjectID(baseSolution.ops[0]._id),
          isReusable: false,
          isAPrivateProgram: false,
        };

        await db.collection('solutions').updateOne(
          {
            _id: solution._id,
          },
          {
            $set: updateSolution,
          },
        );

        let observationUpdate = {
          programId: updateSolution.programId,
          programExternalId: updateSolution.programExternalId,
          isAPrivateProgram: false,
        };

        await db.collection('observations').updateMany(
          {
            solutionId: solution._id,
          },
          {
            $set: observationUpdate,
          },
        );

        await db.collection('observationSubmissions').updateMany(
          {
            solutionId: solution._id,
          },
          {
            $set: observationUpdate,
          },
        );

        return;
      }),
    );

    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
