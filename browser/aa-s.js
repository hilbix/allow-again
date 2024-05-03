// This is TBD

'use strict';

class Main
  {
  constructor(id)
    {
      (this._ = $(id)).innerHTML = '';
    }
  async main()
    {
      const cfg	= await SEND({g:'cfg'});

      console.log(cfg);

      const d	= _('h1');
      d.innerText = 'for now, you can only see the config structure, sorry';
      const o	= _('pre');
      o.innerText = JSON.stringify(cfg, void 0, 2);

      this._.append(o);
    }
  };

