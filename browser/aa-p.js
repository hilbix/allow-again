'use strict';

class Main
  {
  constructor(id)
    {
      (this._ = $(id)).innerHTML = '';
    }
  async main()
    {
      const tabs	= await ChromeCall(chrome.tabs.query)({active: true, lastFocusedWindow: true});
      const u		= tabs[0].url;
      const state	= await SEND({r:'focus', u});

      const l	= _('label');
      this._.append(l);

      const c	= _('input');
      c.type	= 'checkbox';
      c.checked	= state;
      l.append(c);
      c.onchange = () => SEND({w:'focus',u,v:c.checked});

      const s	= _('span');
      s.innerText = ' allow window.focus()';
      l.append(s);
    }
  };

