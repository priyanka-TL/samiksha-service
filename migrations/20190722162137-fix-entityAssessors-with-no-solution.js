module.exports = {
  async up(db) {
    global.migrationMsg = 'Migrated up fix-entityAssessors-with-no-solution file';

    let assessors = await db.collection('entityAssessors').find({ solutionId: null }).toArray();

    if (assessors.length > 0) {
      global.migrationMsg = 'Update entityAssessors with null solutions.';
      let programsToUpdate = {};

      for (let pointerToAssessorsArray = 0; pointerToAssessorsArray < assessors.length; pointerToAssessorsArray++) {
        const eachAssessor = assessors[pointerToAssessorsArray];
        if (!programsToUpdate[eachAssessor.programId.toString()]) {
          programsToUpdate[eachAssessor.programId.toString()] = {
            entities: new Array(),
            assessors: new Array(),
          };
        }

        programsToUpdate[eachAssessor.programId.toString()].assessors.push(eachAssessor._id.toString());

        eachAssessor.entities.forEach((entity) => {
          programsToUpdate[eachAssessor.programId.toString()].entities.push(entity.toString());
        });
        programsToUpdate[eachAssessor.programId.toString()].entities = _.uniq(
          programsToUpdate[eachAssessor.programId.toString()].entities,
        );
      }

      if (Object.keys(programsToUpdate).length < 1) return true;

      let programQueryObject = Object.keys(programsToUpdate).map(function (el) {
        return ObjectID(el);
      });

      let currentPrograms = await db
        .collection('programs')
        .find({ _id: { $in: programQueryObject } })
        .toArray();

      if (currentPrograms.length < 1) return true;

      let solutionsToCopy = {};
      for (
        let pointerToCurrentProgramsArray = 0;
        pointerToCurrentProgramsArray < currentPrograms.length;
        pointerToCurrentProgramsArray++
      ) {
        const eachProgram = currentPrograms[pointerToCurrentProgramsArray];
        if (eachProgram.components.length > 1) continue;

        solutionsToCopy[eachProgram.components[0].toString()] = {
          entities: programsToUpdate[eachProgram._id.toString()].entities,
          programId: eachProgram._id.toString(),
          programExternalId: eachProgram.externalId,
          programName: eachProgram.name,
          programDescription: eachProgram.description,
        };

        let currentSolutions = await db
          .collection('solutions')
          .find({ _id: { $in: [eachProgram.components[0]] } })
          .toArray();

        if (currentSolutions.length < 1) continue;

        for (
          let pointerToCurrentSolutionsArray = 0;
          pointerToCurrentSolutionsArray < currentSolutions.length;
          pointerToCurrentSolutionsArray++
        ) {
          const eachSolution = currentSolutions[pointerToCurrentSolutionsArray];

          eachSolution.externalId =
            solutionsToCopy[eachSolution._id.toString()].programExternalId + '-' + eachSolution.externalId;
          eachSolution.name = solutionsToCopy[eachSolution._id.toString()].programName + '-' + eachSolution.name;
          eachSolution.description =
            solutionsToCopy[eachSolution._id.toString()].programDescription + '-' + eachSolution.description;

          eachSolution.programId = ObjectID(solutionsToCopy[eachSolution._id.toString()].programId);
          eachSolution.programExternalId = solutionsToCopy[eachSolution._id.toString()].programExternalId;
          eachSolution.programName = solutionsToCopy[eachSolution._id.toString()].programName;
          eachSolution.programDescription = solutionsToCopy[eachSolution._id.toString()].programDescription;

          eachSolution.entities = new Array();
          solutionsToCopy[eachSolution._id.toString()].entities.forEach((entity) => {
            eachSolution.entities.push(ObjectID(entity));
          });

          let newSolutionId = await db.collection('solutions').insertOne(_.omit(eachSolution, ['_id']));

          if (newSolutionId.insertedId) {
            await db.collection('programs').findOneAndUpdate(
              {
                _id: ObjectID(solutionsToCopy[eachSolution._id.toString()].programId),
              },
              { $set: { components: [newSolutionId.insertedId] } },
            );

            solutionsToCopy[eachSolution._id.toString()].newSolutionId = newSolutionId.insertedId.toString();

            programsToUpdate[solutionsToCopy[eachSolution._id.toString()].programId].assessors.forEach((assessor) => {
              db.collection('entityAssessors').findOneAndUpdate(
                {
                  _id: ObjectID(assessor),
                },
                { $set: { solutionId: newSolutionId.insertedId } },
              );
            });

            programsToUpdate[solutionsToCopy[eachSolution._id.toString()].programId].entities.forEach((entity) => {
              db.collection('submissions').findOneAndUpdate(
                {
                  entityId: ObjectID(entity),
                  programId: ObjectID(solutionsToCopy[eachSolution._id.toString()].programId),
                },
                { $set: { solutionId: newSolutionId.insertedId, solutionExternalId: eachSolution.externalId } },
              );
            });
          }
        }
      }
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
