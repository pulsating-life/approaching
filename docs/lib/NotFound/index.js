'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');

class IndexPage extends React.Component {
    constructor(props) {
        super(props);

        var path = '';
        var loading = false;
        var loc = this.props.location;
        if (loc !== null && typeof (loc) !== 'undefined') {
            path = loc.pathname;
            if (path) {
                var hPage;
                if (path.startsWith('/auth/') || path.startsWith('/auth2/')) {
                    hPage = '/auth.html';
                }
                else if (path.startsWith('/uman/')) {
                    hPage = '/uman.html';
                }
                else if (path.startsWith('/param/')) {
                    hPage = '/auth.html';
                }
                else if (path.startsWith('/reactDemo/')) {
                    hPage = '/reactDemo.html';
                }

                if (hPage) {
                    // 检查权限
                    var isAuthed = false;
                    var appPage = '@' + hPage;
                    var authApps = [];
                    var str = window.sessionStorage.getItem('authApps');
                    if (str) {
                        authApps = JSON.parse(str);
                    }

                    for (var i = authApps.length - 1; i >= 0; i--) {
                        if (authApps[i].url === appPage) {
                            isAuthed = true;
                            break
                        }
                    }

                    if (!isAuthed) {
                        hPage = '/index.html';
                    }

                    var href = window.location.href;
                    var pos = href.indexOf('/', 10);
                    if (pos > 0) {
                        href = href.substr(1 + pos);
                        hPage = hPage + '?href=' + encodeURI(href);
                    }

                    loading = true;
                    Utils.showPage(hPage);
                }
            }
        }

        this.state = {
            loading: loading,
            path: path,
        };
    }

    render() {
        if (this.state.loading) {
            return (
                <div id="app" style="width:100%; height:100%">
                    <div style="padding-top:100px;width:300px;margin:0 auto">正在加载，请等待....</div>
                </div>
            );
        }

        return (
            <div>
                <h1>404 - Not Found! {this.state.path}</h1>
            </div>
        );
    }
}

export default IndexPage;
