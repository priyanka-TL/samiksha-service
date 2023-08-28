module.exports = {
  async up(db) {
    global.migrationMsg = "Add reports filter form to forms collections";

    let reportsFilter = [
      {
        field: "fromDate",
        label: "start date",
        value: "",
        visible: true,//there is no date calculation right now
        editable: true,
        input: "date",
        validation: {
          required: true
        },
        min: "",
        max: ""
      },
      {
        field: "toDate",
        label: "end date",
        value: "",
        visible: true,//there is no date calculation right now
        editable: true,
        input: "date",
        validation: {
          required: true
        },
        min: "",
        max: ""
      },
      {
        field: "entityTypes",
        label: "entity type",
        value: "",
        visible: true,
        editable: true,
        input: "select",
        options: "",
        validation: {
          required: false
        },
        autocomplete: false,
        min: "",
        max: ""
      },
      {
        field: "area",
        label: "entity area",
        value: "",
        visible: true,
        editable: true,
        input: "text",
        validation: {
          required: false
        },
        autocomplete: false,
        min: "",
        max: ""
      },
      {
        field: "administration",
        label: "entity administration",
        value: "",
        visible: true,
        editable: true,
        input: "select",
        showRemarks: true,
        options: "",
        validation: {
          required: false
        },
        autocomplete: false,
        min: "",
        max: ""
      },
      {
        field: "externalId",
        label: "entity Id",
        value: "",
        visible: true,
        editable: true,
        input: "text",
        validation: {
          required: false
        },
        autocomplete: true,
        url: `programOperations/searchEntity/`,
        min: "",
        max: ""
      }
    ];

    await db.collection('forms').insertOne({
      name: "reportsFilter",
      value: reportsFilter
    });

},

  async down(db) {

  }
};
