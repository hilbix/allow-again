// This is TBD

'use strict';

class Main
  {
  constructor(id)
    {
      this._		= $(id);
      this.i		= $('note');
      this.b		= $('save');
      this.t		= $('data');

      this.b.onclick	= _ => {};

      $('load').onclick	= () => this.unchanged() && this.load();

      this.r		= new ResizeObserver(_ => this.resize());
      this.r.observe($('wh'));
      this.resize();
    }
  inf(...a)
    {
      this.i.innerText = a.join(' ');
    }
  resize()
    {
      this._rd = true;
      if (this._r) return;
      this._r	= setTimeout(() => this.layout(this._rd = void 0).finally(() => { this._r = void 0; if (this._rd) this.resize() }), 100);
    }
  unchanged()
    {
      return !this.dirty || confirm('discard changes?');
    }
  async layout()
    {
      // sorry for this fixed layout,
      // but that's just how I tick.
      const p	= $('pos');
      const pos	= p.getBoundingClientRect();
      const wh	= $('wh').getBoundingClientRect();

      // we assume that the padding is everywhere same as pos.left
      // -4 to leave some room for (modern) scrollbars and visual indicator frames
      this.t.style.width	= `${wh.width - pos.left*2 - 4}px`;
      this.t.style.height	= `${wh.height - pos.top - pos.left - 4}px`;
    }
  async main()
    {
      await this.load();
    }
  async load(retry)
    {
      this._.innerText	= '';
      this.t.value	= '';
      this.inf('loading ..');

      const cfg	= await SEND({g:'cfg'}).catch(e => {e});
      if (!cfg || cfg.e)
        {
          // for some unknown reason, the first SEND() sometimes fails,
          // so retry half a second later.  Just do it a single time, though.
          if (!retry) setTimeout(() => this.load(1), 500);
          return this.inf(`something failed: ${cfg?.e}`);
        }
      this.inf('known perms: focus');

      const o	= _('pre');
      o.innerText = JSON.stringify(cfg, void 0, 2);
      this._.append(o);

      // now convert the structure to more easy to use text config
      this.t.value = Array.from(this.export(cfg)).join('\n');
      this.dirty	= false;
    }
  *export(cfg)
    {
      for (const [host,schemes] of Object.entries(cfg))
        for (const [scheme,ports] of Object.entries(schemes))
          for (const [port,types] of Object.entries(ports))
             for (const [type,paths] of types.entries())
                for (const [path,perms] of Object.entries(paths))
                  {
                    const perm	= Object.entries(perms).map(([k,v]) => `${v ? '' : '!'}${k}`).join(' ');
                    const optport = {http:80,https:443}[scheme];
                    const addport = optport == port ? '' : `:${port}`;
                    const url	= `${scheme}://${host}${addport}${path}${type ? '*' : ''}`;
                    yield `${optport?'':'#ignore# '}${url} ${perm}`;
                  }
    }
  };

