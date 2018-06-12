import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import findCurrencyRatio from './findCurrencyRatio';
import goodsLikeCount from './goodsLikeCount';
import searchGoodsResult from './searchGoodsResult';
import moreProducts_0 from '../mock/more_products_0.json';
import moreProducts_1 from '../mock/more_products_1.json';
import products from '../mock/products.json';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));


	// 处理货币的汇率（GET方法）
	api.use('/curr', findCurrencyRatio({ config, db }));
	
	// 处理商品的likeCount（POST方法）
	api.use('/goods', goodsLikeCount({ config, db }));

	// 获取搜索结果(GET方法)
	api.use('/search', searchGoodsResult({ config, db}));

	// GET Product
	api.get('/products', (req, res) => {
		res.json(products);
	})

	// Get More Product with queryStr [moreItemsIndex]
	api.get('/more_products', (req, res) => {
		switch(req.query.moreItemsIndex) {
			case '0':
				res.json(moreProducts_0);
				break;
			case '1':
				res.json(moreProducts_1);
				break;
			default:
				res.json({
					"items": [],
					"hasMorePages": false,
				});
				break;
		}
	})

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
