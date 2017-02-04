/*
Language: Cypher
Author: Jason Clark <jason.clark.03@gmail.com>
*/

function CYPHER_MODE(hljs) {
  var labelName = {
    cN: 'labelName',
    b: /:./,
    e: /(:| )/
  };

  var labelDefinition = {
    cN: 'label',
    b: /:/
  };

  var properties = {
    cN: 'properties',
    b: /\{/,
    e: /\}/
  };

  var nodeMode = {
    cN: 'node',
    b: /\(/,
    e: /\)/,
    c: [labelDefinition, labelName, properties]
  };

  var relationshipMode = {
    cN: 'relationship',
    b: /\[/,
    e: /\]/,
    c: [labelDefinition, labelName, properties]
  };

  return {
    cI: true, //TODO: Why isn't this working?
      k: {
        keyword: 'start match return with limit skip create merge where unique union remove delete set constaint assert is case unique optional order by',
        literal: 'true false'
      },
      c: [hljs.CLCM, hljs.ASM, hljs.QSM, nodeMode, relationshipMode]
    }
}
