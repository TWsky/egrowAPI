import resource from 'resource-router-middleware';
import { getSearchResult } from '../lib/getSearchResult';
export default ({ config, db }) => resource({

    /** Property name to store preloaded entity on `request`. */
    id: 'searchResult',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
    load(req, id, callback) {
        let searchResult = null;
        let err = null;
        // 异步获取结果，并且传回给callback函数。
        getSearchResult({
            m: "keyword_search", callback: "jQuery210022190321523844037_1527556097766"
            , keyword: id
        }).then(res => { 
            let searchResult = res;
            // console.log(res);
            err = searchResult ? null : { "code": 1, "status": "getsearchResultfailed" };
            callback(err, searchResult);
        })
    },

    /** GET / - List all entities */
    index({ searchResult }, res) {
        res.status(400);
        res.json({
            "code": 1,
            "status": "Bad Request",
        })
    },
    /** GET /:id - Return a given entity */
    read({ searchResult }, res) {
        let json =
        {
            "code": 0,
            "status": "OK",
            "items": [
                {"predictions": searchResult}
            ]
        }
        res.json(json);
    }
});
