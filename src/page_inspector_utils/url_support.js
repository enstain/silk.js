"use strict";

class UrlSupport {

    constructor() {
        this.referrerUrl = document.referrer;
        this.referrerHostname = this.getHostname(this.referrerUrl);
        this.referrerParams = this.getParams(this.referrerUrl);
        this.referrerPathname = this.getPathname(this.referrerUrl);
        this.locationUrl = window.location.toString();
        this.locationParams = this.getParams(this.locationUrl);
        this.locationHostname = this.getHostname(this.locationUrl);
        this.postMessageTarget = this.getPostMessageTarget(this.locationUrl);
    }

    getParams(url) {
        var tmp = document.createElement('a');
        tmp.href = url;
        var _encodedPairsStr = tmp.search.substr(1) ? tmp.search.substr(1).split('&') : [];
        var _pair;
        var result = {};
        for (var i = 0; i < _encodedPairsStr.length; i++) {
            _pair = _encodedPairsStr[i].split('=');
            result[decodeURIComponent(_pair[0])] = _pair.length > 1 ? decodeURIComponent(_pair[1].replace(/\+/g, '%20')) : '';
        }
        return result;
    };

    getHostname(url) {
        var tmp = document.createElement('a');
        tmp.href = url;
        return tmp.hostname;
    };

    getPathname(url) {
        var tmp = document.createElement('a');
        tmp.href = url;
        var pathname = tmp.pathname[0] === '/' ? tmp.pathname : '/' + tmp.pathname;
        return pathname + tmp.search;
    };

    getPostMessageTarget(url) {
        var tmp = document.createElement('a');
        tmp.href = url;
        var result = '';
        if (tmp.protocol) {
            result = tmp.protocol + '//'
        }
        result += tmp.hostname;
        if (tmp.port) {
            result += ':' + tmp.port;
        }
        return result;
    };

};

export default UrlSupport;