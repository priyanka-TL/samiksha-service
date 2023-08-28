module.exports = async (req, res, next) => {
    if (req.userDetails && req.userDetails.id && req.path.includes("programOperations")) {

        let entityAssessorDocumentByUser = await database.models.entityAssessors.find({userId:req.userDetails.id},{solutionId:1}).lean();

        let solutions = await database.models.solutions.find({ "_id": {$in: entityAssessorDocumentByUser.map(solution=>solution.solutionId)} }, {
            programId: 1,
            programExternalId: 1
        }).lean();

        if (solutions.length) req['userDetails'].accessiblePrograms = solutions

    }
    next();
    return;
}


