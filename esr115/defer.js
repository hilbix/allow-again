'use strict';
/* vim: ts=8	*/

/* minilib */
const $ = _ => document.getElementById(_);
// <a>				E('a')
// <a><b>			E('a', 'b')
// <a><b><c>			E('a', 'b', 'c')
// <a><b><c></c></b><d>		E('a', ['b', 'c'], 'd')		or , ['d'])
// <a><b></b><c><d></d></c><e>	E('a', ['b'], ['c', 'd'], 'e')	or , ['e'])
// <a>hw</a>			E('a', {innerText:'hw'})
// <input type="text">		E('input', {type:'text'})
const E = (_=>_())(()=>
  {
    const get = _ =>
      {
        const r = {}
        let add;

        for (let a of _)
          {
            let stay;

//            console.log('E()', a, r);
            switch (true)
              {
              default:			a = document.createElement(a);		break;
              case !a:			a = document.createDocumentFragment();	break;
              case Array.isArray(a):	a = get(a).first; stay=1;		break;
              case a instanceof Node:						break;
              case 'object' === typeof a:
                [r.last].map(_ => Object.entries(a).forEach(([k,v]) => _[k]=v));
                continue;
              }
            if (add)
              add.append(a);
            if (!add || !stay)
              add	= a;
            r.last	= a;
            if (!r.first)
              r.first	= a;
          }
        return r;
      }
    return (..._) => get(_);
  });

const ChromeCall = fn => (...a) => new Promise((ok,ko) => fn(...a, r => { const e=chrome.runtime.lastError; if (e) ko(e); else ok(r); }));
const SEND = ChromeCall(chrome.runtime.sendMessage);    // Documentation says, MF3 returns a Promise.  Wrong, need to create one myself!

// asynchronously call Main('name',debug).main() class when DOM is ready so far.
setTimeout(data => new Main(data?.main || 'main', parseInt(data?.debug) || 0).main(), 0, document.currentScript?.data)

