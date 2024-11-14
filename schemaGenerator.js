const fs = require('fs');

function generateSchema(data, schemaName, identifier) {
  const properties = Object.keys(data[0]).map(key => ({
    "$class": "concerto.metamodel@1.0.0.StringProperty",
    "name": key,
    "isOptional": false,
    "isArray": false,
    "decorators": [
      {
        "$class": "concerto.metamodel@1.0.0.Decorator",
        "name": "Term",
        "arguments": [
          {
            "$class": "concerto.metamodel@1.0.0.DecoratorString",
            "value": key
          }
        ]
      },
      {
        "$class": "concerto.metamodel@1.0.0.Decorator",
        "name": "Crud",
        "arguments": [
          {
            "$class": "concerto.metamodel@1.0.0.DecoratorString",
            "value": "Createable,Readable,Updateable"
          }
        ]
      }
    ]
  }));

  const schema = {
    "declarations": [
      {
        "$class": "concerto.metamodel@1.0.0.ConceptDeclaration",
        "name": schemaName,
        "isAbstract": false,
        "properties": properties,
        "decorators": [
          {
            "$class": "concerto.metamodel@1.0.0.Decorator",
            "name": "Term",
            "arguments": [
              {
                "$class": "concerto.metamodel@1.0.0.DecoratorString",
                "value": schemaName
              }
            ]
          },
          {
            "$class": "concerto.metamodel@1.0.0.Decorator",
            "name": "Crud",
            "arguments": [
              {
                "$class": "concerto.metamodel@1.0.0.DecoratorString",
                "value": "Createable,Readable,Updateable"
              }
            ]
          }
        ],
        "identified": {
          "$class": "concerto.metamodel@1.0.0.IdentifiedBy",
          "name": identifier
        }
      }
    ]
  };

  // Save the schema to a file
  fs.writeFileSync('generatedSchema.json', JSON.stringify(schema, null, 2));
  console.log('Schema saved to generatedSchema.json');

  return schema;
}

module.exports = generateSchema;