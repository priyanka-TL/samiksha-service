const fs = require("fs");

// Load the original forms.json file
const data = JSON.parse(fs.readFileSync("forms.json", "utf8"));

// Modify each top-level object by adding organizationId, deleted, and version properties
const modifiedData = data.map((form) => ({
  organizationId: 1,
  version: 0,
  deleted: false,
  ...form,
}));
console.log(modifiedData,"this is modifi");
// Write the modified data to a new JSON file
fs.writeFileSync(
  "forms_with_orgId.json",
  JSON.stringify(modifiedData, null, 2)
);

console.log(
  "Modified forms.json with organizationId, deleted, and version fields."
);
