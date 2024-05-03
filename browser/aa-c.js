// content script at document_start
'use strict';

(_=>_())(()=>{
const msg = _ => { chrome.runtime.sendMessage(_) };			// ignore response (for now)
window.addEventListener('__AA__EvEnT', _ => msg({x:_.detail}));		// relay events to the backend

// inject the wrapping changes
const s = document.createElement('script');
s.src = chrome.runtime.getURL('aa-i.js');
s.onload = () => s.remove();
(document.head || document.documentElement).prepend(s);
});

