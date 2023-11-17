/*! HyperBridge 1.0.12 2016-06-15 [4a8c41bfb318+] */

var Hyper;

(function(Hyper) {
    "use strict";
    var Log = function() {
        function Log() {
            var now = new Date();
            this.id = "hyper_log_window" + (now.getMilliseconds() + now.getSeconds() * 1e3 + now.getMinutes() * 1e3 * 60);
            this.messages = "<h3>" + Hyper.Util.htmlEscape(document.URL) + "</h3>";
        }
        Log.instance = function() {
            if (!Log.instanceStatic) {
                Log.instanceStatic = new Log();
                Log.instanceStatic.installKeyboardOpen();
            }
            return Log.instanceStatic;
        };
        Log.prototype.isOpen = function() {
            try {
                return this.w && !this.w.closed && this.w.name == this.id;
            } catch (e) {
                return false;
            }
        };
        Log.prototype.open = function() {
            var _this = this;
            if (this.isOpen()) {
                this.w.focus();
            } else {
                this.w = window.open("about:blank", this.id);
                window.setTimeout(function() {
                    _this.w.document.title = "Debug Log:";
                    _this.w.document.body.innerHTML = _this.messages;
                    _this.w.focus();
                }, 1);
            }
        };
        Log.prototype.write = function(m) {
            this.messages += "<br/>" + Hyper.Util.htmlEscape(m).replace(/\n\r?/g, "<br/>\n&nbsp;&nbsp;");
            if (this.isOpen()) {
                this.w.document.body.innerHTML = this.messages;
            }
            if (typeof console !== "undefined") {
                console.log(m);
            }
        };
        Log.prototype.getMessages = function() {
            return this.messages;
        };
        Log.prototype.installKeyboardOpen = function() {
            var _this = this;
            var keys = [ 68, 69, 66, 85, 71 ];
            var index = 0;
            document.onkeydown = function(eventParm) {
                var e = eventParm || window.event;
                var code = e.charCode || e.keyCode;
                if (keys[index] == code) {
                    ++index;
                    if (index == keys.length) {
                        index = 0;
                        _this.open();
                    }
                } else {
                    index = 0;
                }
            };
        };
        return Log;
    }();
    Hyper.Log = Log;
})(Hyper || (Hyper = {}));

var Hyper;

(function(Hyper) {
    "use strict";
    var Util = function() {
        function Util() {}
        Util.getUriArguments = function(uri) {
            var r = {};
            if (uri) {
                var qi = uri.indexOf("?");
                var qe = uri.indexOf("#");
                var a = qi < 0 ? [] : uri.substring(qi + 1, qe < 0 ? uri.length : qe).split("&");
                for (var i = 0; i != a.length; i++) {
                    var left = a[i];
                    var right = "";
                    var ei = a[i].indexOf("=");
                    if (ei >= 0) {
                        left = a[i].substring(0, ei);
                        right = a[i].substring(ei + 1);
                    }
                    r[decodeURIComponent(left)] = decodeURIComponent(right);
                }
            }
            return r;
        };
        Util.getUriArgumentsLowerCase = function(uri) {
            var args = Util.getUriArguments(uri);
            var r = {};
            for (var tag in args) {
                r[tag.toLowerCase()] = args[tag];
            }
            return r;
        };
        Util.htmlEscape = function(s) {
            return String(s).replace(/[&<>"'\/]/g, function(s) {
                var m = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "/": "&#x2F;"
                };
                return m[s];
            });
        };
        return Util;
    }();
    Hyper.Util = Util;
})(Hyper || (Hyper = {}));

var Hyper;

(function(Hyper) {
    "use strict";
    try {
        document.domain = ("" + document.location.hostname).replace(/^[^.]+\./g, "");
    } catch (e) {
        Hyper.Log.instance().write("Exception changing document.domain: " + e);
    }
    var href = window.location.href;
    if (href.indexOf("hyper_id=") != -1 && href.indexOf("hyper_sub_id=") == -1) {
        window.parent["hyperLastScoUrl"] = href;
    }
    var Bridge = function() {
        function Bridge() {
            this.state = 0;
        }
        Bridge.prototype.open = function(done) {
            var _this = this;
            if (this.state === 2) {
                this.log("open() is called on an already open connection, any value set with setvalue will be lost.");
                this.state = 0;
            }
            if (this.state !== 0) {
                this.log("open() can be called more than once, but not before the callback has returned.");
                done(false);
            } else {
                var link = BridgeLink.instance();
                if (link) {
                    if (!this.impl) {
                        this.impl = new BridgeLinkBridge(link);
                    }
                    this.state++;
                    this.impl.open(function(result) {
                        if (result) {
                            ++_this.state;
                        } else {
                            --_this.state;
                        }
                        _this.log("open() called, and returned: " + result);
                        done(result);
                    });
                } else {
                    this.log("open() can not find api.");
                    Hyper.Log.instance().open();
                    done(false);
                }
            }
        };
        Bridge.prototype.log = function(message) {
            Hyper.Log.instance().write(message);
        };
        Bridge.prototype.setvalue = function(tag, value) {
            if (this.state !== 2) {
                this.log("setvalue() must be called after open, but before close.");
                return;
            }
            var v;
            if (tag.substr(0, 1) === "_") {
                if (tag === "_complete" || tag === "_score" || tag === "_elapsed") {
                    v = +value;
                    if (isNaN(v) || tag === "_score" && (v < 0 || v > 1) || tag === "_complete" && v != 0 && v != 1 || tag === "_elapsed" && v < 0) {
                        this.log('setvalue() is called with tag "' + tag + '", value "' + value + '" and typeof(value): "' + typeof value + '", the value can not be converted to a number in the correct range.');
                        return;
                    }
                } else if (tag === "_nextSco") {
                    if (typeof value === "string") {
                        v = value;
                    } else {
                        this.log('setvalue() is called with tag "' + tag + '", value "' + value + '" and typeof(value): "' + typeof value + '", the value is not a string.');
                        return;
                    }
                } else {
                    this.log('setvalue() is called with an unreconized reserved tag value: "' + tag + '"');
                    return;
                }
            } else {
                v = value;
            }
            this.log('setvalue( "' + tag + '", ' + value + " ) called");
            this.impl.setvalue(tag, v);
        };
        Bridge.prototype.getvalue = function(tag) {
            if (this.state !== 2) {
                this.log("getvalue() must be called after open, but before close.");
                return;
            }
            var r = this.impl.getvalue(tag);
            this.log('getvalue( "' + tag + '") called, and returned: "' + r + '"');
            return r;
        };
        Bridge.prototype.commit = function(done) {
            var _this = this;
            if (this.state !== 2) {
                this.log("commit() must be called after open, but before close.");
                done(false);
            } else {
                this.impl.commit(function(result) {
                    _this.log("commit() called, and returned: " + result);
                    done(result);
                });
            }
        };
        Bridge.prototype.close = function(done) {
            var _this = this;
            if (this.state !== 2) {
                this.log("close() can only be called once and it must be after open.");
                done(false);
            } else {
                ++this.state;
                this.impl.close(function(result) {
                    if (result) {
                        ++_this.state;
                    } else {
                        --_this.state;
                    }
                    done(result);
                });
            }
        };
        Bridge.instance = function() {
            if (!Bridge.privateInstance) {
                Bridge.privateInstance = new Bridge();
            }
            return Bridge.privateInstance;
        };
        return Bridge;
    }();
    Hyper.Bridge = Bridge;
    var BridgeLink = function() {
        function BridgeLink() {}
        BridgeLink.factory = function() {
            var link = null;
            if (window["launch_direct"] === true) {
                link = new Hyper.BridgeLinkReadonlyExtend(new BridgeLinkVoid(), window["launch_extra_readonly"]);
            } else if (window["launch_id"]) {
                link = new Hyper.BridgeLinkReadonlyExtend(new Hyper.BridgeLinkJson(window["launch_id"]), window["launch_extra_readonly"]);
            } else {
                var args = Hyper.Util.getUriArgumentsLowerCase(location.search);
                var aiccUrl = args["aicc_url"];
                if (aiccUrl) {
                    var aiccDirect = args["aicc_direct"];
                    link = new Hyper.BridgeLinkAicc(aiccUrl, args["aicc_sid"], !!aiccDirect);
                } else {
                    var crossDomain = args["cross_domain"];
                    if (crossDomain) {
                        link = new Hyper.BridgeLinkCrossDomain(crossDomain);
                    } else {
                        if (args["void"] === "1") {
                            link = new BridgeLinkTestStorage(new BridgeLinkVoid());
                        } else if (args["svoid"] === "1") {
                            link = new Hyper.BridgeLinkSecurity(new BridgeLinkTestStorage(new BridgeLinkVoid()));
                        } else {
                            var getApi = function(tag) {
                                try {
                                    var findApiTries = 0;
                                    var findApi = function(win) {
                                        findApiTries = 0;
                                        while (win[tag] == null && win.parent != null && win.parent != win) {
                                            findApiTries++;
                                            if (findApiTries > 50) {
                                                Hyper.Log.instance().write("Error finding '" + tag + "', too many retries.");
                                                return null;
                                            }
                                            win = win.parent;
                                        }
                                        return win[tag];
                                    };
                                    var theApi = findApi(window);
                                    if (!theApi && window.opener) {
                                        theApi = findApi(window.opener);
                                    }
                                    return theApi;
                                } catch (e) {
                                    Hyper.Log.instance().write("getApi exception for tag: " + tag + ", error: " + e);
                                }
                                return null;
                            };
                            var api = getApi("HYPER_19720220");
                            if (api) {
                                link = api;
                            } else {
                                api = getApi("API_1484_11");
                                if (api) {
                                    link = new BridgeLinkScorm2004(api);
                                } else {
                                    api = getApi("API");
                                    if (api) {
                                        link = new BridgeLinkScorm12(api);
                                    }
                                }
                            }
                        }
                    }
                }
                if (link && args["hyper_sub_id"]) {
                    link = new BridgeLinkSub(link, args["hyper_sub_id"]);
                }
            }
            if (link) {
                link = new Hyper.BridgeLinkElapsed(link);
            }
            return link;
        };
        BridgeLink.instance = function() {
            if (!BridgeLink.privateInstance) {
                BridgeLink.privateInstance = BridgeLink.factory();
            }
            return BridgeLink.privateInstance;
        };
        return BridgeLink;
    }();
    Hyper.BridgeLink = BridgeLink;
    var makeEmptyBridgeState = function() {
        return {
            _complete: 0,
            _score: 0
        };
    };
    var BridgeLinkBridge = function() {
        function BridgeLinkBridge(link) {
            this.link = link;
        }
        BridgeLinkBridge.prototype.open = function(done) {
            var _this = this;
            this.link.open(function(r, d) {
                _this.data = r ? d : makeEmptyBridgeState();
                done(r);
            });
        };
        BridgeLinkBridge.prototype.setvalue = function(tag, value) {
            if (value === undefined) {
                delete this.data[tag];
            } else {
                this.data[tag] = value;
            }
        };
        BridgeLinkBridge.prototype.getvalue = function(tag) {
            if (tag == "_tags") {
                var r = [];
                for (var t in this.data) {
                    if (this.data.hasOwnProperty(t)) {
                        r.push(t);
                    }
                }
                r.push("_tags");
                return r;
            } else {
                return this.data[tag];
            }
        };
        BridgeLinkBridge.prototype.commit = function(done) {
            var _this = this;
            this.link.commit(this.data, function(r, d) {
                if (r) {
                    _this.data = d;
                }
                done(r);
            });
        };
        BridgeLinkBridge.prototype.close = function(done) {
            delete this.data._readonly;
            this.link.close(this.data, done);
        };
        return BridgeLinkBridge;
    }();
    var BridgeLinkVoid = function() {
        function BridgeLinkVoid() {
            this.state = makeEmptyBridgeState();
        }
        BridgeLinkVoid.prototype.open = function(done) {
            var _this = this;
            window.setTimeout(function() {
                done(true, _this.state);
            }, 0);
        };
        BridgeLinkVoid.prototype.commit = function(state, done) {
            this.state = state;
            window.setTimeout(function() {
                done(true, state);
            }, 0);
        };
        BridgeLinkVoid.prototype.close = function(state, done) {
            this.state = state;
            window.setTimeout(function() {
                done(true);
            }, 0);
        };
        return BridgeLinkVoid;
    }();
    Hyper.BridgeLinkVoid = BridgeLinkVoid;
    var BridgeLinkTestStorage = function() {
        function BridgeLinkTestStorage(link) {
            this.link = link;
            this.attempt = new Date().getTime();
        }
        BridgeLinkTestStorage.prototype.open = function(done) {
            var _this = this;
            this.link.open(function(result, state) {
                var req;
                try {
                    req = new XMLHttpRequest();
                } catch (e) {}
                if (req) {
                    var appPath = window["hyper_application_path"];
                    var url = (appPath ? appPath : "") + "/hyper/server/storage/enabled";
                    var localthis = _this;
                    req.onreadystatechange = function() {
                        if (this.readyState == 4) {
                            if (this.status == 200) {
                                var j;
                                try {
                                    j = JSON.parse(this.responseText);
                                } catch (e) {}
                                if (j) {
                                    if (j.storage && j.storage === true) {
                                        var r = state["_readonly"] = state["_readonly"] || {};
                                        var endPointUrlLeft = "http://" + document.location.host + (appPath ? appPath : "") + "/hyper/server/storage/";
                                        r["add"] = endPointUrlLeft + "add?attempt=" + localthis.attempt;
                                        r["catalog"] = endPointUrlLeft + "catalog?attempt=" + localthis.attempt;
                                    } else {
                                        Hyper.Log.instance().write("Debug Storage Server at '" + url + "' is not enabled");
                                    }
                                } else {
                                    Hyper.Log.instance().write("Debug Storage Server can not be used");
                                }
                            } else {
                                Hyper.Log.instance().write("Debug Storage Server not found at '" + url + "'");
                            }
                            done(true, state);
                        }
                    };
                    req.open("POST", url);
                    req.send();
                } else {
                    done(true, state);
                }
            });
        };
        BridgeLinkTestStorage.prototype.commit = function(state, done) {
            this.link.commit(state, done);
        };
        BridgeLinkTestStorage.prototype.close = function(state, done) {
            this.link.close(state, done);
        };
        return BridgeLinkTestStorage;
    }();
    Hyper.BridgeLinkTestStorage = BridgeLinkTestStorage;
    var BridgeLinkSub = function() {
        function BridgeLinkSub(parentLink, subId) {
            this.parentLink = parentLink;
            this.subId = subId;
        }
        BridgeLinkSub.prototype.open = function(done) {
            var _this = this;
            this.parentLink.open(function(result, state) {
                if (result) {
                    done(true, _this.makeSubStateFromParent(state));
                } else {
                    done(false, state);
                }
            });
        };
        BridgeLinkSub.prototype.commit = function(state, done) {
            var _this = this;
            this.parentLink.commit(this.makeParentStateFromSub(state), function(result, state) {
                if (result) {
                    done(true, _this.makeSubStateFromParent(state));
                } else {
                    done(false, state);
                }
            });
        };
        BridgeLinkSub.prototype.close = function(state, done) {
            this.parentLink.commit(this.makeParentStateFromSub(state), function(result, state) {
                if (result) {
                    done(true);
                    var lastScoUrl = window.parent["hyperLastScoUrl"];
                    if (lastScoUrl) {
                        window.location.href = lastScoUrl;
                    } else {
                        window.history.back();
                    }
                } else {
                    done(false);
                }
            });
        };
        BridgeLinkSub.deepClone = function(s, depth) {
            if (typeof s === "object") {
                if (typeof depth === "number" && depth > 20) {
                    Hyper.Log.instance().write("HyperBridgeSub clone max depth");
                    return undefined;
                } else if (s === null) {
                    return null;
                } else {
                    var r = typeof s.length === "number" ? [] : {};
                    for (var attr in s) {
                        if (s.hasOwnProperty(attr) && attr === "menu") {
                            r[attr] = s[attr];
                        } else if (s.hasOwnProperty(attr) && typeof s[attr] !== "function") {
                            r[attr] = BridgeLinkSub.deepClone(s[attr], depth ? depth + 1 : 0);
                        }
                    }
                    return r;
                }
            } else if (typeof s === "function") {
                return undefined;
            } else {
                return s;
            }
        };
        BridgeLinkSub.prototype.makeParentStateFromSub = function(s) {
            if (s) {
                var p = BridgeLinkSub.deepClone(s["_parent"]);
                p[this.subId] = BridgeLinkSub.deepClone(s);
                delete p[this.subId]["_parent"];
                delete p[this.subId]["_readonly"];
                delete p[this.subId]["_nextSco"];
                return p;
            } else {
                return null;
            }
        };
        BridgeLinkSub.prototype.makeSubStateFromParent = function(p) {
            if (p) {
                var s;
                if (p[this.subId]) {
                    s = BridgeLinkSub.deepClone(p[this.subId]);
                } else {
                    s = makeEmptyBridgeState();
                }
                s["_parent"] = BridgeLinkSub.deepClone(p);
                delete s["_parent"][this.subId];
                s["_readonly"] = BridgeLinkSub.deepClone(p["_readonly"]);
                if (s["_readonly"] && s["_readonly"]["add"]) {
                    s["_readonly"]["add"] += (s["_readonly"]["add"].indexOf("?") < 0 ? "?" : "&") + "subSco=" + this.subId;
                }
                return s;
            } else {
                return null;
            }
        };
        return BridgeLinkSub;
    }();
    Hyper.BridgeLinkSub = BridgeLinkSub;
    var BridgeLinkScorm2004 = function() {
        function BridgeLinkScorm2004(api) {
            this.api = api;
        }
        BridgeLinkScorm2004.prototype.open = function(done) {
            done(true, makeEmptyBridgeState());
        };
        BridgeLinkScorm2004.prototype.commit = function(state, done) {
            done(true, state);
        };
        BridgeLinkScorm2004.prototype.close = function(state, done) {
            done(true);
        };
        return BridgeLinkScorm2004;
    }();
    Hyper.BridgeLinkScorm2004 = BridgeLinkScorm2004;
    var BridgeLinkScorm12 = function() {
        function BridgeLinkScorm12(api) {
            this.api = api;
        }
        BridgeLinkScorm12.prototype.open = function(done) {
            done(true, makeEmptyBridgeState());
        };
        BridgeLinkScorm12.prototype.commit = function(state, done) {
            done(true, state);
        };
        BridgeLinkScorm12.prototype.close = function(state, done) {
            done(true);
        };
        return BridgeLinkScorm12;
    }();
    Hyper.BridgeLinkScorm12 = BridgeLinkScorm12;
})(Hyper || (Hyper = {}));

var Hyper;

(function(Hyper) {
    "use strict";
    var BridgeLinkElapsed = function() {
        function BridgeLinkElapsed(link) {
            this.link = link;
            this.startTime = 0;
        }
        BridgeLinkElapsed.prototype.open = function(done) {
            if (!this.startTime) {
                this.startTime = new Date().getTime();
            }
            this.link.open(done);
        };
        BridgeLinkElapsed.prototype.commit = function(state, done) {
            this.updateElapsed(state);
            this.link.commit(state, done);
        };
        BridgeLinkElapsed.prototype.close = function(state, done) {
            this.updateElapsed(state);
            this.link.close(state, done);
        };
        BridgeLinkElapsed.prototype.updateElapsed = function(state) {
            var currentTime = new Date().getTime();
            var elapsedTime = Math.round(currentTime - this.startTime);
            state._elapsed = ~~state._elapsed + elapsedTime;
            this.startTime = currentTime;
        };
        return BridgeLinkElapsed;
    }();
    Hyper.BridgeLinkElapsed = BridgeLinkElapsed;
})(Hyper || (Hyper = {}));
//# sourceMappingURL=hyper_bridge_base_v1.js.map