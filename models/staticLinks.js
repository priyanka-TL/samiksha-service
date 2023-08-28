module.exports = {
    name: "staticLinks",
    schema: {
      value: {
        type : String,
        index : true
      },
      title: String,
      link: String,
      createdBy: String,
      updatedBy: String,
      status: String,
      appType: {
        type : String,
        index : true
      },
      metaInformation: Object,
      isDeleted: {
        type : Boolean,
        default : false
      },
      appName : String,
      isCommon : {
        type : Boolean,
        default : function() {
          if( this.appName && this.appName !== "") {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  };
  