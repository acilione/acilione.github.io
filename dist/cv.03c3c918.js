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
})({"53GKw":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "90e9e86d03c3c918";
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

},{}],"eYQYK":[function(require,module,exports,__globalThis) {
var _marked = require("marked");
let cvMd = `# Antonino Cilione
**Big Data Engineer**
Reggio Calabria, Italy | (+39) 347-252-7757
antoninocilione96@gmail.com | linkedin.com/in/antonino-cilione-1258291a6 | github.com/acilione | acilione.github.io

### Professional Summary
Big Data Engineer with extensive experience in designing scalable ETL pipelines and microservices. Proven track record in migrating legacy frameworks to modern cloud architectures and optimizing database performance. Specializes in the ingestion and processing of critical energy grid data, utilizing the Hadoop ecosystem (Spark, Kafka) and Cloud technologies.

---

### Work History

**Big Data Engineer** | **Enel** | *Jul 2022 \u{2013} Present*
* **Primary Responsibility:** Engineered and maintained high-throughput data pipelines specifically for the **ingestion of medium and low voltage measurements**, ensuring data accuracy and real-time availability for grid analysis.
* **Framework Migration:** Led the complex framework migration from Cloudera Distribution Hadoop (CDH) to **Cloudera Data Platform (CDP)**, modernizing the data infrastructure.
* **ETL Development:** Developed and maintained high-performance ETL pipelines using **Apache Spark** and **Kafka**.
* **R&D & Optimization:** Researched and benchmarked **Apache Iceberg** functionalities using Spark and Flink; successfully implemented a custom "equality delete files" commit feature on Apache Spark.
* **Data Ingestion:** Designed and implemented robust data ingestion flows using **Apache NiFi**.
* **Database Management:** Optimized **MongoDB Atlas** clusters by tuning indexes, memory, and configuring auto-scaling to balance cost and performance.
* **Microservices:** Developed **Java/Kotlin microservices** (Spring Boot) to expose NoSQL data stored on MongoDB to downstream applications.
* **Automation:** Authored **Python scripts** for advanced S3 Parquet file operations (merge, deduplicate, backup, restore) and **Bash scripts** for automated Kafka/S3 status checks.
* **Performance Tuning:** Integrated **Redis cache** (Redisson) within Spark jobs to reduce latency.
* **Codebase Evolution:** Developed complex SQL procedures for data analysis and executed significant codebase refactoring.
* *Tech Stack:* Kubernetes, Docker, Git, Dremio.

**Android Developer** | **Iriscube Reply** | *Feb 2022 \u{2013} Jul 2022*
* Developed and maintained a corporate Android banking application.
* Migrated the codebase from **Java** to **Kotlin**.
* Implemented new user-facing features and performed critical bug fixing to ensure app stability.

---

### Education

**B.Eng. in Software Engineering** | **University of Catania** | *Oct 2018 \u{2013} Mar 2022*
* **Thesis:** *Implementation of learning algorithms on microcontrollers.* Developed a Human Activity Recognition (HAR) model on an STM microcontroller using **TFLite**.

---

### Skills

* **Data Technologies:** Apache Spark, Kafka, MongoDB Atlas, Apache NiFi, Redis, Dremio.
* **Programming:** Java, Go, Kotlin, Python, Scala, C, SQL, Bash, TypeScript, C#.
* **Frontend & Graphics:** React, Three.js, Unity.
* **Frameworks and Libraries:** Spring Boot, React, TensorFlow Lite (TFLite).
* **Cloud & DevOps:** Kubernetes, Docker, AWS (S3), Git.
* **Languages:** English (Proficient), Italian (Native).

---

### Side Projects

**Physics Simulations**
* Implemented complex physics papers using **Three.js** to create realistic browser-based visualizations.
* **Simulations developed:**
    * *Heron's Fountain:* A fluid dynamics simulation demonstrating pneumatic and hydraulic pressure.
    * *Unblowing bubbles: Understanding the physics of bubble deflation through a straw:* A simulation modeling surface tension and air pressure dynamics.
    * *Boyle's Perpetual Movement Flask:* (In Progress) A simulation of the classic hydrostatic paradox.

**Videogames & Interactive Media**
* **Greta's Adventures:** Developed a full platform video game using **Unity** and **C#** (Awarded First Prize at University of Catania's Game Jam).
* **Interactive Physics Lab:** Developing a fully interactive virtual physics laboratory using **React**, **TypeScript**, and **Three.js** (In Progress).

**Other Engineering Projects**
* **Computer Vision App:** Created an Android application enabling 3D model manipulation via computer vision using hand gestures.
* **C Standard Library:** Re-implemented portions of the C Standard Library to deepen understanding of low-level memory management.

---

### Certifications

* **Coursera:** The Data Scientist\u{2019}s Toolbox - Johns Hopkins University
* **Coursera:** Algorithm Toolbox - UC San Diego
* **Coursera:** Improving Deep Neural Networks - DeepLearning.AI
* **Coursera:** Getting and Cleaning Data - Johns Hopkins University
* **Cambridge English:** First (FCE)
`;
document.getElementById("cv-content").innerHTML = (0, _marked.marked).parse(cvMd);

},{"marked":"fSyEy"}],"fSyEy":[function(require,module,exports,__globalThis) {
/**
 * marked v16.4.1 - a markdown parser
 * Copyright (c) 2011-2025, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */ /**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */ (function(g, f) {
    module.exports = f();
})(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this, function() {
    var exports = {};
    var __exports = exports;
    var module1 = {
        exports
    };
    "use strict";
    var G = Object.defineProperty;
    var Re = Object.getOwnPropertyDescriptor;
    var Te = Object.getOwnPropertyNames;
    var Oe = Object.prototype.hasOwnProperty;
    var we = (l, e)=>{
        for(var t in e)G(l, t, {
            get: e[t],
            enumerable: !0
        });
    }, ye = (l, e, t, n)=>{
        if (e && typeof e == "object" || typeof e == "function") for (let r of Te(e))!Oe.call(l, r) && r !== t && G(l, r, {
            get: ()=>e[r],
            enumerable: !(n = Re(e, r)) || n.enumerable
        });
        return l;
    };
    var Pe = (l)=>ye(G({}, "__esModule", {
            value: !0
        }), l);
    var kt = {};
    we(kt, {
        Hooks: ()=>S,
        Lexer: ()=>x,
        Marked: ()=>A,
        Parser: ()=>b,
        Renderer: ()=>P,
        TextRenderer: ()=>$,
        Tokenizer: ()=>y,
        defaults: ()=>T,
        getDefaults: ()=>_,
        lexer: ()=>dt,
        marked: ()=>k,
        options: ()=>ot,
        parse: ()=>ct,
        parseInline: ()=>pt,
        parser: ()=>ht,
        setOptions: ()=>at,
        use: ()=>lt,
        walkTokens: ()=>ut
    });
    module1.exports = Pe(kt);
    function _() {
        return {
            async: !1,
            breaks: !1,
            extensions: null,
            gfm: !0,
            hooks: null,
            pedantic: !1,
            renderer: null,
            silent: !1,
            tokenizer: null,
            walkTokens: null
        };
    }
    var T = _();
    function N(l) {
        T = l;
    }
    var E = {
        exec: ()=>null
    };
    function h(l, e = "") {
        let t = typeof l == "string" ? l : l.source, n = {
            replace: (r, i)=>{
                let s = typeof i == "string" ? i : i.source;
                return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
            },
            getRegex: ()=>new RegExp(t, e)
        };
        return n;
    }
    var m = {
        codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
        outputLinkReplace: /\\([\[\]])/g,
        indentCodeCompensation: /^(\s+)(?:```)/,
        beginningSpace: /^\s+/,
        endingHash: /#$/,
        startingSpaceChar: /^ /,
        endingSpaceChar: / $/,
        nonSpaceChar: /[^ ]/,
        newLineCharGlobal: /\n/g,
        tabCharGlobal: /\t/g,
        multipleSpaceGlobal: /\s+/g,
        blankLine: /^[ \t]*$/,
        doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
        blockquoteStart: /^ {0,3}>/,
        blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
        blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
        listReplaceTabs: /^\t+/,
        listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
        listIsTask: /^\[[ xX]\] /,
        listReplaceTask: /^\[[ xX]\] +/,
        anyLine: /\n.*\n/,
        hrefBrackets: /^<(.*)>$/,
        tableDelimiter: /[:|]/,
        tableAlignChars: /^\||\| *$/g,
        tableRowBlankLine: /\n[ \t]*$/,
        tableAlignRight: /^ *-+: *$/,
        tableAlignCenter: /^ *:-+: *$/,
        tableAlignLeft: /^ *:-+ *$/,
        startATag: /^<a /i,
        endATag: /^<\/a>/i,
        startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
        endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
        startAngleBracket: /^</,
        endAngleBracket: />$/,
        pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
        unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
        escapeTest: /[&<>"']/,
        escapeReplace: /[&<>"']/g,
        escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
        escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
        unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
        caret: /(^|[^\[])\^/g,
        percentDecode: /%25/g,
        findPipe: /\|/g,
        splitPipe: / \|/,
        slashPipe: /\\\|/g,
        carriageReturn: /\r\n|\r/g,
        spaceLine: /^ +$/gm,
        notSpaceStart: /^\S*/,
        endingNewline: /\n$/,
        listItemRegex: (l)=>new RegExp(`^( {0,3}${l})((?:[	 ][^\\n]*)?(?:\\n|$))`),
        nextBulletRegex: (l)=>new RegExp(`^ {0,${Math.min(3, l - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
        hrRegex: (l)=>new RegExp(`^ {0,${Math.min(3, l - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
        fencesBeginRegex: (l)=>new RegExp(`^ {0,${Math.min(3, l - 1)}}(?:\`\`\`|~~~)`),
        headingBeginRegex: (l)=>new RegExp(`^ {0,${Math.min(3, l - 1)}}#`),
        htmlBeginRegex: (l)=>new RegExp(`^ {0,${Math.min(3, l - 1)}}<(?:[a-z].*>|!--)`, "i")
    }, Se = /^(?:[ \t]*(?:\n|$))+/, $e = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, _e = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, C = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Le = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, j = /(?:[*+-]|\d{1,9}[.)])/, oe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ae = h(oe).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Me = h(oe).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Q = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, ze = /^[^\n]+/, U = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ae = h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", U).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ie = h(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, j).getRegex(), v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", K = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ee = h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", K).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), le = h(Q).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(), Ce = h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", le).getRegex(), W = {
        blockquote: Ce,
        code: $e,
        def: Ae,
        fences: _e,
        heading: Le,
        hr: C,
        html: Ee,
        lheading: ae,
        list: Ie,
        newline: Se,
        paragraph: le,
        table: E,
        text: ze
    }, se = h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(), Be = {
        ...W,
        lheading: Me,
        table: se,
        paragraph: h(Q).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex()
    }, qe = {
        ...W,
        html: h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", K).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: E,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: h(Q).replace("hr", C).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ae).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
    }, ve = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, De = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ue = /^( {2,}|\\)\n(?!\s*$)/, He = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, D = /[\p{P}\p{S}]/u, X = /[\s\p{P}\p{S}]/u, pe = /[^\s\p{P}\p{S}]/u, Ze = h(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, X).getRegex(), ce = /(?!~)[\p{P}\p{S}]/u, Ge = /(?!~)[\s\p{P}\p{S}]/u, Ne = /(?:[^\s\p{P}\p{S}]|~)/u, Fe = h(/link|code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<!`)(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("code", /(?<!`)(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), he = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, je = h(he, "u").replace(/punct/g, D).getRegex(), Qe = h(he, "u").replace(/punct/g, ce).getRegex(), de = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Ue = h(de, "gu").replace(/notPunctSpace/g, pe).replace(/punctSpace/g, X).replace(/punct/g, D).getRegex(), Ke = h(de, "gu").replace(/notPunctSpace/g, Ne).replace(/punctSpace/g, Ge).replace(/punct/g, ce).getRegex(), We = h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, pe).replace(/punctSpace/g, X).replace(/punct/g, D).getRegex(), Xe = h(/\\(punct)/, "gu").replace(/punct/g, D).getRegex(), Je = h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ve = h(K).replace("(?:-->|$)", "-->").getRegex(), Ye = h("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Ve).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, et = h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ke = h(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", U).getRegex(), ge = h(/^!?\[(ref)\](?:\[\])?/).replace("ref", U).getRegex(), tt = h("reflink|nolink(?!\\()", "g").replace("reflink", ke).replace("nolink", ge).getRegex(), ie = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, J = {
        _backpedal: E,
        anyPunctuation: Xe,
        autolink: Je,
        blockSkip: Fe,
        br: ue,
        code: De,
        del: E,
        emStrongLDelim: je,
        emStrongRDelimAst: Ue,
        emStrongRDelimUnd: We,
        escape: ve,
        link: et,
        nolink: ge,
        punctuation: Ze,
        reflink: ke,
        reflinkSearch: tt,
        tag: Ye,
        text: He,
        url: E
    }, nt = {
        ...J,
        link: h(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(),
        reflink: h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex()
    }, F = {
        ...J,
        emStrongRDelimAst: Ke,
        emStrongLDelim: Qe,
        url: h(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ie).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
        _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
        text: h(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ie).getRegex()
    }, rt = {
        ...F,
        br: h(ue).replace("{2,}", "*").getRegex(),
        text: h(F.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    }, B = {
        normal: W,
        gfm: Be,
        pedantic: qe
    }, M = {
        normal: J,
        gfm: F,
        breaks: rt,
        pedantic: nt
    };
    var st = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }, fe = (l)=>st[l];
    function w(l, e) {
        if (e) {
            if (m.escapeTest.test(l)) return l.replace(m.escapeReplace, fe);
        } else if (m.escapeTestNoEncode.test(l)) return l.replace(m.escapeReplaceNoEncode, fe);
        return l;
    }
    function V(l) {
        try {
            l = encodeURI(l).replace(m.percentDecode, "%");
        } catch  {
            return null;
        }
        return l;
    }
    function Y(l, e) {
        let t = l.replace(m.findPipe, (i, s, o)=>{
            let a = !1, u = s;
            for(; --u >= 0 && o[u] === "\\";)a = !a;
            return a ? "|" : " |";
        }), n = t.split(m.splitPipe), r = 0;
        if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) {
            if (n.length > e) n.splice(e);
            else for(; n.length < e;)n.push("");
        }
        for(; r < n.length; r++)n[r] = n[r].trim().replace(m.slashPipe, "|");
        return n;
    }
    function z(l, e, t) {
        let n = l.length;
        if (n === 0) return "";
        let r = 0;
        for(; r < n;){
            let i = l.charAt(n - r - 1);
            if (i === e && !t) r++;
            else if (i !== e && t) r++;
            else break;
        }
        return l.slice(0, n - r);
    }
    function me(l, e) {
        if (l.indexOf(e[1]) === -1) return -1;
        let t = 0;
        for(let n = 0; n < l.length; n++)if (l[n] === "\\") n++;
        else if (l[n] === e[0]) t++;
        else if (l[n] === e[1] && (t--, t < 0)) return n;
        return t > 0 ? -2 : -1;
    }
    function xe(l, e, t, n, r) {
        let i = e.href, s = e.title || null, o = l[1].replace(r.other.outputLinkReplace, "$1");
        n.state.inLink = !0;
        let a = {
            type: l[0].charAt(0) === "!" ? "image" : "link",
            raw: t,
            href: i,
            title: s,
            text: o,
            tokens: n.inlineTokens(o)
        };
        return n.state.inLink = !1, a;
    }
    function it(l, e, t) {
        let n = l.match(t.other.indentCodeCompensation);
        if (n === null) return e;
        let r = n[1];
        return e.split(`
`).map((i)=>{
            let s = i.match(t.other.beginningSpace);
            if (s === null) return i;
            let [o] = s;
            return o.length >= r.length ? i.slice(r.length) : i;
        }).join(`
`);
    }
    var y = class {
        options;
        rules;
        lexer;
        constructor(e){
            this.options = e || T;
        }
        space(e) {
            let t = this.rules.block.newline.exec(e);
            if (t && t[0].length > 0) return {
                type: "space",
                raw: t[0]
            };
        }
        code(e) {
            let t = this.rules.block.code.exec(e);
            if (t) {
                let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
                return {
                    type: "code",
                    raw: t[0],
                    codeBlockStyle: "indented",
                    text: this.options.pedantic ? n : z(n, `
`)
                };
            }
        }
        fences(e) {
            let t = this.rules.block.fences.exec(e);
            if (t) {
                let n = t[0], r = it(n, t[3] || "", this.rules);
                return {
                    type: "code",
                    raw: n,
                    lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
                    text: r
                };
            }
        }
        heading(e) {
            let t = this.rules.block.heading.exec(e);
            if (t) {
                let n = t[2].trim();
                if (this.rules.other.endingHash.test(n)) {
                    let r = z(n, "#");
                    (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
                }
                return {
                    type: "heading",
                    raw: t[0],
                    depth: t[1].length,
                    text: n,
                    tokens: this.lexer.inline(n)
                };
            }
        }
        hr(e) {
            let t = this.rules.block.hr.exec(e);
            if (t) return {
                type: "hr",
                raw: z(t[0], `
`)
            };
        }
        blockquote(e) {
            let t = this.rules.block.blockquote.exec(e);
            if (t) {
                let n = z(t[0], `
`).split(`
`), r = "", i = "", s = [];
                for(; n.length > 0;){
                    let o = !1, a = [], u;
                    for(u = 0; u < n.length; u++)if (this.rules.other.blockquoteStart.test(n[u])) a.push(n[u]), o = !0;
                    else if (!o) a.push(n[u]);
                    else break;
                    n = n.slice(u);
                    let c = a.join(`
`), p = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
                    r = r ? `${r}
${c}` : c, i = i ? `${i}
${p}` : p;
                    let g = this.lexer.state.top;
                    if (this.lexer.state.top = !0, this.lexer.blockTokens(p, s, !0), this.lexer.state.top = g, n.length === 0) break;
                    let d = s.at(-1);
                    if (d?.type === "code") break;
                    if (d?.type === "blockquote") {
                        let R = d, f = R.raw + `
` + n.join(`
`), O = this.blockquote(f);
                        s[s.length - 1] = O, r = r.substring(0, r.length - R.raw.length) + O.raw, i = i.substring(0, i.length - R.text.length) + O.text;
                        break;
                    } else if (d?.type === "list") {
                        let R = d, f = R.raw + `
` + n.join(`
`), O = this.list(f);
                        s[s.length - 1] = O, r = r.substring(0, r.length - d.raw.length) + O.raw, i = i.substring(0, i.length - R.raw.length) + O.raw, n = f.substring(s.at(-1).raw.length).split(`
`);
                        continue;
                    }
                }
                return {
                    type: "blockquote",
                    raw: r,
                    tokens: s,
                    text: i
                };
            }
        }
        list(e) {
            let t = this.rules.block.list.exec(e);
            if (t) {
                let n = t[1].trim(), r = n.length > 1, i = {
                    type: "list",
                    raw: "",
                    ordered: r,
                    start: r ? +n.slice(0, -1) : "",
                    loose: !1,
                    items: []
                };
                n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
                let s = this.rules.other.listItemRegex(n), o = !1;
                for(; e;){
                    let u = !1, c = "", p = "";
                    if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
                    c = t[0], e = e.substring(c.length);
                    let g = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (H)=>" ".repeat(3 * H.length)), d = e.split(`
`, 1)[0], R = !g.trim(), f = 0;
                    if (this.options.pedantic ? (f = 2, p = g.trimStart()) : R ? f = t[1].length + 1 : (f = t[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, p = g.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(d) && (c += d + `
`, e = e.substring(d.length + 1), u = !0), !u) {
                        let H = this.rules.other.nextBulletRegex(f), te = this.rules.other.hrRegex(f), ne = this.rules.other.fencesBeginRegex(f), re = this.rules.other.headingBeginRegex(f), be = this.rules.other.htmlBeginRegex(f);
                        for(; e;){
                            let Z = e.split(`
`, 1)[0], I;
                            if (d = Z, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), I = d) : I = d.replace(this.rules.other.tabCharGlobal, "    "), ne.test(d) || re.test(d) || be.test(d) || H.test(d) || te.test(d)) break;
                            if (I.search(this.rules.other.nonSpaceChar) >= f || !d.trim()) p += `
` + I.slice(f);
                            else {
                                if (R || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ne.test(g) || re.test(g) || te.test(g)) break;
                                p += `
` + d;
                            }
                            !R && !d.trim() && (R = !0), c += Z + `
`, e = e.substring(Z.length + 1), g = I.slice(f);
                        }
                    }
                    i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (o = !0));
                    let O = null, ee;
                    this.options.gfm && (O = this.rules.other.listIsTask.exec(p), O && (ee = O[0] !== "[ ] ", p = p.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
                        type: "list_item",
                        raw: c,
                        task: !!O,
                        checked: ee,
                        loose: !1,
                        text: p,
                        tokens: []
                    }), i.raw += c;
                }
                let a = i.items.at(-1);
                if (a) a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
                else return;
                i.raw = i.raw.trimEnd();
                for(let u = 0; u < i.items.length; u++)if (this.lexer.state.top = !1, i.items[u].tokens = this.lexer.blockTokens(i.items[u].text, []), !i.loose) {
                    let c = i.items[u].tokens.filter((g)=>g.type === "space"), p = c.length > 0 && c.some((g)=>this.rules.other.anyLine.test(g.raw));
                    i.loose = p;
                }
                if (i.loose) for(let u = 0; u < i.items.length; u++)i.items[u].loose = !0;
                return i;
            }
        }
        html(e) {
            let t = this.rules.block.html.exec(e);
            if (t) return {
                type: "html",
                block: !0,
                raw: t[0],
                pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
                text: t[0]
            };
        }
        def(e) {
            let t = this.rules.block.def.exec(e);
            if (t) {
                let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
                return {
                    type: "def",
                    tag: n,
                    raw: t[0],
                    href: r,
                    title: i
                };
            }
        }
        table(e) {
            let t = this.rules.block.table.exec(e);
            if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
            let n = Y(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = {
                type: "table",
                raw: t[0],
                header: [],
                align: [],
                rows: []
            };
            if (n.length === r.length) {
                for (let o of r)this.rules.other.tableAlignRight.test(o) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? s.align.push("left") : s.align.push(null);
                for(let o = 0; o < n.length; o++)s.header.push({
                    text: n[o],
                    tokens: this.lexer.inline(n[o]),
                    header: !0,
                    align: s.align[o]
                });
                for (let o of i)s.rows.push(Y(o, s.header.length).map((a, u)=>({
                        text: a,
                        tokens: this.lexer.inline(a),
                        header: !1,
                        align: s.align[u]
                    })));
                return s;
            }
        }
        lheading(e) {
            let t = this.rules.block.lheading.exec(e);
            if (t) return {
                type: "heading",
                raw: t[0],
                depth: t[2].charAt(0) === "=" ? 1 : 2,
                text: t[1],
                tokens: this.lexer.inline(t[1])
            };
        }
        paragraph(e) {
            let t = this.rules.block.paragraph.exec(e);
            if (t) {
                let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
                return {
                    type: "paragraph",
                    raw: t[0],
                    text: n,
                    tokens: this.lexer.inline(n)
                };
            }
        }
        text(e) {
            let t = this.rules.block.text.exec(e);
            if (t) return {
                type: "text",
                raw: t[0],
                text: t[0],
                tokens: this.lexer.inline(t[0])
            };
        }
        escape(e) {
            let t = this.rules.inline.escape.exec(e);
            if (t) return {
                type: "escape",
                raw: t[0],
                text: t[1]
            };
        }
        tag(e) {
            let t = this.rules.inline.tag.exec(e);
            if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
                type: "html",
                raw: t[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: !1,
                text: t[0]
            };
        }
        link(e) {
            let t = this.rules.inline.link.exec(e);
            if (t) {
                let n = t[2].trim();
                if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
                    if (!this.rules.other.endAngleBracket.test(n)) return;
                    let s = z(n.slice(0, -1), "\\");
                    if ((n.length - s.length) % 2 === 0) return;
                } else {
                    let s = me(t[2], "()");
                    if (s === -2) return;
                    if (s > -1) {
                        let a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
                        t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, a).trim(), t[3] = "";
                    }
                }
                let r = t[2], i = "";
                if (this.options.pedantic) {
                    let s = this.rules.other.pedanticHrefTitle.exec(r);
                    s && (r = s[1], i = s[3]);
                } else i = t[3] ? t[3].slice(1, -1) : "";
                return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), xe(t, {
                    href: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
                    title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
                }, t[0], this.lexer, this.rules);
            }
        }
        reflink(e, t) {
            let n;
            if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
                let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
                if (!i) {
                    let s = n[0].charAt(0);
                    return {
                        type: "text",
                        raw: s,
                        text: s
                    };
                }
                return xe(n, i, n[0], this.lexer, this.rules);
            }
        }
        emStrong(e, t, n = "") {
            let r = this.rules.inline.emStrongLDelim.exec(e);
            if (!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
            if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
                let s = [
                    ...r[0]
                ].length - 1, o, a, u = s, c = 0, p = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
                for(p.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = p.exec(t)) != null;){
                    if (o = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !o) continue;
                    if (a = [
                        ...o
                    ].length, r[3] || r[4]) {
                        u += a;
                        continue;
                    } else if ((r[5] || r[6]) && s % 3 && !((s + a) % 3)) {
                        c += a;
                        continue;
                    }
                    if (u -= a, u > 0) continue;
                    a = Math.min(a, a + u + c);
                    let g = [
                        ...r[0]
                    ][0].length, d = e.slice(0, s + r.index + g + a);
                    if (Math.min(s, a) % 2) {
                        let f = d.slice(1, -1);
                        return {
                            type: "em",
                            raw: d,
                            text: f,
                            tokens: this.lexer.inlineTokens(f)
                        };
                    }
                    let R = d.slice(2, -2);
                    return {
                        type: "strong",
                        raw: d,
                        text: R,
                        tokens: this.lexer.inlineTokens(R)
                    };
                }
            }
        }
        codespan(e) {
            let t = this.rules.inline.code.exec(e);
            if (t) {
                let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
                return r && i && (n = n.substring(1, n.length - 1)), {
                    type: "codespan",
                    raw: t[0],
                    text: n
                };
            }
        }
        br(e) {
            let t = this.rules.inline.br.exec(e);
            if (t) return {
                type: "br",
                raw: t[0]
            };
        }
        del(e) {
            let t = this.rules.inline.del.exec(e);
            if (t) return {
                type: "del",
                raw: t[0],
                text: t[2],
                tokens: this.lexer.inlineTokens(t[2])
            };
        }
        autolink(e) {
            let t = this.rules.inline.autolink.exec(e);
            if (t) {
                let n, r;
                return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), {
                    type: "link",
                    raw: t[0],
                    text: n,
                    href: r,
                    tokens: [
                        {
                            type: "text",
                            raw: n,
                            text: n
                        }
                    ]
                };
            }
        }
        url(e) {
            let t;
            if (t = this.rules.inline.url.exec(e)) {
                let n, r;
                if (t[2] === "@") n = t[0], r = "mailto:" + n;
                else {
                    let i;
                    do i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
                    while (i !== t[0]);
                    n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
                }
                return {
                    type: "link",
                    raw: t[0],
                    text: n,
                    href: r,
                    tokens: [
                        {
                            type: "text",
                            raw: n,
                            text: n
                        }
                    ]
                };
            }
        }
        inlineText(e) {
            let t = this.rules.inline.text.exec(e);
            if (t) {
                let n = this.lexer.state.inRawBlock;
                return {
                    type: "text",
                    raw: t[0],
                    text: t[0],
                    escaped: n
                };
            }
        }
    };
    var x = class l {
        tokens;
        options;
        state;
        tokenizer;
        inlineQueue;
        constructor(e){
            this.tokens = [], this.tokens.links = Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new y, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
                inLink: !1,
                inRawBlock: !1,
                top: !0
            };
            let t = {
                other: m,
                block: B.normal,
                inline: M.normal
            };
            this.options.pedantic ? (t.block = B.pedantic, t.inline = M.pedantic) : this.options.gfm && (t.block = B.gfm, this.options.breaks ? t.inline = M.breaks : t.inline = M.gfm), this.tokenizer.rules = t;
        }
        static get rules() {
            return {
                block: B,
                inline: M
            };
        }
        static lex(e, t) {
            return new l(t).lex(e);
        }
        static lexInline(e, t) {
            return new l(t).inlineTokens(e);
        }
        lex(e) {
            e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
            for(let t = 0; t < this.inlineQueue.length; t++){
                let n = this.inlineQueue[t];
                this.inlineTokens(n.src, n.tokens);
            }
            return this.inlineQueue = [], this.tokens;
        }
        blockTokens(e, t = [], n = !1) {
            for(this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e;){
                let r;
                if (this.options.extensions?.block?.some((s)=>(r = s.call({
                        lexer: this
                    }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
                if (r = this.tokenizer.space(e)) {
                    e = e.substring(r.raw.length);
                    let s = t.at(-1);
                    r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
                    continue;
                }
                if (r = this.tokenizer.code(e)) {
                    e = e.substring(r.raw.length);
                    let s = t.at(-1);
                    s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
                    continue;
                }
                if (r = this.tokenizer.fences(e)) {
                    e = e.substring(r.raw.length), t.push(r);
                    continue;
                }
                if (r = this.tokenizer.heading(e)) {
                    e = e.substring(r.raw.length), t.push(r);
                    continue;
                }
                if (r = this.tokenizer.hr(e)) {
                    e = e.substring(r.raw.length), t.push(r);
                    continue;
                }
                if (r = this.tokenizer.blockquote(e)) {
                    e = e.substring(r.raw.length), t.push(r);
                    continue;
                }
                if (r = this.tokenizer.list(e)) {
                    e = e.substring(r.raw.length), t.push(r);
                    continue;
                }
                if (r = this.tokenizer.html(e)) {
                    e = e.substring(r.raw.length), t.push(r);
                    continue;
                }
                if (r = this.tokenizer.def(e)) {
                    e = e.substring(r.raw.length);
                    let s = t.at(-1);
                    s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
                        href: r.href,
                        title: r.title
                    }, t.push(r));
                    continue;
                }
                if (r = this.tokenizer.table(e)) {
                    e = e.substring(r.raw.length), t.push(r);
                    continue;
                }
                if (r = this.tokenizer.lheading(e)) {
                    e = e.substring(r.raw.length), t.push(r);
                    continue;
                }
                let i = e;
                if (this.options.extensions?.startBlock) {
                    let s = 1 / 0, o = e.slice(1), a;
                    this.options.extensions.startBlock.forEach((u)=>{
                        a = u.call({
                            lexer: this
                        }, o), typeof a == "number" && a >= 0 && (s = Math.min(s, a));
                    }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
                }
                if (this.state.top && (r = this.tokenizer.paragraph(i))) {
                    let s = t.at(-1);
                    n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
                    continue;
                }
                if (r = this.tokenizer.text(e)) {
                    e = e.substring(r.raw.length);
                    let s = t.at(-1);
                    s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
                    continue;
                }
                if (e) {
                    let s = "Infinite loop on byte: " + e.charCodeAt(0);
                    if (this.options.silent) {
                        console.error(s);
                        break;
                    } else throw new Error(s);
                }
            }
            return this.state.top = !0, t;
        }
        inline(e, t = []) {
            return this.inlineQueue.push({
                src: e,
                tokens: t
            }), t;
        }
        inlineTokens(e, t = []) {
            let n = e, r = null;
            if (this.tokens.links) {
                let o = Object.keys(this.tokens.links);
                if (o.length > 0) for(; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null;)o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
            }
            for(; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null;)n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
            for(; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null;)n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
            n = this.options.hooks?.emStrongMask?.call({
                lexer: this
            }, n) ?? n;
            let i = !1, s = "";
            for(; e;){
                i || (s = ""), i = !1;
                let o;
                if (this.options.extensions?.inline?.some((u)=>(o = u.call({
                        lexer: this
                    }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
                if (o = this.tokenizer.escape(e)) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                if (o = this.tokenizer.tag(e)) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                if (o = this.tokenizer.link(e)) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                if (o = this.tokenizer.reflink(e, this.tokens.links)) {
                    e = e.substring(o.raw.length);
                    let u = t.at(-1);
                    o.type === "text" && u?.type === "text" ? (u.raw += o.raw, u.text += o.text) : t.push(o);
                    continue;
                }
                if (o = this.tokenizer.emStrong(e, n, s)) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                if (o = this.tokenizer.codespan(e)) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                if (o = this.tokenizer.br(e)) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                if (o = this.tokenizer.del(e)) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                if (o = this.tokenizer.autolink(e)) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                if (!this.state.inLink && (o = this.tokenizer.url(e))) {
                    e = e.substring(o.raw.length), t.push(o);
                    continue;
                }
                let a = e;
                if (this.options.extensions?.startInline) {
                    let u = 1 / 0, c = e.slice(1), p;
                    this.options.extensions.startInline.forEach((g)=>{
                        p = g.call({
                            lexer: this
                        }, c), typeof p == "number" && p >= 0 && (u = Math.min(u, p));
                    }), u < 1 / 0 && u >= 0 && (a = e.substring(0, u + 1));
                }
                if (o = this.tokenizer.inlineText(a)) {
                    e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (s = o.raw.slice(-1)), i = !0;
                    let u = t.at(-1);
                    u?.type === "text" ? (u.raw += o.raw, u.text += o.text) : t.push(o);
                    continue;
                }
                if (e) {
                    let u = "Infinite loop on byte: " + e.charCodeAt(0);
                    if (this.options.silent) {
                        console.error(u);
                        break;
                    } else throw new Error(u);
                }
            }
            return t;
        }
    };
    var P = class {
        options;
        parser;
        constructor(e){
            this.options = e || T;
        }
        space(e) {
            return "";
        }
        code({ text: e, lang: t, escaped: n }) {
            let r = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
            return r ? '<pre><code class="language-' + w(r) + '">' + (n ? i : w(i, !0)) + `</code></pre>
` : "<pre><code>" + (n ? i : w(i, !0)) + `</code></pre>
`;
        }
        blockquote({ tokens: e }) {
            return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
        }
        html({ text: e }) {
            return e;
        }
        def(e) {
            return "";
        }
        heading({ tokens: e, depth: t }) {
            return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
        }
        hr(e) {
            return `<hr>
`;
        }
        list(e) {
            let t = e.ordered, n = e.start, r = "";
            for(let o = 0; o < e.items.length; o++){
                let a = e.items[o];
                r += this.listitem(a);
            }
            let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
            return "<" + i + s + `>
` + r + "</" + i + `>
`;
        }
        listitem(e) {
            let t = "";
            if (e.task) {
                let n = this.checkbox({
                    checked: !!e.checked
                });
                e.loose ? e.tokens[0]?.type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + w(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = !0)) : e.tokens.unshift({
                    type: "text",
                    raw: n + " ",
                    text: n + " ",
                    escaped: !0
                }) : t += n + " ";
            }
            return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
        }
        checkbox({ checked: e }) {
            return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
        }
        paragraph({ tokens: e }) {
            return `<p>${this.parser.parseInline(e)}</p>
`;
        }
        table(e) {
            let t = "", n = "";
            for(let i = 0; i < e.header.length; i++)n += this.tablecell(e.header[i]);
            t += this.tablerow({
                text: n
            });
            let r = "";
            for(let i = 0; i < e.rows.length; i++){
                let s = e.rows[i];
                n = "";
                for(let o = 0; o < s.length; o++)n += this.tablecell(s[o]);
                r += this.tablerow({
                    text: n
                });
            }
            return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
        }
        tablerow({ text: e }) {
            return `<tr>
${e}</tr>
`;
        }
        tablecell(e) {
            let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
            return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
        }
        strong({ tokens: e }) {
            return `<strong>${this.parser.parseInline(e)}</strong>`;
        }
        em({ tokens: e }) {
            return `<em>${this.parser.parseInline(e)}</em>`;
        }
        codespan({ text: e }) {
            return `<code>${w(e, !0)}</code>`;
        }
        br(e) {
            return "<br>";
        }
        del({ tokens: e }) {
            return `<del>${this.parser.parseInline(e)}</del>`;
        }
        link({ href: e, title: t, tokens: n }) {
            let r = this.parser.parseInline(n), i = V(e);
            if (i === null) return r;
            e = i;
            let s = '<a href="' + e + '"';
            return t && (s += ' title="' + w(t) + '"'), s += ">" + r + "</a>", s;
        }
        image({ href: e, title: t, text: n, tokens: r }) {
            r && (n = this.parser.parseInline(r, this.parser.textRenderer));
            let i = V(e);
            if (i === null) return w(n);
            e = i;
            let s = `<img src="${e}" alt="${n}"`;
            return t && (s += ` title="${w(t)}"`), s += ">", s;
        }
        text(e) {
            return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : w(e.text);
        }
    };
    var $ = class {
        strong({ text: e }) {
            return e;
        }
        em({ text: e }) {
            return e;
        }
        codespan({ text: e }) {
            return e;
        }
        del({ text: e }) {
            return e;
        }
        html({ text: e }) {
            return e;
        }
        text({ text: e }) {
            return e;
        }
        link({ text: e }) {
            return "" + e;
        }
        image({ text: e }) {
            return "" + e;
        }
        br() {
            return "";
        }
    };
    var b = class l {
        options;
        renderer;
        textRenderer;
        constructor(e){
            this.options = e || T, this.options.renderer = this.options.renderer || new P, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $;
        }
        static parse(e, t) {
            return new l(t).parse(e);
        }
        static parseInline(e, t) {
            return new l(t).parseInline(e);
        }
        parse(e, t = !0) {
            let n = "";
            for(let r = 0; r < e.length; r++){
                let i = e[r];
                if (this.options.extensions?.renderers?.[i.type]) {
                    let o = i, a = this.options.extensions.renderers[o.type].call({
                        parser: this
                    }, o);
                    if (a !== !1 || ![
                        "space",
                        "hr",
                        "heading",
                        "code",
                        "table",
                        "blockquote",
                        "list",
                        "html",
                        "def",
                        "paragraph",
                        "text"
                    ].includes(o.type)) {
                        n += a || "";
                        continue;
                    }
                }
                let s = i;
                switch(s.type){
                    case "space":
                        n += this.renderer.space(s);
                        continue;
                    case "hr":
                        n += this.renderer.hr(s);
                        continue;
                    case "heading":
                        n += this.renderer.heading(s);
                        continue;
                    case "code":
                        n += this.renderer.code(s);
                        continue;
                    case "table":
                        n += this.renderer.table(s);
                        continue;
                    case "blockquote":
                        n += this.renderer.blockquote(s);
                        continue;
                    case "list":
                        n += this.renderer.list(s);
                        continue;
                    case "html":
                        n += this.renderer.html(s);
                        continue;
                    case "def":
                        n += this.renderer.def(s);
                        continue;
                    case "paragraph":
                        n += this.renderer.paragraph(s);
                        continue;
                    case "text":
                        {
                            let o = s, a = this.renderer.text(o);
                            for(; r + 1 < e.length && e[r + 1].type === "text";)o = e[++r], a += `
` + this.renderer.text(o);
                            t ? n += this.renderer.paragraph({
                                type: "paragraph",
                                raw: a,
                                text: a,
                                tokens: [
                                    {
                                        type: "text",
                                        raw: a,
                                        text: a,
                                        escaped: !0
                                    }
                                ]
                            }) : n += a;
                            continue;
                        }
                    default:
                        {
                            let o = 'Token with "' + s.type + '" type was not found.';
                            if (this.options.silent) return console.error(o), "";
                            throw new Error(o);
                        }
                }
            }
            return n;
        }
        parseInline(e, t = this.renderer) {
            let n = "";
            for(let r = 0; r < e.length; r++){
                let i = e[r];
                if (this.options.extensions?.renderers?.[i.type]) {
                    let o = this.options.extensions.renderers[i.type].call({
                        parser: this
                    }, i);
                    if (o !== !1 || ![
                        "escape",
                        "html",
                        "link",
                        "image",
                        "strong",
                        "em",
                        "codespan",
                        "br",
                        "del",
                        "text"
                    ].includes(i.type)) {
                        n += o || "";
                        continue;
                    }
                }
                let s = i;
                switch(s.type){
                    case "escape":
                        n += t.text(s);
                        break;
                    case "html":
                        n += t.html(s);
                        break;
                    case "link":
                        n += t.link(s);
                        break;
                    case "image":
                        n += t.image(s);
                        break;
                    case "strong":
                        n += t.strong(s);
                        break;
                    case "em":
                        n += t.em(s);
                        break;
                    case "codespan":
                        n += t.codespan(s);
                        break;
                    case "br":
                        n += t.br(s);
                        break;
                    case "del":
                        n += t.del(s);
                        break;
                    case "text":
                        n += t.text(s);
                        break;
                    default:
                        {
                            let o = 'Token with "' + s.type + '" type was not found.';
                            if (this.options.silent) return console.error(o), "";
                            throw new Error(o);
                        }
                }
            }
            return n;
        }
    };
    var S = class {
        options;
        block;
        constructor(e){
            this.options = e || T;
        }
        static passThroughHooks = new Set([
            "preprocess",
            "postprocess",
            "processAllTokens",
            "emStrongMask"
        ]);
        static passThroughHooksRespectAsync = new Set([
            "preprocess",
            "postprocess",
            "processAllTokens"
        ]);
        preprocess(e) {
            return e;
        }
        postprocess(e) {
            return e;
        }
        processAllTokens(e) {
            return e;
        }
        emStrongMask(e) {
            return e;
        }
        provideLexer() {
            return this.block ? x.lex : x.lexInline;
        }
        provideParser() {
            return this.block ? b.parse : b.parseInline;
        }
    };
    var A = class {
        defaults = _();
        options = this.setOptions;
        parse = this.parseMarkdown(!0);
        parseInline = this.parseMarkdown(!1);
        Parser = b;
        Renderer = P;
        TextRenderer = $;
        Lexer = x;
        Tokenizer = y;
        Hooks = S;
        constructor(...e){
            this.use(...e);
        }
        walkTokens(e, t) {
            let n = [];
            for (let r of e)switch(n = n.concat(t.call(this, r)), r.type){
                case "table":
                    {
                        let i = r;
                        for (let s of i.header)n = n.concat(this.walkTokens(s.tokens, t));
                        for (let s of i.rows)for (let o of s)n = n.concat(this.walkTokens(o.tokens, t));
                        break;
                    }
                case "list":
                    {
                        let i = r;
                        n = n.concat(this.walkTokens(i.items, t));
                        break;
                    }
                default:
                    {
                        let i = r;
                        this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s)=>{
                            let o = i[s].flat(1 / 0);
                            n = n.concat(this.walkTokens(o, t));
                        }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
                    }
            }
            return n;
        }
        use(...e) {
            let t = this.defaults.extensions || {
                renderers: {},
                childTokens: {}
            };
            return e.forEach((n)=>{
                let r = {
                    ...n
                };
                if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((i)=>{
                    if (!i.name) throw new Error("extension name required");
                    if ("renderer" in i) {
                        let s = t.renderers[i.name];
                        s ? t.renderers[i.name] = function(...o) {
                            let a = i.renderer.apply(this, o);
                            return a === !1 && (a = s.apply(this, o)), a;
                        } : t.renderers[i.name] = i.renderer;
                    }
                    if ("tokenizer" in i) {
                        if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
                        let s = t[i.level];
                        s ? s.unshift(i.tokenizer) : t[i.level] = [
                            i.tokenizer
                        ], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [
                            i.start
                        ] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [
                            i.start
                        ]));
                    }
                    "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
                }), r.extensions = t), n.renderer) {
                    let i = this.defaults.renderer || new P(this.defaults);
                    for(let s in n.renderer){
                        if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
                        if ([
                            "options",
                            "parser"
                        ].includes(s)) continue;
                        let o = s, a = n.renderer[o], u = i[o];
                        i[o] = (...c)=>{
                            let p = a.apply(i, c);
                            return p === !1 && (p = u.apply(i, c)), p || "";
                        };
                    }
                    r.renderer = i;
                }
                if (n.tokenizer) {
                    let i = this.defaults.tokenizer || new y(this.defaults);
                    for(let s in n.tokenizer){
                        if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
                        if ([
                            "options",
                            "rules",
                            "lexer"
                        ].includes(s)) continue;
                        let o = s, a = n.tokenizer[o], u = i[o];
                        i[o] = (...c)=>{
                            let p = a.apply(i, c);
                            return p === !1 && (p = u.apply(i, c)), p;
                        };
                    }
                    r.tokenizer = i;
                }
                if (n.hooks) {
                    let i = this.defaults.hooks || new S;
                    for(let s in n.hooks){
                        if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
                        if ([
                            "options",
                            "block"
                        ].includes(s)) continue;
                        let o = s, a = n.hooks[o], u = i[o];
                        S.passThroughHooks.has(s) ? i[o] = (c)=>{
                            if (this.defaults.async && S.passThroughHooksRespectAsync.has(s)) return (async ()=>{
                                let g = await a.call(i, c);
                                return u.call(i, g);
                            })();
                            let p = a.call(i, c);
                            return u.call(i, p);
                        } : i[o] = (...c)=>{
                            if (this.defaults.async) return (async ()=>{
                                let g = await a.apply(i, c);
                                return g === !1 && (g = await u.apply(i, c)), g;
                            })();
                            let p = a.apply(i, c);
                            return p === !1 && (p = u.apply(i, c)), p;
                        };
                    }
                    r.hooks = i;
                }
                if (n.walkTokens) {
                    let i = this.defaults.walkTokens, s = n.walkTokens;
                    r.walkTokens = function(o) {
                        let a = [];
                        return a.push(s.call(this, o)), i && (a = a.concat(i.call(this, o))), a;
                    };
                }
                this.defaults = {
                    ...this.defaults,
                    ...r
                };
            }), this;
        }
        setOptions(e) {
            return this.defaults = {
                ...this.defaults,
                ...e
            }, this;
        }
        lexer(e, t) {
            return x.lex(e, t ?? this.defaults);
        }
        parser(e, t) {
            return b.parse(e, t ?? this.defaults);
        }
        parseMarkdown(e) {
            return (n, r)=>{
                let i = {
                    ...r
                }, s = {
                    ...this.defaults,
                    ...i
                }, o = this.onError(!!s.silent, !!s.async);
                if (this.defaults.async === !0 && i.async === !1) return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
                if (typeof n > "u" || n === null) return o(new Error("marked(): input parameter is undefined or null"));
                if (typeof n != "string") return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
                if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async) return (async ()=>{
                    let a = s.hooks ? await s.hooks.preprocess(n) : n, c = await (s.hooks ? await s.hooks.provideLexer() : e ? x.lex : x.lexInline)(a, s), p = s.hooks ? await s.hooks.processAllTokens(c) : c;
                    s.walkTokens && await Promise.all(this.walkTokens(p, s.walkTokens));
                    let d = await (s.hooks ? await s.hooks.provideParser() : e ? b.parse : b.parseInline)(p, s);
                    return s.hooks ? await s.hooks.postprocess(d) : d;
                })().catch(o);
                try {
                    s.hooks && (n = s.hooks.preprocess(n));
                    let u = (s.hooks ? s.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s);
                    s.hooks && (u = s.hooks.processAllTokens(u)), s.walkTokens && this.walkTokens(u, s.walkTokens);
                    let p = (s.hooks ? s.hooks.provideParser() : e ? b.parse : b.parseInline)(u, s);
                    return s.hooks && (p = s.hooks.postprocess(p)), p;
                } catch (a) {
                    return o(a);
                }
            };
        }
        onError(e, t) {
            return (n)=>{
                if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
                    let r = "<p>An error occurred:</p><pre>" + w(n.message + "", !0) + "</pre>";
                    return t ? Promise.resolve(r) : r;
                }
                if (t) return Promise.reject(n);
                throw n;
            };
        }
    };
    var L = new A;
    function k(l, e) {
        return L.parse(l, e);
    }
    k.options = k.setOptions = function(l) {
        return L.setOptions(l), k.defaults = L.defaults, N(k.defaults), k;
    };
    k.getDefaults = _;
    k.defaults = T;
    k.use = function(...l) {
        return L.use(...l), k.defaults = L.defaults, N(k.defaults), k;
    };
    k.walkTokens = function(l, e) {
        return L.walkTokens(l, e);
    };
    k.parseInline = L.parseInline;
    k.Parser = b;
    k.parser = b.parse;
    k.Renderer = P;
    k.TextRenderer = $;
    k.Lexer = x;
    k.lexer = x.lex;
    k.Tokenizer = y;
    k.Hooks = S;
    k.parse = k;
    var ot = k.options, at = k.setOptions, lt = k.use, ut = k.walkTokens, pt = k.parseInline, ct = k, ht = b.parse, dt = x.lex;
    if (__exports != exports) module1.exports = exports;
    return module1.exports;
});

},{}]},["53GKw","eYQYK"], "eYQYK", "parcelRequire0087", {})

//# sourceMappingURL=cv.03c3c918.js.map
