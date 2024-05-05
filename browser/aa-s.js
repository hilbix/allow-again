// This is TBD

'use strict';

const KICKMARKER = '#del?# ';

class Main
  {
  constructor(id)
    {
      this._		= $(id);
      this.i		= $('note');
      this.b		= $('save');
      this.t		= $('data');

      this.b.onclick	= () => this.save();
      this.t.onkeyup	= () => this.state();

      $('load').onclick	= () => this.unchanged() && this.prep();

      this.r		= new ResizeObserver(_ => this.resize());
      this.r.observe($('wh'));
      this.resize();
    }

  inf(...a)
    {
      this.i.innerText = a.join(' ');
    }
  fail(e)
    {
      const t = `something failed: ${cfg?.e}`;
      this.inf(t);
      return t;
    }
  state()
    {
      const		dirt = this.t.value !== this.cmp;
      this.dirty	= dirt;
      this.b.disabled	= !this.dirty;
      this.inf(dirt ? this.t.value.startsWith(this.cmp) ? '(appened)' : '(changed)' : 'known perms: focus');
    }
  main()
    {
      this.prep();
    }

  resize()
    {
      this._rd = true;
      if (this._r) return;
      this._r	= setTimeout(() => this.layout(this._rd = void 0).finally(() => { this._r = void 0; if (this._rd) this.resize() }), 100);
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
      // As Chromium needs some extra space, -4 is now -6
      this.t.style.width	= `${wh.width - pos.left*2 - 6}px`;
      this.t.style.height	= `${wh.height - pos.top - pos.left - 6}px`;
    }

  unchanged()
    {
      return !this.dirty || confirm('discard changes?');
    }
  async prep()
    {
      this.t.value = await this.load();
      this.state();
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
          return this.fail(cfg.e);
        }

      E(this._, 'pre', {innerText:JSON.stringify(cfg, void 0, 2)});

      return this.cmp = Array.from(this.export(cfg)).join('\n');
    }
  *export(cfg)
    {
      // yield lines which convert the structure into something more easy to understand
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
                    yield `${optport?'': KICKMARKER}${url} ${perm}`;
                  }
    }

  // following feels like re-inventing the wheel a bit:
  save()
    {
      const c = this.import(this.t.value);
      if (!c)
        return this.inf('something went wrong');
      SEND({p:'cfg', c}).then(() => this.prep()).catch(e => this.fail(e));
    }
  import(str)
    {
    }
  };

