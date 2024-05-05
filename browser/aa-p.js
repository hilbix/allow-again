'use strict';

class Main
  {
  constructor(id)
    {
      (this._ = $(id)).innerHTML = '';
    }
  async main()
    {
      this._.innerText = 'getting current TAB ..';
      const tabs	= await ChromeCall(chrome.tabs.query)({active: true, lastFocusedWindow: true});
      if (!tabs || !tabs.length)
        {
          this._.innerHTML = '(unmanagable tab)';
          return;
        }
      const u		= tabs[0].url;
      this._.innerText = `loading state for ${u}`;
      const state	= await SEND({r:'focus', u}).catch(e => `error: ${e.message}`);

      E(this._
        , {innerText:''}
        , 'label'
        , [ 'input', {type:'checkbox',checked:state,onchange: _ => SEND({w:'focus',u,v:_.target.checked})} ]
        , [ 'span',  {innerText:' allow window.focus()' } ]
        );
    }
  };

