/**
 * name : helper.js
 * author : Aman
 * created-date : 05-July-2020
 * Description : Library search helper functionality.
 */

// Dependencies
let solutionsHelper = require(MODULES_BASE_PATH + '/solutions/helper');

/**
 * librarySearchHelper
 * @class
 */

module.exports = class librarySearchHelper {
  /**
   * Search library solutions.
   * @method
   * @name search
   * @param searchText - text to search.
   * @param pageSize - size of the page.
   * @param pageNo - page no.
   * @returns {Object} Search library solutions.
   */

  static search(searchText, pageSize, pageNo) {
    return new Promise(async (resolve, reject) => {
      try {
        let matchQuery = {
          $match: {
            isReusable: true,
            status: 'active',
            $or: [
              {
                name: new RegExp(searchText, 'i'),
              },
              {
                description: new RegExp(searchText, 'i'),
              },
              {
                keywords: new RegExp(searchText, 'i'),
              },
            ],
          },
        };

        let solutionDocument = await solutionsHelper.search(matchQuery, pageSize, pageNo, {
          name: 1,
          description: 1,
          externalId: 1,
          type: 1,
          subType: 1,
        });

        if (solutionDocument[0].data && solutionDocument[0].data.length > 0) {
          solutionDocument[0].data = solutionDocument[0].data.map((solutionData) => {
            solutionData.type =
              solutionData.type === messageConstants.common.ASSESSMENT ? solutionData.subType : solutionData.type;
            return _.omit(solutionData, ['subType']);
          });
        }

        return resolve({
          message: messageConstants.apiResponses.LIBRARY_CATEGORY_FETCHED,
          result: {
            data: solutionDocument[0].data,
            count: solutionDocument[0].count ? solutionDocument[0].count : 0,
          },
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
};
