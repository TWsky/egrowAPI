import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import findCurrencyRatio from './findCurrencyRatio';
import goodsLikeCount from './goodsLikeCount';
import searchGoodsResult from './searchGoodsResult';
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

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
