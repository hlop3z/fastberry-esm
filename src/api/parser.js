function getOperations(query) {
  return query.match(/\b(?:query|mutation)\b([^{\n]*){([^}]*)}/g);
}

function getVariables(query) {
  let match = query.match(
    /\$([A-Za-z][A-Za-z0-9]*):[ ]?([A-Za-z_][A-Za-z0-9_]*[!]?)/g
  );
  const matches = [];
  if (match) {
    match.forEach((m) => {
      matches.push(m.split(":"));
    });
  }
  return matches;
}

function getName(query) {
  return query.match(/\s*(\w+)/g)[1].trim();
}

function QueryToJson(query) {
  const matches = getOperations(query);
  const operations = {};
  matches.forEach((item) => {
    const operationFields = {};
    const op_name = getName(item);
    const variables = getVariables(item);

    // Get Args
    variables.forEach((v) => {
      const field_name = v[0].trim().replace("$", "");
      operationFields[field_name] = {
        name: field_name,
        type: v[1].trim().replace("!", ""),
        required: v[1].endsWith("!"),
      };
    });

    // Create Form
    const operationForm = {};
    Object.values(operationFields).forEach((item) => {
      operationForm[item.name] = null;
    });

    // Inject Args & Form
    operations[op_name] = {
      args: operationFields,
      form: operationForm,
    };
  });
  return operations;
}

export default QueryToJson;
