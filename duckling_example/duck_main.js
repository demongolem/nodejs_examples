/*jshint esversion: 6 */

var http = require('http');

const { NlpManager } = require('node-nlp');

http.createServer(function handler(req, res) {

    if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
        	var qs = require('querystring');
            var post = qs.parse(body);
            console.log(post);
            // use post['blah'], etc.
            
            (async () => {
            	  let manager = new NlpManager({ ner: { useDuckling: true } });
            	  const result = await manager.process(post['text']);
            	  console.log(JSON.stringify(result, null, 2));
          		  res.writeHead(200, {'Content-Type': 'application/json'});
          		  res.end(JSON.stringify(result, null, 2));
            })();
        });
    }	
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');