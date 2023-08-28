/*
    Usage :

    var Request = require('../Request'); // Path of the module
    var request = new Request();

    var url = 'http://www.something.com';
    var options = {
        method:'Post',
        data:'send JSON data',
        ......
    }

    request.get(url, options); //get Method
    request.post(url, options); //post Method

    We can move it to git wiki later.

*/

"use strict";

var https = require('https');
var http = require('http');
var url = require('url');
var formUrlencoded = require('form-urlencoded');
var fs = require("fs");

var Request = class Request {
    constructor() {

    }

    _httpRequest(options, data) {
        return new Promise(function (resolve, reject) {
            var req;

            var httpModule = (options.type == "http") ? http : https;
            req = httpModule.request(options, function (res) {
                res.setEncoding('utf8');

                var responseData = '';

                res.on('data', function (str) {
                    responseData += str;
                });

                res.on('end', function (content) {
                    resolve({ data: responseData, message: 'Success', status: res.status ? res.status : (res.statusCode) ? res.statusCode : "", headers: res.headers });
                });
            });

            req.on('error', function (err) {
                resolve({ data: null, message: 'Failed' });
            });

            req.end(data);
        });
    }

    _httpFileRequest(options, data, path) {
        return new Promise(function (resolve, reject) {
            var req;

            var httpModule = (options.type == "http") ? http : https;

            req = httpModule.request(options, function (res) {
                resolve(res);
                // res.on('end', function (content) {
                //     resolve({ data:path, message: 'Success', status: res.status, headers: res.headers });
                // });
            
                // res.pipe(fs.createWriteStream(path));
            });

            req.on('error', function (err) {
                resolve({ data: null, message: 'Failed' });
            });

            req.end(data);
        });
    }

    _request(requestUrl, options, data, path) {
        options = options || {};
        var parsedUrl = url.parse(requestUrl);

        if (parsedUrl.hostname) {
            options.hostname = parsedUrl.hostname;
        }

        if (parsedUrl.port) {
            options.port = parsedUrl.port;
        }

        if (parsedUrl.path) {
            options.path = parsedUrl.path;
        }
        if(!path)
            return this._httpRequest(options, data);
        else
            return this._httpFileRequest(options, data, path);
    }

    get(url, options, path) {
        options = options || {};

        // Set method to GET and call it
        options.method = 'GET';
        return this._request(url, options, null, path);
    }

    post(url, options) {
        options = options || {};
        var self = this;

        // Try and extract data and set it's type
        var data = null;
        return new Promise(function (resolve, reject) {
            try {
                if (options.form) {
                    data = formUrlencoded.encode(options.form);
                    options.headers = {
                        'content-type': 'application/x-www-form-urlencoded',
                        'content-length': Buffer.byteLength(data)
                    };
                } else if (options.json) {
                    data = JSON.stringify(options.json);
                    if (!options.headers)
                        options.headers = {
                            'content-type': 'application/json',
                            'content-length': Buffer.byteLength(data)
                        };
                    else {
                        options.headers['content-type'] = 'application/json'
                        options.headers['content-length'] = Buffer.byteLength(data)
                    }
                }
            } catch (error) {
                return process.nextTick(function () {
                    reject({ message: 'There is issue in the sent data' });
                });
            }

            // Set method to POST and call it
            options.method = 'POST';
            return resolve(self._request(url, options, data))
        });
    }
}


module.exports = Request

