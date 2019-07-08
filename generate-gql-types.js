// Script to inspect+download gql schema and generate query/mutation result types
// Cross-Platform Solution, see: https://stackoverflow.com/questions/51388921/pass-command-line-args-to-npm-scripts-in-package-json
// Can be executed via: "npm run generate-types -- <token>"

const execSync = require("child_process").execSync;

const arg = `--header="Authorization: Bearer ${process.argv[2]}"` || `--header="No Header Provided"`;

execSync(
    "apollo client:download-schema --endpoint http://wwhasuratest.westeurope.azurecontainer.io/v1/graphql schema.json " +
        arg,
    { stdio: [0, 1, 2] }
);
execSync(
    "apollo client:codegen ./gql-types --localSchemaFile=schema.json --tagName=gql --target=typescript --mergeInFieldsFromFragmentSpreads --globalTypesFile=./src/api/graphql/globalTypes.ts " +
        arg,
    { stdio: [0, 1, 2] }
);
