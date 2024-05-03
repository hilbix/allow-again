'use strict';

class Main
  {
  constructor()
    {
      fetch('COPYRIGHT.CLL')
      .then(_ => _.text())
      .then(_ => $('lic').innerText = _, _ => $('lic').innerText = `(loading failed: ${_})`);
    }
  main()
    {
    }
  };

