var http = require('http');

const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');
 
// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');
 
// Train and save the model.
(async() => {
    await manager.train();
    manager.save();
})();

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
            
        	(async() => {
        		const param_response = await manager.process('en', post['ashes']);
        		console.log(param_response);
        		res.writeHead(200, {'Content-Type': 'text/plain'});
        		res.end(param_response['answer']);
        	})();            
        });
    } else {	
    	var url = require('url');
    	var url_parts = url.parse(req.url, true);
    	var query = url_parts.query;
    	console.log(query);
    	parameter = query['ashes'];
    	(async() => {
    		const param_response = await manager.process('en', parameter);
    		console.log(param_response);
    		res.writeHead(200, {'Content-Type': 'text/plain'});
    		res.end(param_response['answer']);
    	})();
    }	
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');