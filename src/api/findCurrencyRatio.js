import resource from 'resource-router-middleware';
import currencyJSON from '../mock/currency.js';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'currency',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let currency = currencyJSON.find( currency => Object.keys(currency)[0] === id ),
			err = currency ? null : {"code": 1, "status": "getCurrencyfailed"};
		callback(err, currency);
	},

	/** GET / - List all entities */
	index({ params }, res) {
		res.json(currencyJSON);
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		body.id = currencyJSON.length.toString(36);
		currencyJSON.push(body);
		res.json(body);
	},

	/** GET /:id - Return a given entity */
	read({ currency }, res) {
        let json = 
        {
            "code": 0,
            "status": "OK",
            "currency": Object.keys(currency)[0],
            "ratio": currency[Object.keys(currency)[0]]
        }
		res.json(json);
	},

	/** PUT /:id - Update a given entity */
	update({ currency, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				currency[key] = body[key];
			}
		}
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ currency }, res) {
		currencyJSON.splice(currencyJSON.indexOf(currency), 1);
		res.sendStatus(204);
	}
});
