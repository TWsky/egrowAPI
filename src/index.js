import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	origin: config.corsHeaders,
	credentials: true,
	exposedHeaders: config.exposedHeaders,
	
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use((req, res, next) => {
	res.setHeader("AMP-Access-Control-Allow-Source-Origin", "https://ampify.ga");
	return next();
})

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
