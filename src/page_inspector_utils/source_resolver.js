"use strict";

import UrlSupport from "./url_support.js"

class SourceResolver {

    constructor() {
        this._correctTypes = { direct: true, utm: true, organic: true, referral: true };
        this._utmParamsToSave = ['utm_source', 'utm_medium', 'utm_campaign'];

        this.options = {
            organics: [
                { host: /^(www\.)?google\.[a-z]+$/, display: 'google' },
                { host: /^(www\.)?yandex\.[a-z]+$/, display: 'yandex' },
                { host: /^(www\.)?bing\.[a-z]+$/, display: 'bing' },
                { host: /yahoo\.[a-z]+$/, display: 'yahoo' },
                { host: /about\.[a-z]+$/, display: 'about' },
                { host: /aol\.[a-z]+$/, display: 'aol' },
                { host: /ask\.[a-z]+$/, display: 'ask'},
                { host: /globososo.com\.[a-z]+$/, display: 'globo' },
                { host: /go\.mail\.[a-z]+$/, display: 'go.mail.ru' },
                { host: /rambler\.[a-z]+$/, display: 'rambler' },
                { host: /tut\.[a-z]+$/, display: 'tut.by' }
            ],
            referrals: [
                { host: /^(www\.)?t\.co$/, display: 'twitter.com' },
                { host: /^(www\.)?plus\.url\.google\.com$/, display: 'plus.google.com' },
                { host: /^(www\.)?(m\.)?habrahabr\.ru$/, display: 'habrahabr.ru' }
            ],
            ignoreOrganics: [],
            utmSynonyms: {
                utm_source: [],
                utm_medium: [],
                utm_campaign: []
            },
            validations: [
                {
                    validate: function (name, value) {
                        return value.length <= 150;
                    },
                    correct: function (name, value) {
                        return value.substring(0, 150);
                    }
                }
            ]
        }

        this.urlSupport = new UrlSupport();

        let currentType = this._getCurrentType();
        this.data = this._prepareDataForSave(this._collectDataToSave(currentType), currentType);
    }

    _findSourceWithHost(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].host.test(this.urlSupport.referrerHostname)) {
                return arr[i];
            }
        }
        return null;
    };

    _isUTM() {
        var _utmSynonyms = function (synonyms, utmParams) {
            if (synonyms && typeof synonyms  === 'object') {
                var result = [];
                for (var i = 0; i < utmParams.length; i++) {
                    var paramSynonyms = synonyms[utmParams[i]];
                    if (Object.prototype.toString.call(paramSynonyms) === '[object Array]') {
                        result = result.concat(paramSynonyms);
                    }
                }
                return result;
            } else {
                return [];
            }
        };
        var utmParamsArray = this._utmParamsToSave.concat(_utmSynonyms(this.options.utmSynonyms, this._utmParamsToSave));
        for (var i = 0; i < utmParamsArray.length; i++) {
            if (this.urlSupport.locationParams[utmParamsArray[i]]) {
                return true;
            }
        }
        return false;
    };

    _isDirect() {
        return !this.urlSupport.referrerUrl && !this._isUTM();
    };

    _isOrganic() {
        var source = this._findSourceWithHost(this.options.organics);
        if (source) {            
            var searchText = this.urlSupport.referrerParams[source.param];
            if (searchText && Object.prototype.toString.call(this.options.ignoreOrganics) === '[object Array]') {
                var ignored = false;
                for (var i = 0; i < this.options.ignoreOrganics.length; i++) {
                    ignored = ignored || this.options.ignoreOrganics[i].test(searchText);
                }
                return !ignored;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    _isReferral() {
        return !this._isDirect() && !this._isUTM()
            && !this._isOrganic() && !this._findSourceWithHost(this.options.organics)
            && this.urlSupport.referrerHostname != this.urlSupport.locationHostname;
    };

    _getCurrentType() {
        if (this._isUTM()) {
            return 'utm';
        } else if (this._isOrganic()) {
            return 'organic';
        } else if (this._isDirect()) {
            return 'direct';
        } else if (this._isReferral()) {
            return 'referral';
        } else {
            return '';
        }
    };

    _collectDataToSave(type) {
        if (type === 'direct') {
            return this._collectDirectData();
        } else if (type === 'utm') {
            return this._collectUtmData();
        } else if (type === 'organic') {
            return this._collectOrganicData();
        } else if (type === 'referral') {
            return this._collectReferralData();
        } else {
            return {};
        }
    };

    _collectDirectData() {
        return { utm_medium: 'direct' };
    };

    _collectUtmParamData(name, paramSynonyms) {
        var result = this.urlSupport.locationParams[name];
        var tmp;
        if (result) {
            return result;
        } else {
            if (paramSynonyms && Object.prototype.toString.call(paramSynonyms) === '[object Array]') {
                for (var i = 0; i < paramSynonyms.length; i++) {
                    tmp = this.urlSupport.locationParams[paramSynonyms[i]];
                    if (tmp) {
                        return tmp;
                    }
                }
            }
        }
        return '';
    }

    _collectUtmData() {
        var result = {};
        var param;
        for (var i = 0; i < this._utmParamsToSave.length; i++) {
            param = this._utmParamsToSave[i];
            result[param] = this._collectUtmParamData(param, this.options.utmSynonyms[param])
        }
        return result;
    };

    _collectOrganicData() {
        var option = this._findSourceWithHost(this.options.organics);
        return {
            utm_source: option.display,
            utm_medium: 'organic'
        }
    };

    _collectReferralData() {
        var option = this._findSourceWithHost(this.options.referrals);
        return {
            utm_source: option ? option.display : this.urlSupport.referrerHostname,
            utm_medium: 'referral'
        }
    };

    _validateValue(name, value) {
        var validations = this.options.validations;
        var result = value;
        for (var i = 0; i < validations.length; i++) {
            if (!validations[0].validate(name, value)) {
                result = validations[0].correct(name, result);
            }
        }
        return result;
    };

    _prepareDataForSave(data, type) {
        var paramNames = this._utmParamsToSave;
        var fullData = {};
        var value;
        fullData['not_inner'] = false;
        for (var i = 0; i < paramNames.length; i++) {
            value = this._validateValue(paramNames[i], (data[paramNames[i]] || ''));
            fullData[paramNames[i]] = encodeURIComponent(value || 'none');
            fullData['not_inner'] = fullData['not_inner'] || fullData[paramNames[i]] != 'none';
        }
        return fullData;
    };

}

export default SourceResolver;