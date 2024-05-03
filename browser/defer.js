'use strict';

/* minilib */
const _ = _ => document.createElement(_);
const $ = _ => document.getElementById(_);

const ChromeCall = fn => (...a) => new Promise((ok,ko) => fn(...a, r => { const e=chrome.runtime.lastError; if (e) ko(e); else ok(r); }));
const SEND = ChromeCall(chrome.runtime.sendMessage);    // Documentation says, MF3 returns a Promise.  Wrong, need to create one myself!

// asynchronously call Main('name',debug).main() class when DOM is ready so far.
setTimeout(data => new Main(data?.main || 'main', parseInt(data?.debug) || 0).main(), 0, document.currentScript?.data)

