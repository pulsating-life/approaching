'use strict';

var $ = require('jquery');
var Promise = require('promise');

module.exports = {
    formatRoutes: function (routes) {
        var url = window.location.href;
        if (url.startsWith('file:///')) {
            var pos = url.indexOf('?');
            if (pos > 0) {
                url = url.substr(0, pos);
            }

            pos = url.lastIndexOf('/');
            url = url.substr(0, pos);
            window.rootPath = url;

            var url2 = url.substr(7);
            routes.map((item, i) => {
                item.path = url2 + item.path;
            });
        }
        else {
            var pos = url.indexOf('?href=');
            var pos2 = url.indexOf('?linkid=');
            var pos3 = url.indexOf('?linkid=direct');
            if (pos > 0 && pos2 > 0 && pos3 < 0) {
                // alert('formatRoutes==' + url);
                routes.map((item, i) => {
                    if (!item.path.endsWith('.html')) {
                        item.path = '/safe' + item.path;
                    }
                });
            }
        }
    },

};
