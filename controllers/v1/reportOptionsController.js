/**
 * name : reportOptionsController.js
 * author : Akash
 * created-date : 20-Jan-2019
 * Description : Report options related information.
 */

/**
    * ReportOptions
    * @class
*/
module.exports = class ReportOptions extends Abstract {
    constructor() {
        super(reportOptionsSchema);
    }

    static get name() {
        return "reportOptions";
    }

};
