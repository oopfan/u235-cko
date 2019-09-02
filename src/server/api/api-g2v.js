module.exports = function(express, query)
{
    var api = express.Router();

    api.route('/')
        .get(function(req, res) {
            query.getAllStars(res);
        })
        .post(function(req, res) {
            res.sendStatus(404);
        });

    return api;
};
