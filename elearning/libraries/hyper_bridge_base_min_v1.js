/*! HyperBridge 1.0.12 2016-06-15 [4a8c41bfb318+] */

var Hyper;
!(function (a) {
  'use strict';
  var b = (function () {
    function b() {
      var b = new Date();
      (this.id =
        'hyper_log_window' +
        (b.getMilliseconds() +
          1e3 * b.getSeconds() +
          1e3 * b.getMinutes() * 60)),
        (this.messages = '<h3>' + a.Util.htmlEscape(document.URL) + '</h3>');
    }
    return (
      (b.instance = function () {
        return (
          b.instanceStatic ||
            ((b.instanceStatic = new b()),
            b.instanceStatic.installKeyboardOpen()),
          b.instanceStatic
        );
      }),
      (b.prototype.isOpen = function () {
        try {
          return this.w && !this.w.closed && this.w.name == this.id;
        } catch (a) {
          return !1;
        }
      }),
      (b.prototype.open = function () {
        var a = this;
        this.isOpen()
          ? this.w.focus()
          : ((this.w = window.open('about:blank', this.id)),
            window.setTimeout(function () {
              (a.w.document.title = 'Debug Log:'),
                (a.w.document.body.innerHTML = a.messages),
                a.w.focus();
            }, 1));
      }),
      (b.prototype.write = function (b) {
        (this.messages +=
          '<br/>' +
          a.Util.htmlEscape(b).replace(/\n\r?/g, '<br/>\n&nbsp;&nbsp;')),
          this.isOpen() && (this.w.document.body.innerHTML = this.messages),
          'undefined' != typeof console && console.log(b);
      }),
      (b.prototype.getMessages = function () {
        return this.messages;
      }),
      (b.prototype.installKeyboardOpen = function () {
        var a = this,
          b = [68, 69, 66, 85, 71],
          c = 0;
        document.onkeydown = function (d) {
          var e = d || window.event,
            f = e.charCode || e.keyCode;
          b[c] == f ? (++c, c == b.length && ((c = 0), a.open())) : (c = 0);
        };
      }),
      b
    );
  })();
  a.Log = b;
})(Hyper || (Hyper = {}));
var Hyper;
!(function (a) {
  'use strict';
  var b = (function () {
    function a() {}
    return (
      (a.getUriArguments = function (a) {
        var b = {};
        if (a)
          for (
            var c = a.indexOf('?'),
              d = a.indexOf('#'),
              e =
                0 > c
                  ? []
                  : a.substring(c + 1, 0 > d ? a.length : d).split('&'),
              f = 0;
            f != e.length;
            f++
          ) {
            var g = e[f],
              h = '',
              i = e[f].indexOf('=');
            i >= 0 && ((g = e[f].substring(0, i)), (h = e[f].substring(i + 1))),
              (b[decodeURIComponent(g)] = decodeURIComponent(h));
          }
        return b;
      }),
      (a.getUriArgumentsLowerCase = function (b) {
        var c = a.getUriArguments(b),
          d = {};
        for (var e in c) d[e.toLowerCase()] = c[e];
        return d;
      }),
      (a.htmlEscape = function (a) {
        return String(a).replace(/[&<>"'\/]/g, function (a) {
          var b = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
          };
          return b[a];
        });
      }),
      a
    );
  })();
  a.Util = b;
})(Hyper || (Hyper = {}));
var Hyper;
!(function (a) {
  'use strict';
  try {
    document.domain = ('' + document.location.hostname).replace(
      /^[^.]+\./g,
      ''
    );
  } catch (b) {
    a.Log.instance().write('Exception changing document.domain: ' + b);
  }
  var c = window.location.href;
  -1 != c.indexOf('hyper_id=') &&
    -1 == c.indexOf('hyper_sub_id=') &&
    (window.parent.hyperLastScoUrl = c);
  var d = (function () {
    function b() {
      this.state = 0;
    }
    return (
      (b.prototype.open = function (b) {
        var c = this;
        if (
          (2 === this.state &&
            (this.log(
              'open() is called on an already open connection, any value set with setvalue will be lost.'
            ),
            (this.state = 0)),
          0 !== this.state)
        )
          this.log(
            'open() can be called more than once, but not before the callback has returned.'
          ),
            b(!1);
        else {
          var d = e.instance();
          d
            ? (this.impl || (this.impl = new g(d)),
              this.state++,
              this.impl.open(function (a) {
                a ? ++c.state : --c.state,
                  c.log('open() called, and returned: ' + a),
                  b(a);
              }))
            : (this.log('open() can not find api.'),
              a.Log.instance().open(),
              b(!1));
        }
      }),
      (b.prototype.log = function (b) {
        a.Log.instance().write(b);
      }),
      (b.prototype.setvalue = function (a, b) {
        if (2 !== this.state)
          return void this.log(
            'setvalue() must be called after open, but before close.'
          );
        var c;
        if ('_' === a.substr(0, 1))
          if ('_complete' === a || '_score' === a || '_elapsed' === a) {
            if (
              ((c = +b),
              isNaN(c) ||
                ('_score' === a && (0 > c || c > 1)) ||
                ('_complete' === a && 0 != c && 1 != c) ||
                ('_elapsed' === a && 0 > c))
            )
              return void this.log(
                'setvalue() is called with tag "' +
                  a +
                  '", value "' +
                  b +
                  '" and typeof(value): "' +
                  typeof b +
                  '", the value can not be converted to a number in the correct range.'
              );
          } else {
            if ('_nextSco' !== a)
              return void this.log(
                'setvalue() is called with an unreconized reserved tag value: "' +
                  a +
                  '"'
              );
            if ('string' != typeof b)
              return void this.log(
                'setvalue() is called with tag "' +
                  a +
                  '", value "' +
                  b +
                  '" and typeof(value): "' +
                  typeof b +
                  '", the value is not a string.'
              );
            c = b;
          }
        else c = b;
        this.log('setvalue( "' + a + '", ' + b + ' ) called'),
          this.impl.setvalue(a, c);
      }),
      (b.prototype.getvalue = function (a) {
        if (2 !== this.state)
          return void this.log(
            'getvalue() must be called after open, but before close.'
          );
        var b = this.impl.getvalue(a);
        return (
          this.log('getvalue( "' + a + '") called, and returned: "' + b + '"'),
          b
        );
      }),
      (b.prototype.commit = function (a) {
        var b = this;
        2 !== this.state
          ? (this.log('commit() must be called after open, but before close.'),
            a(!1))
          : this.impl.commit(function (c) {
              b.log('commit() called, and returned: ' + c), a(c);
            });
      }),
      (b.prototype.close = function (a) {
        var b = this;
        2 !== this.state
          ? (this.log(
              'close() can only be called once and it must be after open.'
            ),
            a(!1))
          : (++this.state,
            this.impl.close(function (c) {
              c ? ++b.state : --b.state, a(c);
            }));
      }),
      (b.instance = function () {
        return (
          b.privateInstance || (b.privateInstance = new b()), b.privateInstance
        );
      }),
      b
    );
  })();
  a.Bridge = d;
  var e = (function () {
    function b() {}
    return (
      (b.factory = function () {
        var b = null;
        if (window.launch_direct === !0)
          b = new a.BridgeLinkReadonlyExtend(
            new h(),
            window.launch_extra_readonly
          );
        else if (window.launch_id)
          b = new a.BridgeLinkReadonlyExtend(
            new a.BridgeLinkJson(window.launch_id),
            window.launch_extra_readonly
          );
        else {
          var c = a.Util.getUriArgumentsLowerCase(location.search),
            d = c.aicc_url;
          if (d) {
            var e = c.aicc_direct;
            b = new a.BridgeLinkAicc(d, c.aicc_sid, !!e);
          } else {
            var f = c.cross_domain;
            if (f) b = new a.BridgeLinkCrossDomain(f);
            else if ('1' === c['void']) b = new i(new h());
            else if ('1' === c.svoid)
              b = new a.BridgeLinkSecurity(new i(new h()));
            else {
              var g = function (b) {
                  try {
                    var c = 0,
                      d = function (d) {
                        for (
                          c = 0;
                          null == d[b] && null != d.parent && d.parent != d;

                        ) {
                          if ((c++, c > 50))
                            return (
                              a.Log.instance().write(
                                "Error finding '" + b + "', too many retries."
                              ),
                              null
                            );
                          d = d.parent;
                        }
                        return d[b];
                      },
                      e = d(window);
                    return !e && window.opener && (e = d(window.opener)), e;
                  } catch (f) {
                    a.Log.instance().write(
                      'getApi exception for tag: ' + b + ', error: ' + f
                    );
                  }
                  return null;
                },
                m = g('HYPER_19720220');
              m
                ? (b = m)
                : ((m = g('API_1484_11')),
                  m ? (b = new k(m)) : ((m = g('API')), m && (b = new l(m))));
            }
          }
          b && c.hyper_sub_id && (b = new j(b, c.hyper_sub_id));
        }
        return b && (b = new a.BridgeLinkElapsed(b)), b;
      }),
      (b.instance = function () {
        return (
          b.privateInstance || (b.privateInstance = b.factory()),
          b.privateInstance
        );
      }),
      b
    );
  })();
  a.BridgeLink = e;
  var f = function () {
      return { _complete: 0, _score: 0 };
    },
    g = (function () {
      function a(a) {
        this.link = a;
      }
      return (
        (a.prototype.open = function (a) {
          var b = this;
          this.link.open(function (c, d) {
            (b.data = c ? d : f()), a(c);
          });
        }),
        (a.prototype.setvalue = function (a, b) {
          void 0 === b ? delete this.data[a] : (this.data[a] = b);
        }),
        (a.prototype.getvalue = function (a) {
          if ('_tags' == a) {
            var b = [];
            for (var c in this.data) this.data.hasOwnProperty(c) && b.push(c);
            return b.push('_tags'), b;
          }
          return this.data[a];
        }),
        (a.prototype.commit = function (a) {
          var b = this;
          this.link.commit(this.data, function (c, d) {
            c && (b.data = d), a(c);
          });
        }),
        (a.prototype.close = function (a) {
          delete this.data._readonly, this.link.close(this.data, a);
        }),
        a
      );
    })(),
    h = (function () {
      function a() {
        this.state = f();
      }
      return (
        (a.prototype.open = function (a) {
          var b = this;
          window.setTimeout(function () {
            a(!0, b.state);
          }, 0);
        }),
        (a.prototype.commit = function (a, b) {
          (this.state = a),
            window.setTimeout(function () {
              b(!0, a);
            }, 0);
        }),
        (a.prototype.close = function (a, b) {
          (this.state = a),
            window.setTimeout(function () {
              b(!0);
            }, 0);
        }),
        a
      );
    })();
  a.BridgeLinkVoid = h;
  var i = (function () {
    function b(a) {
      (this.link = a), (this.attempt = new Date().getTime());
    }
    return (
      (b.prototype.open = function (b) {
        var c = this;
        this.link.open(function (d, e) {
          var f;
          try {
            f = new XMLHttpRequest();
          } catch (g) {}
          if (f) {
            var h = window.hyper_application_path,
              i = (h ? h : '') + '/hyper/server/storage/enabled',
              j = c;
            (f.onreadystatechange = function () {
              if (4 == this.readyState) {
                if (200 == this.status) {
                  var c;
                  try {
                    c = JSON.parse(this.responseText);
                  } catch (d) {}
                  if (c)
                    if (c.storage && c.storage === !0) {
                      var f = (e._readonly = e._readonly || {}),
                        g =
                          'http://' +
                          document.location.host +
                          (h ? h : '') +
                          '/hyper/server/storage/';
                      (f.add = g + 'add?attempt=' + j.attempt),
                        (f.catalog = g + 'catalog?attempt=' + j.attempt);
                    } else
                      a.Log.instance().write(
                        "Debug Storage Server at '" + i + "' is not enabled"
                      );
                  else
                    a.Log.instance().write(
                      'Debug Storage Server can not be used'
                    );
                } else
                  a.Log.instance().write(
                    "Debug Storage Server not found at '" + i + "'"
                  );
                b(!0, e);
              }
            }),
              f.open('POST', i),
              f.send();
          } else b(!0, e);
        });
      }),
      (b.prototype.commit = function (a, b) {
        this.link.commit(a, b);
      }),
      (b.prototype.close = function (a, b) {
        this.link.close(a, b);
      }),
      b
    );
  })();
  a.BridgeLinkTestStorage = i;
  var j = (function () {
    function b(a, b) {
      (this.parentLink = a), (this.subId = b);
    }
    return (
      (b.prototype.open = function (a) {
        var b = this;
        this.parentLink.open(function (c, d) {
          c ? a(!0, b.makeSubStateFromParent(d)) : a(!1, d);
        });
      }),
      (b.prototype.commit = function (a, b) {
        var c = this;
        this.parentLink.commit(this.makeParentStateFromSub(a), function (a, d) {
          a ? b(!0, c.makeSubStateFromParent(d)) : b(!1, d);
        });
      }),
      (b.prototype.close = function (a, b) {
        this.parentLink.commit(this.makeParentStateFromSub(a), function (a) {
          if (a) {
            b(!0);
            var c = window.parent.hyperLastScoUrl;
            c ? (window.location.href = c) : window.history.back();
          } else b(!1);
        });
      }),
      (b.deepClone = function (c, d) {
        if ('object' == typeof c) {
          if ('number' == typeof d && d > 20)
            return void a.Log.instance().write(
              'HyperBridgeSub clone max depth'
            );
          if (null === c) return null;
          var e = 'number' == typeof c.length ? [] : {};
          for (var f in c)
            c.hasOwnProperty(f) && 'menu' === f
              ? (e[f] = c[f])
              : c.hasOwnProperty(f) &&
                'function' != typeof c[f] &&
                (e[f] = b.deepClone(c[f], d ? d + 1 : 0));
          return e;
        }
        return 'function' == typeof c ? void 0 : c;
      }),
      (b.prototype.makeParentStateFromSub = function (a) {
        if (a) {
          var c = b.deepClone(a._parent);
          return (
            (c[this.subId] = b.deepClone(a)),
            delete c[this.subId]._parent,
            delete c[this.subId]._readonly,
            delete c[this.subId]._nextSco,
            c
          );
        }
        return null;
      }),
      (b.prototype.makeSubStateFromParent = function (a) {
        if (a) {
          var c;
          return (
            (c = a[this.subId] ? b.deepClone(a[this.subId]) : f()),
            (c._parent = b.deepClone(a)),
            delete c._parent[this.subId],
            (c._readonly = b.deepClone(a._readonly)),
            c._readonly &&
              c._readonly.add &&
              (c._readonly.add +=
                (c._readonly.add.indexOf('?') < 0 ? '?' : '&') +
                'subSco=' +
                this.subId),
            c
          );
        }
        return null;
      }),
      b
    );
  })();
  a.BridgeLinkSub = j;
  var k = (function () {
    function a(a) {
      this.api = a;
    }
    return (
      (a.prototype.open = function (a) {
        a(!0, f());
      }),
      (a.prototype.commit = function (a, b) {
        b(!0, a);
      }),
      (a.prototype.close = function (a, b) {
        b(!0);
      }),
      a
    );
  })();
  a.BridgeLinkScorm2004 = k;
  var l = (function () {
    function a(a) {
      this.api = a;
    }
    return (
      (a.prototype.open = function (a) {
        a(!0, f());
      }),
      (a.prototype.commit = function (a, b) {
        b(!0, a);
      }),
      (a.prototype.close = function (a, b) {
        b(!0);
      }),
      a
    );
  })();
  a.BridgeLinkScorm12 = l;
})(Hyper || (Hyper = {}));
var Hyper;
!(function (a) {
  'use strict';
  var b = (function () {
    function a(a) {
      (this.link = a), (this.startTime = 0);
    }
    return (
      (a.prototype.open = function (a) {
        this.startTime || (this.startTime = new Date().getTime()),
          this.link.open(a);
      }),
      (a.prototype.commit = function (a, b) {
        this.updateElapsed(a), this.link.commit(a, b);
      }),
      (a.prototype.close = function (a, b) {
        this.updateElapsed(a), this.link.close(a, b);
      }),
      (a.prototype.updateElapsed = function (a) {
        var b = new Date().getTime(),
          c = Math.round(b - this.startTime);
        (a._elapsed = ~~a._elapsed + c), (this.startTime = b);
      }),
      a
    );
  })();
  a.BridgeLinkElapsed = b;
})(Hyper || (Hyper = {}));
//# sourceMappingURL=hyper_bridge_base_min_v1.js.map
