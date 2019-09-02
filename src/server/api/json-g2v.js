module.exports = function(connection)
{
    return {
        getAllStars: getAllStars
    };
    function getAllStars(res) {
        res.send(connection.g2v);
    }
};
