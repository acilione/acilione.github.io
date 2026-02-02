// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"6yeij":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "ac20227509f8ce34";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"5AXzI":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _three = require("three");
var _lilGui = require("lil-gui");
var _lilGuiDefault = parcelHelpers.interopDefault(_lilGui);
var _orbitControlsJs = require("three/examples/jsm/controls/OrbitControls.js");
// =============================================================================
// NUMERICAL UTILITY FUNCTIONS
// =============================================================================
const PI = Math.PI;
// Area of the straw end in m² (from paper: 16.19 mm²)
const A = 16.19 * Math.pow(10, -6);
// Surface tension of soap solution in N/m (approximated)
const sig = 2.48 * Math.pow(10, -2);
// Viscosity of air in Pa·s
const mu = 1.84 * Math.pow(10, -5);
// Density of air in kg/m³
const ro = 1.22;
// Radius of the straw (calculated from A)
const r_straw = Math.sqrt(A / PI);
function integrateQuad(func, a, b, n = 2000) {
    if (a === b) return 0;
    const h = (b - a) / n;
    let sum = 0.5 * (func(a) + func(b));
    for(let i = 1; i < n; i++)sum += func(a + i * h);
    return sum * h;
}
function brent(f, lowerBound, upperBound, tolerance = 1e-6, maxIterations = 100) {
    let a = lowerBound;
    let b = upperBound;
    let fa = f(a);
    let fb = f(b);
    if (fa * fb > 0) return 0;
    if (Math.abs(fa) < Math.abs(fb)) {
        [a, b] = [
            b,
            a
        ];
        [fa, fb] = [
            fb,
            fa
        ];
    }
    let c = a, fc = fa, s = 0, d = 0;
    let mflag = true;
    for(let i = 0; i < maxIterations; i++){
        if (fb === 0 || Math.abs(b - a) <= tolerance) return b;
        if (fa !== fc && fb !== fc) s = a * fb * fc / ((fa - fb) * (fa - fc)) + b * fa * fc / ((fb - fa) * (fb - fc)) + c * fa * fb / ((fc - fa) * (fc - fb));
        else s = b - fb * ((b - a) / (fb - fa));
        if ((s - (3 * a + b) / 4) * (s - b) >= 0 || mflag && Math.abs(s - b) >= Math.abs(b - c) / 2 || !mflag && Math.abs(s - b) >= Math.abs(c - d) / 2 || mflag && Math.abs(b - c) < Math.abs(tolerance) || !mflag && Math.abs(c - d) < Math.abs(tolerance)) {
            s = (a + b) / 2;
            mflag = true;
        } else mflag = false;
        d = c;
        c = b;
        fc = fb;
        const fs = f(s);
        if (fa * fs < 0) {
            b = s;
            fb = fs;
        } else {
            a = s;
            fa = fs;
        }
        if (Math.abs(fa) < Math.abs(fb)) {
            [a, b] = [
                b,
                a
            ];
            [fa, fb] = [
                fb,
                fa
            ];
        }
    }
    return b;
}
function integrand(R, L) {
    return Math.pow(R, 2.5) * Math.sqrt(1 + 8 / (ro * sig) * Math.pow(PI * mu * L / A, 2) * R);
}
function calc_t_gen(L, R_0, R) {
    try {
        const integralRes = integrateQuad((r)=>integrand(r, L), R, R_0);
        const term1 = Math.pow(PI, 2) * mu * L / (sig * Math.pow(A, 2)) * (Math.pow(R_0, 4) - Math.pow(R, 4));
        const term2 = PI / A * Math.sqrt(2 * ro / sig) * integralRes;
        return term1 + term2;
    } catch (e) {
        console.error("Error in calc_t_gen:", e);
        return 0;
    }
}
function calc_rt_gen(L, R_0, t) {
    const rootFunc = (R)=>calc_t_gen(L, R_0, R) - t;
    return brent(rootFunc, 0.0, R_0, 1e-6, 100);
}
function calculate_duration_gen(L, R_0) {
    try {
        const integralRes = integrateQuad((r)=>integrand(r, L), 0.0, R_0);
        const term1 = Math.pow(PI, 2) * mu * L / (sig * Math.pow(A, 2)) * Math.pow(R_0, 4);
        const term2 = PI / A * Math.sqrt(2 * ro / sig) * integralRes;
        return term1 + term2;
    } catch (e) {
        console.error("Error in calculate_duration_gen:", e);
        return 0;
    }
}
// =============================================================================
// THREE.JS SCENE IMPLEMENTATION
// =============================================================================
class DeflatingBubbleScene {
    constructor(containerId = "scene-container"){
        if (typeof _three === "undefined") throw new Error("THREE.js is not loaded.");
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error(`Container element with id '${containerId}' not found.`);
        this.guiParams = {
            R_0: 4.0 * Math.pow(10, -2),
            L1: 1.0 * Math.pow(10, -2),
            L2: 5.0 * Math.pow(10, -2),
            L3: 10.0 * Math.pow(10, -2),
            isRunning: false,
            scale_factor: 40,
            viewMode: "2D",
            showDashedLines: true,
            soapEffect: true,
            playPause: ()=>{
                this.guiParams.isRunning = !this.guiParams.isRunning;
                this.handlePlayPause();
            }
        };
        this.clock = new _three.Clock(false);
        this.guiControllers = [];
        this.controls = null;
        this.camera2D = null;
        this.camera3D = null;
        this.initThree();
        this.setupPhysicsAndAnimation();
        this.setupGUI();
        this.addTextLabels();
        this.animate = this.animate.bind(this);
        this.animate();
    }
    /**
   * Gets the current theme from the HTML data attribute.
   * Defaults to 'light'.
   */ getCurrentTheme() {
        return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }
    /**
   * Updates the scene's background color based on the current theme.
   */ updateSceneTheme() {
        const theme = this.getCurrentTheme();
        if (this.scene) this.scene.background = new _three.Color(theme === "dark" ? 0x0d1117 : 0xffffff // Originale dark, bianco per light
        );
    }
    /**
   * Sets up a MutationObserver to watch for changes to the
   * `data-theme` attribute on the <html> tag.
   */ setupThemeObserver() {
        this.themeObserver = new MutationObserver((mutationsList)=>{
            for (const mutation of mutationsList)if (mutation.type === "attributes" && mutation.attributeName === "data-theme") this.updateSceneTheme();
        });
        this.themeObserver.observe(document.documentElement, {
            attributes: true
        });
    }
    initThree() {
        this.scene = new _three.Scene();
        this.updateSceneTheme();
        this.renderer = new _three.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        // --- DUAL CAMERA SETUP ---
        const aspect = this.container.clientWidth / this.container.clientHeight;
        let horizontalHalfWidth = 0;
        if (this.container.clientWidth > 1280) horizontalHalfWidth = 28;
        else horizontalHalfWidth = 14;
        const verticalHalfHeight = horizontalHalfWidth / aspect;
        this.camera2D = new _three.OrthographicCamera(-horizontalHalfWidth, horizontalHalfWidth, verticalHalfHeight, -verticalHalfHeight, 0.1, 100);
        this.camera2D.position.z = 5;
        // 3D Camera (Perspective, rotatable)
        this.camera3D = new _three.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera3D.position.set(0, 5, 15);
        this.camera3D.lookAt(0, 0, 0);
        this.camera = this.camera2D;
        // --- 3D CONTROLS (OrbitControls) ---
        this.controls = new (0, _orbitControlsJs.OrbitControls)(this.camera3D, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enabled = false;
        const light = new _three.AmbientLight(0x404040, 10);
        this.scene.add(light);
        window.addEventListener("resize", this.onWindowResize.bind(this));
        this.straws = [];
        this.staticCircles = [];
        this.setupThemeObserver();
    }
    onWindowResize() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        let horizontalHalfWidth = 0;
        if (this.container.clientWidth > 1280) horizontalHalfWidth = 28;
        else horizontalHalfWidth = 14;
        const verticalHalfHeight = horizontalHalfWidth / aspect;
        this.camera2D.left = -horizontalHalfWidth;
        this.camera2D.right = horizontalHalfWidth;
        this.camera2D.top = verticalHalfHeight;
        this.camera2D.bottom = -verticalHalfHeight;
        this.camera2D.updateProjectionMatrix();
        // Update 3D Camera
        this.camera3D.aspect = aspect;
        this.camera3D.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.camera = this.guiParams.viewMode === "2D" ? this.camera2D : this.camera3D;
        // Re-position text on resize, as screen dimensions changed
        // The animate loop will handle the precise positioning
        this.animate();
    }
    handlePlayPause() {
        if (this.guiParams.isRunning) {
            this.bubble_active = this.bubble_durations.map((d, i)=>this.bubble_times[i] < d);
            this.clock.start();
        } else this.clock.stop();
    }
    resetAnimation(index) {
        const L_key = `L${index + 1}`;
        const L = this.guiParams[L_key];
        const R_0 = this.guiParams.R_0;
        this.bubble_durations[index] = calculate_duration_gen(L, R_0);
        this.max_duration = Math.max(...this.bubble_durations);
        this.bubble_times[index] = 0;
        this.bubble_active[index] = true;
        const pos = this.positions[index];
        const scaledR0 = R_0 * this.guiParams.scale_factor;
        // --- CALCULATIONS FOR FIXED BUBBLE TOP & STRAW ---
        const strawHeight = L * this.guiParams.scale_factor;
        const fixedTopY = pos.y;
        const initialBubbleCenterY = fixedTopY - scaledR0;
        const strawBottomY = fixedTopY;
        const strawCenterY = strawBottomY + strawHeight / 2;
        // Update straw (FIXED POSITION)
        const straw = this.straws[index];
        if (straw) {
            straw.scale.set(1, strawHeight, 1);
            straw.position.set(pos.x, strawCenterY, 0);
        }
        // Update circle (SPHERE)
        const circle = this.circles[index];
        if (circle) {
            circle.scale.setScalar(scaledR0);
            circle.position.y = initialBubbleCenterY;
        }
        // Update text
        if (this.textGroups && this.textGroups[index]) {
            this.textGroups[index].L.textContent = `L: ${(L * 100).toFixed(2)} cm`;
            this.textGroups[index].R.textContent = `R(t): ${(R_0 * 100).toFixed(2)} cm`;
            this.textGroups[index].time.textContent = `t: 0.0 s`;
            this.textGroups[index].group.style.opacity = 1;
        }
        // Update static dashed circle
        if (R_0 !== this._lastR0 || !this.staticCircles[index]) {
            if (this.staticCircles[index]) this.scene.remove(this.staticCircles[index]);
            const static_circle_pos = new _three.Vector3(pos.x, initialBubbleCenterY, pos.z);
            const static_circle = this.createDashedCircle(scaledR0, static_circle_pos);
            static_circle.visible = this.guiParams.showDashedLines;
            this.scene.add(static_circle);
            this.staticCircles[index] = static_circle;
        }
        this.addTextLabels();
        this.renderer.render(this.scene, this.camera);
    }
    setupPhysicsAndAnimation() {
        this.scene.children.filter((obj)=>obj.userData && obj.userData.isBubbleComponent).forEach((obj)=>this.scene.remove(obj));
        this.straws = [];
        this.circles = [];
        this.staticCircles = [];
        const { L1, L2, L3, R_0, scale_factor } = this.guiParams;
        this._lastR0 = R_0;
        this.Ls = [
            L1,
            L2,
            L3
        ];
        this.bubble_durations = this.Ls.map((L)=>calculate_duration_gen(L, R_0));
        this.max_duration = Math.max(...this.bubble_durations);
        this.positions = [
            new _three.Vector3(-8, 0, 0),
            new _three.Vector3(0, 0, 0),
            new _three.Vector3(8, 0, 0)
        ];
        this.bubble_times = [
            0,
            0,
            0
        ];
        this.bubble_active = [
            true,
            true,
            true
        ];
        // 💡 3D GEOMETRY DEFINITIONS
        const circleGeometry = new _three.SphereGeometry(1, 32, 32);
        const strawRadius = r_straw * scale_factor;
        // Cylinder of unit height (1), scaled later
        const strawGeometry = new _three.CylinderGeometry(strawRadius, strawRadius, 1, 32);
        const strawMaterial = new _three.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
            side: _three.DoubleSide
        });
        const scaledR0 = R_0 * scale_factor;
        this.Ls.forEach((L, i)=>{
            const pos = this.positions[i];
            // --- CALCULATIONS FOR FIXED BUBBLE TOP & STRAW ---
            const strawHeight = L * scale_factor;
            const fixedTopY = pos.y;
            const initialBubbleCenterY = fixedTopY - scaledR0;
            const strawBottomY = fixedTopY;
            const strawCenterY = strawBottomY + strawHeight / 2;
            // static dashed circle (2D circle for outline)
            const static_circle_pos = new _three.Vector3(pos.x, initialBubbleCenterY, pos.z);
            const static_circle = this.createDashedCircle(scaledR0, static_circle_pos);
            static_circle.userData.isBubbleComponent = true;
            static_circle.visible = this.guiParams.showDashedLines; // initial visibility
            this.scene.add(static_circle);
            this.staticCircles.push(static_circle);
            // DYNAMIC BUBBLE (SPHERE) with soap effect material
            const circleMaterial = this.guiParams.soapEffect ? this.createSoapBubbleMaterial() : new _three.MeshBasicMaterial({
                color: 0x00bfff,
                transparent: true,
                opacity: 0.5,
                side: _three.DoubleSide
            });
            const circle = new _three.Mesh(circleGeometry, circleMaterial);
            circle.position.set(pos.x, initialBubbleCenterY, pos.z);
            circle.scale.setScalar(scaledR0);
            circle.userData.isBubbleComponent = true;
            this.circles.push(circle);
            this.scene.add(circle);
            // STRAW (CYLINDER)
            const straw = new _three.Mesh(strawGeometry, strawMaterial);
            straw.scale.set(1, strawHeight, 1);
            straw.position.set(pos.x, strawCenterY, 0);
            straw.userData.isBubbleComponent = true;
            this.straws.push(straw);
            this.scene.add(straw);
        });
    }
    createDashedCircle(radius, position) {
        const segments = 64;
        const points = [];
        for(let j = 0; j <= segments; j++){
            const angle = j / segments * Math.PI * 2;
            points.push(new _three.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));
        }
        const geometry = new _three.BufferGeometry().setFromPoints(points);
        const material = new _three.LineDashedMaterial({
            color: 0xffffff,
            linewidth: 1,
            scale: 1,
            dashSize: 0.1,
            gapSize: 0.1
        });
        const line = new _three.Line(geometry, material);
        line.computeLineDistances();
        line.position.copy(position);
        return line;
    }
    /**
   * Creates a soap bubble material with thin-film interference (iridescence).
   * Based on the physics of light interference in thin films.
   * @returns {THREE.ShaderMaterial} The soap bubble shader material
   */ createSoapBubbleMaterial() {
        const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
        const fragmentShader = `
      uniform float uTime;
      uniform float uThickness;
      uniform vec3 uCameraPosition;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      
      // Attempt to simulate thin-film interference colors
      // Based on wavelength-dependent phase shift in thin films
      vec3 thinFilmInterference(float thickness, float cosAngle) {
        // Refractive index of soap film (approximately 1.33 like water)
        float n = 1.33;
        
        // Optical path difference for different wavelengths (nm)
        // Red: 700nm, Green: 530nm, Blue: 470nm
        float pathDiff = 2.0 * n * thickness * cosAngle;
        
        // Calculate phase for each color channel
        // Higher frequencies (shorter wavelengths) shift faster
        float phaseR = pathDiff / 700.0;
        float phaseG = pathDiff / 530.0;
        float phaseB = pathDiff / 470.0;
        
        // Interference pattern (constructive/destructive)
        vec3 color;
        color.r = 0.5 + 0.5 * cos(phaseR * 3.14159 * 2.0);
        color.g = 0.5 + 0.5 * cos(phaseG * 3.14159 * 2.0);
        color.b = 0.5 + 0.5 * cos(phaseB * 3.14159 * 2.0);
        
        return color;
      }
      
      void main() {
        // Calculate view direction
        vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
        
        // Fresnel effect - stronger reflection at grazing angles
        float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
        fresnel = pow(fresnel, 3.0); // Higher power = more subtle edge effect
        
        // Film thickness varies based on position and time (slower, subtler flow)
        float thickness = uThickness * (1.0 + 0.15 * sin(vUv.x * 6.0 + uTime * 0.3) 
                                              + 0.1 * sin(vUv.y * 5.0 - uTime * 0.2)
                                              + 0.08 * sin(vPosition.x * 3.0 + vPosition.y * 2.0 + uTime * 0.15));
        
        // Thin-film interference color
        float cosAngle = abs(dot(viewDir, vNormal));
        vec3 interferenceColor = thinFilmInterference(thickness, cosAngle);
        
        // Base soap color (soft, slightly iridescent white-blue)
        vec3 baseColor = vec3(0.92, 0.95, 1.0);
        
        // Mix interference with base color - much more subtle blend
        vec3 finalColor = mix(baseColor, interferenceColor, 0.25 + 0.15 * fresnel);
        
        // Subtle rainbow tint at edges only
        vec3 rainbowEdge = vec3(
          0.5 + 0.5 * sin(fresnel * 4.0 + 0.0),
          0.5 + 0.5 * sin(fresnel * 4.0 + 2.09),
          0.5 + 0.5 * sin(fresnel * 4.0 + 4.18)
        );
        finalColor = mix(finalColor, rainbowEdge, fresnel * 0.15); // Much subtler edge rainbow
        
        // Add soft highlight for reflection simulation
        float highlight = pow(max(dot(reflect(-viewDir, vNormal), vec3(0.5, 1.0, 0.5)), 0.0), 48.0);
        finalColor += vec3(1.0) * highlight * 0.4;
        
        // Transparency: more transparent overall, subtle edge opacity
        float alpha = 0.2 + fresnel * 0.35;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;
        const material = new _three.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: {
                    value: 0.0
                },
                uThickness: {
                    value: 400.0
                },
                uCameraPosition: {
                    value: new _three.Vector3()
                }
            },
            transparent: true,
            side: _three.DoubleSide,
            depthWrite: false
        });
        return material;
    }
    addTextLabels() {
        if (this.textOverlay) this.textOverlay.remove();
        this.textOverlay = document.createElement("div");
        this.textOverlay.className = "text-label-overlay";
        this.container.appendChild(this.textOverlay);
        this.textGroups = [];
        this.Ls = [
            this.guiParams.L1,
            this.guiParams.L2,
            this.guiParams.L3
        ];
        this.Ls.forEach((L, i)=>{
            const groupDiv = document.createElement("div");
            groupDiv.className = "label-group";
            const L_text = document.createElement("div");
            L_text.textContent = `L: ${(L * 100).toFixed(2)} cm`;
            const time_text = document.createElement("div");
            time_text.textContent = `t: 0.0 s`;
            const r_text = document.createElement("div");
            r_text.textContent = `R(t): ${(this.guiParams.R_0 * 100).toFixed(2)} cm`;
            groupDiv.appendChild(L_text);
            groupDiv.appendChild(time_text);
            groupDiv.appendChild(r_text);
            this.textOverlay.appendChild(groupDiv);
            this.textGroups.push({
                group: groupDiv,
                L: L_text,
                time: time_text,
                R: r_text
            });
        });
    }
    toScreenPosition(vector3, camera, canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const vector = vector3.clone().project(camera);
        vector.x = (vector.x + 1) / 2 * width;
        vector.y = -(vector.y - 1) / 2 * height;
        return {
            x: vector.x,
            y: vector.y
        };
    }
    setupGUI() {
        let gui;
        try {
            gui = new (0, _lilGuiDefault.default)({
                autoPlace: true,
                title: "Bubble Controls"
            });
        } catch (e) {
            gui = {
                domElement: document.createElement("div"),
                add: ()=>({
                        step: ()=>({
                                onChange: ()=>({
                                        name: ()=>null
                                    })
                            }),
                        name: ()=>null,
                        onChange: ()=>null
                    })
            };
        }
        this.gui = gui;
        this.container.appendChild(gui.domElement);
        gui.domElement.style.position = "fixed";
        gui.domElement.style.zIndex = "19";
        gui.domElement.style.top = "10%";
        gui.domElement.style.right = "10%";
        this.guiControllers = [];
        const playCtrl = gui.add(this.guiParams, "playPause").name("\u25B6\uFE0F / \u23F8\uFE0F Start/Pause");
        this.guiControllers.push(playCtrl);
        const viewModeController = gui.add(this.guiParams, "viewMode", [
            "2D",
            "3D"
        ]).name("View Mode").onChange((value)=>{
            this.camera = value === "2D" ? this.camera2D : this.camera3D;
            this.controls.enabled = value === "3D";
            this.onWindowResize();
        });
        this.guiControllers.push(viewModeController);
        // 💡 NEW: Dashed line visibility toggle
        const dashedCtrl = gui.add(this.guiParams, "showDashedLines").name("Show Initial Radius").onChange((value)=>{
            this.staticCircles.forEach((circle)=>{
                circle.visible = value;
            });
        });
        this.guiControllers.push(dashedCtrl);
        // Soap effect toggle (iridescent visual effect)
        const soapCtrl = gui.add(this.guiParams, "soapEffect").name("\uD83E\uDEE7 Soap Effect").onChange(()=>{
            // Rebuild the scene with new materials
            this.setupPhysicsAndAnimation();
            this.addTextLabels();
            for(let i = 0; i < 3; i++)this.resetAnimation(i);
        });
        this.guiControllers.push(soapCtrl);
        const R0_MIN = 0.001;
        const R0_MAX = 0.1;
        const R0_STEP = 0.001;
        const r0Controller = gui.add(this.guiParams, "R_0", R0_MIN, R0_MAX);
        this.guiControllers.push(r0Controller);
        r0Controller.step(R0_STEP).name("R\u2080 (Initial Radius, m)").onChange(()=>{
            this.guiParams.isRunning = false;
            this.setupPhysicsAndAnimation();
            this.addTextLabels();
            for(let i = 0; i < 3; i++)this.resetAnimation(i);
        });
        const L_MIN = 0.001;
        const L_MAX = 0.2;
        const L_STEP = 0.001;
        const resetAllBubblesOnLChange = (index)=>{
            this.guiParams.isRunning = false;
            this.resetAnimation(index);
            this.bubble_times = [
                0,
                0,
                0
            ];
            this.bubble_active = [
                true,
                true,
                true
            ];
            for(let i = 0; i < 3; i++)if (i !== index) {
                this.Ls[i] = this.guiParams[`L${i + 1}`];
                this.resetAnimation(i);
            }
            this.addTextLabels();
        };
        const l1 = gui.add(this.guiParams, "L1", L_MIN, L_MAX);
        this.guiControllers.push(l1);
        l1.step(L_STEP).name("L\u2081 (Length 1, m)").onChange(()=>resetAllBubblesOnLChange(0));
        const l2 = gui.add(this.guiParams, "L2", L_MIN, L_MAX);
        this.guiControllers.push(l2);
        l2.step(L_STEP).name("L\u2082 (Length 2, m)").onChange(()=>resetAllBubblesOnLChange(1));
        const l3 = gui.add(this.guiParams, "L3", L_MIN, L_MAX);
        this.guiControllers.push(l3);
        l3.step(L_STEP).name("L\u2083 (Length 3, m)").onChange(()=>resetAllBubblesOnLChange(2));
        const resetObj = {
            reset: ()=>this.resetAll()
        };
        const resetCtrl = gui.add(resetObj, "reset");
        this.guiControllers.push(resetCtrl);
        resetCtrl.name("\uD83D\uDD04 Reset All");
    }
    resetAll() {
        this.guiParams.R_0 = 4.0 * Math.pow(10, -2);
        this.guiParams.L1 = 1.0 * Math.pow(10, -2);
        this.guiParams.L2 = 5.0 * Math.pow(10, -2);
        this.guiParams.L3 = 10.0 * Math.pow(10, -2);
        this.guiParams.isRunning = false;
        this.guiParams.showDashedLines = true;
        this.setupPhysicsAndAnimation();
        this.addTextLabels();
        for(let i = 0; i < 3; i++)this.resetAnimation(i);
        for (const ctrl of this.guiControllers)try {
            if (ctrl && typeof ctrl.updateDisplay === "function") ctrl.updateDisplay();
        } catch (e) {
        // ignore
        }
        this.renderer.render(this.scene, this.camera);
    }
    animate() {
        requestAnimationFrame(this.animate);
        if (this.guiParams.viewMode === "3D") this.controls.update();
        // 💡 DYNAMIC TEXT POSITIONING: Update text position every frame
        if (this.textGroups && this.circles.length > 0) {
            // Calculate the fixed world Y position for the text (below the initial bubble size)
            const yOffset = this.guiParams.R_0 * this.guiParams.scale_factor * 2 + 0.5;
            const yTextRef = this.positions[0].y - yOffset;
            this.Ls.forEach((L, i)=>{
                const pos = this.positions[i];
                // Use the consistent X/Z position, and the calculated Y position
                const worldPosition = new _three.Vector3(pos.x, yTextRef, pos.z);
                // Convert the 3D world coordinate to a 2D screen coordinate
                const textScreenPos = this.toScreenPosition(worldPosition, this.camera, this.renderer.domElement);
                const groupDiv = this.textGroups[i].group;
                // Update the CSS position using translate(-50%, 0) from the center point
                groupDiv.style.left = `${textScreenPos.x}px`;
                groupDiv.style.top = `${textScreenPos.y}px`;
            });
        }
        // Update soap bubble shader uniforms
        if (this.guiParams.soapEffect && this.circles) {
            const elapsedTime = performance.now() * 0.001; // Convert to seconds
            this.circles.forEach((circle)=>{
                if (circle.material.uniforms) {
                    circle.material.uniforms.uTime.value = elapsedTime;
                    circle.material.uniforms.uCameraPosition.value.copy(this.camera.position);
                }
            });
        }
        this.renderer.render(this.scene, this.camera);
        if (!this.guiParams.isRunning) return;
        const delta = this.clock.getDelta();
        for(let i = 0; i < 3; i++){
            if (!this.bubble_active[i]) continue;
            const duration = this.bubble_durations[i];
            let newTime = this.bubble_times[i] + delta;
            if (newTime >= duration) {
                newTime = duration;
                this.bubble_active[i] = false;
                this.textGroups[i].group.style.opacity = 0.5;
            }
            this.bubble_times[i] = newTime;
            const L = this.guiParams[`L${i + 1}`];
            const R_0 = this.guiParams.R_0;
            const R_t = calc_rt_gen(L, R_0, newTime);
            const scaledR = Math.max(0, R_t) * this.guiParams.scale_factor;
            // Update circle scale (SPHERE)
            if (this.circles[i]) this.circles[i].scale.setScalar(scaledR);
            const fixedTopY = this.positions[i].y;
            // New Center Y = Fixed Top Y - Current Radius.
            const newBubbleCenterY = fixedTopY - scaledR;
            if (this.circles[i]) this.circles[i].position.y = newBubbleCenterY;
            // update textual UI
            if (this.textGroups && this.textGroups[i]) {
                this.textGroups[i].time.textContent = `t: ${newTime.toFixed(3)} s`;
                this.textGroups[i].R.textContent = `R(t): ${(R_t * 100).toFixed(2)} cm`;
            }
        }
        if (this.bubble_active.every((a)=>!a)) {
            this.guiParams.isRunning = false;
            this.clock.stop();
        }
    }
}
document.addEventListener("DOMContentLoaded", ()=>{
    try {
        // Ensure the container is ready before initializing the scene
        new DeflatingBubbleScene("scene-container");
    } catch (e) {
        console.error("Failed to initialize DeflatingBubbleScene:", e);
    }
});

},{"three":"dsoTF","lil-gui":"2PiUT","three/examples/jsm/controls/OrbitControls.js":"45ipX","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["6yeij","5AXzI"], "5AXzI", "parcelRequire0087", {})

//# sourceMappingURL=bubble_simulation.09f8ce34.js.map
