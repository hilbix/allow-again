'use strict';
// vim: ts=8

(_=>_())(async()=>{

// Luckily, FF supports global variable chrome.
// As I do not have access to Safari, I cannot tune this, sorry.
if (globalThis && !globalThis.browser) globalThis.browser	= chrome;

const MYURL	= browser.runtime.getURL('');
const V		= browser.runtime.getManifest().version;

//
// Microlib
//
const toJ	= JSON.stringify;
const isArr	= Array.isArray;
const isFun	= f => typeof f === 'function';
const isInt	= i => Number.isInteger(i);
const isObj	= o => typeof o === 'object' && (Object.getPrototypeOf(o || []) || Object.prototype) === Object.prototype;
const isStr	= s => s && s.constructor === String;
const mkArr	= x => Array.isArray(x) ? x : [x];

// {host: {scheme: {port: {path: [{perm:state},{perm:state}] }}}} path[is_prefix]
// WTF?  Documentation says it is "storage.local", not "browser.storage.local"
const XX	= 'AA';
const CFG	= (await browser.storage.local.get({[XX]:{}}))[XX];
//console.log(CFG);

const saneURL = _ =>
  {
    const	u = new URL(_);
    // Found out the hardest possible way, that URL.port is unchangable.
    // Hence new URL() is unable to retrieve the port number if you need it!?!
    // So we have to re-invent the wheel again and again!

    let		scheme = u.protocol;
    const	host = u.host;		// only host seems reasonable
    let		path = u.path;
    let		port = u.port|0;

    if (scheme.endsWith(':')) scheme = scheme.slice(0,-1);
    port ||=	scheme === 'https' ? 443 : 80;
    if (!path || path === '')	path = '/';

    return {scheme, host, port, path};
  }

async function set_allowed(url, perm, what)
{
  //console.log('SET', {url, perm, CFG});
  const u = saneURL(url);
  const h = CFG[u.host] ??= {};
  const s = h[u.scheme] ??= {};
  const p = s[u.port] ??= [{}];
  const x = p[0][u.path] ??= {};

  if (x[perm] === what) return;

  x[perm] = what;
  await browser.storage.local.set({AA:CFG});
}

function parse(txt)
{
}

function* a_path(u, cfg)
{
  if (!cfg) return;

  const p = u.path;

  const h = cfg[0][p];
  if (h !== void 0) yield h;

  const k = cfg[1];
  if (!k) return;

  for (const r in Object.keys(k))
    if (p.startsWith(r))
      yield k[r];
}

function* a_port(u, cfg)
{
  if (!cfg) return;

  yield* a_path(u, cfg[u.port]);
  yield* a_path(u, cfg['*']);
}

function* a_scheme(cfg, u)
{
  if (!cfg) return;

  yield* a_port(u, cfg[u.scheme]);
  yield* a_port(u, cfg['*']);
}

function* a_host(cfg, u)
{
  if (!cfg) return;

  let t	= u.host;
  for (;;)
    {
      // tries: host.example.com *.example.com *.com *
      yield* a_scheme(CFG[t], u);

      t	= t.split('.');
      if (t.length <= 1)
        break;

      if (t[0] === '*') t.shift();
      t[0] = '*';
      t = t.join('.');
    }
}

function allowed(url, perm)
{
  const u = saneURL(url);

  //console.log('allowed?', url, perm);
  for (const p of a_host(CFG, u))
    {
      //console.log('P', p);
      const r = p[perm];
      if (r !== void 0)
        return r;
    }
  //console.log('not', url, perm);
}

async function focus_tab(tab)
{
  const _ = await browser.tabs.update(tab.id, {active:true});
  return browser.windows.update(_.windowId, {focused:true});
}

function act(tab, what)
{
  //console.log('ACT', {tab,what});
  switch (what)
    {
    case 'focus':	return focus_tab(tab);
    }
}

async function domsg(msg,ctx,cb)
{
  try {
    const d = msg.detail;

    //console.log('msg', toJ(msg), ctx, CFG);
    if ('x' in msg)
      return allowed(ctx.tab.url, msg.x) && act(ctx.tab, msg.x);
    if ('r' in msg)
      return allowed(msg.u, msg.r);
    if ('w' in msg)
      return set_allowed(msg.u, msg.w, msg.v);
    if ('g' in msg)
      return CFG;
    return 'WTF?';
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function msg(msg,ctx,cb)
{
  // Documentation tells, this can return a Promise.
  // But then it fails.  Hence we need to do it asynchronously this way.
  setTimeout(() => domsg(msg,ctx,cb).then(cb, err => cb({err})));
  return true;
}

chrome.runtime.onMessage.addListener((...a) => msg(...a));

console.log('AA', MYURL, V);
});

