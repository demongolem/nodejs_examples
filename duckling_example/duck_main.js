/*jshint esversion: 6 */

const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ ner: { useDuckling: true } });
  const result = await manager.process('My email is something@somehost.com please write me');
  console.log(JSON.stringify(result, null, 2));
})();