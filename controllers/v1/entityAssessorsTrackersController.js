/**
 * name : entityAssessorsTrackersController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : All Entity Assessors Trackers.
 */

 /**
    * EntityAssessorsTrackers
    * @class
*/
module.exports = class EntityAssessorsTrackers extends Abstract {
    constructor() {
        super(entityAssessorsTrackersSchema);
    }

    static get name() {
        return "entityAssessorsTrackers";
    }

};
