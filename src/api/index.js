import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import findCurrencyRatio from './findCurrencyRatio';
export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));


	// 处理货币的汇率
	api.use('/curr', findCurrencyRatio({ config, db }));
	
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
