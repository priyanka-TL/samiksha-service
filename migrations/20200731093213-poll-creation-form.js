module.exports = {
  async up(db) {

    global.migrationMsg = "Add default poll creation form";

    let defaultPollCreationForm = [
      {
        field: "name",
        label: "Name of the Poll",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "text"
      },
      {
        field: "creator",
        label: "Name of the Creator",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "text"
      },
      {
        field: "endDate",
        label: "End Date",
        value: 1,
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "radio",
        options: [
          {
            value : 1,
            label : "one day"
          },
          {
            value : 2,
            label : "two days"
          },
          {
            value : 3,
            label : "three days"
          },
          {
            value : 4,
            label : "four days"
          },
          {
            value : 5,
            label : "five days"
          },
          {
            value : 6,
            label : "six days"
          },
          {
            value : 7,
            label : "seven days"
          }
        ]
      },
    ]

    await db.collection('forms').insertOne({
      name: "defaultPollCreationForm",
      allowMultipleQuestions: false,
      value: defaultPollCreationForm
    });

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
