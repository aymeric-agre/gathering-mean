'use strict';

module.exports = function(app) {
    // User Routes
    var search = require('../../app/controllers/search.server.controller');

    app.route('/search').get(search.read);
};
