import resource from 'resource-router-middleware';
import currencyJSON from '../mock/currency.js';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'goodsLike',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let goods_id = id,
			err = goods_id ? null : {"code": 1, "status": "getGoodsLikeCountFailed"};
		callback(err, goods_id);
	},

	/** GET / - List all entities */
	index({ params }, res) {
        res.status(400);
		res.json({
            "code": 1,
            "status": "failed",
            "msg": "Bad request!You should use the POST method!"
        });
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
        console.log(body.m, body.a, body.goods_id);
        const m_Exist = (body.m === 'goods');
        const goods_attention_Exist = (body.a === 'goods_attention');
        const goods_id_Exist = ((body.goods_id >= 1) && (typeof(+body.goods_id) !== String));
        console.log(m_Exist, goods_attention_Exist, goods_id_Exist);
		if (!m_Exist || !goods_attention_Exist || !goods_id_Exist) {
            res.status(400);
            res.json({
                "code": 1,
                "status": "failed",
                "msg": "Goods attention submit failed!",
                "data": {
                    "attention_num": 0,
                    "goods_id": 0
                 },
            });
        }
        else {
            res.json({
                "code": 0,
                "status": "OK",
                "msg": "Goods attention submit success!",
                "data": {
                    "attention_num": 99,
                    "goods_id": body.goods_id
                 }   
            });
        }
	},

	/** GET /:id - Return a given entity */
	read({ goodsLike }, res) {
        const json = 
        {
            "code": 0,
            "data": {
                "data": {
                   "attention_num": 99,
                   "goodsLike": goodsLike.id
                },
                "msg": "Goods get attention count success!",
                "status": "OK"
            }
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
