> Currently under development and only tested for FF ESR 115 and Chromium 124 on Linux.
>
> Changing settings is not yet completed.  However it already is usable.

- Chrome: Not yet available on store, load it manually, see below
- Firefox 115 and above: <https://addons.mozilla.org/de/firefox/addon/allowagain/>


# Allow some browser features for certain URLs again

If you are thirsty, you need a glass of water.
However the browser's creators apparently follow an all or nothing strategy.

So you either only can die on thirst, or get drowned.
But you are not allowed to satisfy your thirst in a reasonable way.

This here tries to leverage such shortcommings.

For now it allows windows to use following feature:

- `window.focus()` to bring itself to the top.

If you have any idea for some similar needed options,
[please open an issue on GitHub](https://github.com/hilbix/allow-again/issue)

Thank you very much!


## Usage

Usage is very simple.  Enable the extension's icon in the extension bar.
Then you can click on the icon and check or uncheck `allow window.focus()`.

This way you can allow the displayed page to use `window.focus()` again
to bring itself onto the top.

> This is done by injecting code for `window.focus()`.
> Perhaps some pages are incompatible to this hack.

There also is a "Setup" link in the popup.  If you click on this,
a very simple management window opens.

In it there is a textbox which shows the local configuration,
such that you can copy and paste it.

> However, the "Save" currently does nothing.

~~You also can add URLs where to load the configuration from.~~


## Install

> Note that FF ESR 115 compatibility will be removed after 2024-10-01.

This extension is now available for FF 115 and above in the store as

URL: <https://addons.mozilla.org/de/firefox/addon/allowagain/>

> The newest version will be available, soon.

To install and load it locally:

	git clone https://github.com/hilbix/allow-focus-again.git

- Install it on Chrome or Chromium
  - open <about:extensions>
  - enable developer mode
  - click on `load unpacked`
  - point it to `allow-focus-again/browser` and click open
- FF ESR 115:
  ```
  sudo ln -s --relative allow-again/esr115 '/usr/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}/aa@geht.net'
  ```
- FF ESR 128:
  ```
  sudo ln -s --relative allow-again/browser '/usr/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}/aa@geht.net'
  ```
- This does not work for FireFox running from Snap (even if it is ESR.  Blame Snap for this).
- Sometimes existing profiles refuse to load new global extensions if there are already local extensions.
  - In that case you can open a fresh profile via <about:profiles>
  - I have no idea how to fix that problem in an existing profile, except by resetting the affected profile ..

Perhaps I will come around to put it on the stores somehow.

> I currently have no idea how to do this.
>
> Note that I am already registered as developer on Chrome Store.
> But this does not change anything in that I still do not have the slightest idea how to do it .. yet.


## Rationale

As there always is not enough room on ~~your~~ my monitors to neatly display everything,
there should be a way for web applications to focus to a given window or tab.

However this is disallowed these days, such that the experience with web app sucks a lot.

> At least with distributed web apps which can run cooperatively on multiple browsers.


### Configuration format

> "Save" does not work.  So changes have no effect for now.
>
> The wildcard matching code is untested.
>
> Permission sets are missing, too.

The configuration is just text lines.

- Leading spaces or tabs are silently skipped, such that you can group things visually.
  - These spaces etc. are not retained but might be helpful for externally provided configuration.
- Empty lines (or those only consisting of whitespace) are ignored

Each line starts with an URL.

You can use `*` as a joker to allow multiple entries:

- If the URL ends on `*` every URL which has this URL as a prefix is allowed
- If the URL ends on `/` the URL and the URL without this `/` are allowed
  - Hence if you encounter an URL which really ends on `*` simply add a `/` after the `*`
- If the host part starts with a `*`, subdomains are allowed
  - This includes sub-subdomains.
  - Do not forget to add the `.` after the `*`
- If the host has a port, it must be either a number or `*`
  - For scheme `http` port 80 and scheme `https` port 443 are removed!
- If the scheme is `*`, any scheme is allowed
  - If it does not start with `*://` then the `://` is implicitly added after the `*`
- All other uses are not implemented and invalidate the entry
  - So this entry is ignored
- Lines which do not start with a scheme or `*` are ignored

After the URL, spaces or tabs can optionally follow which are ignored.

Then a space separated permission set can follow the URL:

- Line ends on the first CR or LF encountered.
- Multiple permission are separated by spaces or tabs
  - Do not use comma (`,`)
- Permissions can include `*` to match all permissions
- If a permission starts with `@` it is allowed
- If a permission starts with `+` it is added to the set
- If a permission starts with `!` it uses the browser's default
- If a permission starts with `-` it is removed from the set
- If a permission starts with another character, an impllicite `@` is taken into account
- permissions always start with a lowercase character
- permission sets start with an uppercase character
- If no permissions are added (the empty set) then the `DEFAULT` permission set is used
  - The `DEFAULT` permission set is empty, so it uses the browser's default

Permission sets can be added like URLs, just start them with an Uppercase character.

- URLs start with lowercase letters (scheme) or `*`, so they can be distinguished


#### Permissions

> Permission sets are not yet implemented.

Currently there is only one permission:

- `focus`: Allow `window.focus()` calls to focus the browser tab.

Permission sets are local to the file loaded, so you cannot accidentally "include" permission sets from other files.


#### Examples

`*://*.bank.com*`

- Matches `http://www.bank.com`
- Does not match `https://bank.com/`
- Does not match `https://www.bank.com.evil`

`*://*.bank.com/*`

- Matches exactly the same as `*://*.bank.com*`
  - This is because if you open `https://www.bank.com` the real URL will become `https://www.bank.com/`

`*bank.com*`

- matches `https://bank.com`
- does not match `http://www.bank.com`

`**bank.com*`

- matches `https://bank.com`
- matches `http://www.bank.com`
- matches `https://evilbank.com`

`**.bank.com*`

- does not match `https://bank.com`
- matches `http://www.bank.com`
- does not match `https://evilbank.com`


## Security

This extension follows a strict security first principle.

- For privacy it follows the minimal need to know strategy.
- This extension will never be sold or handed over to a third party
  - Except it is some official trustworthy party like Mozilla, Apache, Debian or similar.
- It will never track you nor send privacy information to a third party.
  - Your IP (and additional XHR header information) is only revealed to external parties
    if you load configuration from there
  - You can use a VPN or Proxy service you trust to hide your IP
- I will treat security related issues very seriously
  - Please open issue on GitHub <https://github.com/hilbix/allow-again/issues>
  - and please notify me on Threema or Signal as well!
  - Threema ID `7J76V8RM` (this is anonymous)
  - Signal Name `SUSI.42` (this is free)


## Code

The code here

- shall be as simple as it can get
- must be self contained
  - It can make use of `git submodule`s
- must not depend on any external components (like JQuery)

I am open to code reviews:

- But I cannot pay for this, sorry.

I am open for maintainers:

- If you are a maintainer of some distro,
  please send PRs,
  such that your fork's SHAs can be merged here.
- Complex diverting repos are a PITA.

Note: To be able to accept changes by others,
these changes **must not be copyrighted**.
So please [put your changes into the Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)
(or better, just adopt the [CLL](COPYRIGHT.CLL)).


## FAQ

Homepage / Imprint?

- <https://valentin.hilbig.de/> but only if you got this from <https://github.com/hilbix/allow-again>
- I am not responsible for forks!

Name?

- "Allow-Again" can be abreviated to "AA", which stands for Poop in German Baby's language.
- This is intended and hence the logo.

Logo?

- Note that this resembles how I always work:
  - I take something which already exists
  - just to mix and adapt it to my very needs.
- Often I have to create my own tools for this from scratch
  - because most(!) of the available tools
  - have an overwhelmingly set of features I will never need
  - but lack just the little one obvious feature that I need.
  - Or they are too limited in what they allow to do,
  - quite often for no good reason at all,
  - or maybe I am just too retarded to understand how to use these tools properly.
  - Anyway, I know how to adapt everything to my needs,
  - but this often not only takes a long time to do,
  - it often is a very frustrating way to go.
- Example:
  - To execute privileged commands within automation scripts
  - I use my own tool (suid)[https://github.com/hilbix/suid]
  - instead of `sudo`.  Why?  Due to following hypothetical scenario:
  - Try to allow a safe `rm -rf 'earth $something'` with `sudo`.
  - You cannot, as the `sudo` rule `rm -rf earth *` matches `sudo rm -rf earth /`, too.  (Absence of quotes!)
  - Even if this would not be the case, how to protect against `ln -s / 'earth '; sudo rm -rf 'earth /.'`?
  - In contrast `suid` lacks such overly error prone complex features like login prompts, command logging or rulesets.
  - However you still can wrap everything such, that `suid rm -rf 'earth /.'` cannot do harm.  Without external helpers!
  - (You have to do it yourself, but you can do it with `suid`, in contrast where you cannot do it with `sudo` alone!)
  - Also `suid` comes with a strict security first strategy
  - and includes additional security features which you simply cannot archive with `sudo` at all.
  - For example: `suid` has a basic [shellshock](https://en.wikipedia.org/wiki/Shellshock_(software_bug)) prevention builtin.
  - Why?  Because I operate systems which are over 30 years old.  These still run a vulnerable `bash` because changing that breaks these systems!
- Similar here:
  - The logo is, what happens, when some non-artist (me) tries to do it.
  - First, I added a zoom feature into [my text editor](https://valentin.hilbig.de/edit/)
  - (this [url might change](https://valentin.hilbig.de/minion/edit.html) when [edit becomes a minion](https://github.com/hilbix/minion))
  - because browsers apparently only support an arbitrary extremely low limit of just some minor 500% zoom.
  - Then I opened it on Ubuntu 22.04 in `chromium`,
  - entered the existing [Poop Emoji](https://en.wikipedia.org/wiki/Poop_emoji) with some spaces around,
  - zoomed it to some 640%
  - and took a screenshot via PrintScreen.
  - Then pasted the screenshot into `kolourpaint`,
  - overwrote the eyes with `A A` using the Arial font at 24 pt to 32 pt or so (do no more remember)
  - and edited the inner of the `A`s white with the pencil.
  - As my [graphics Minion](https://valentin.hilbig.de/minion/i.html) is not ready yet,
  - I do not know how to add a proper transparency mask to the PNG
  - so I left it as is with the full black background (I am always in darkmode).
- If you can do better, go for it.
  - However I wish something like this could be scripted on the commandline
  - but I do not know any URL or tool which would support that.
  - Sigh.
  - Hence this lengthy text here to "implement" it properly.
  - BTW, I hate UIs.  A keyboard + `vim` + `bash` (+ some commandline tools) should be enough for everything (for me)!
  - Multiple (3+) graphical displays (8k+) are the minimum.  But find some alternative to mechanical pointing devices like mice, please!
  - .. these should be replaced by eye-tracking on monitors, touchscreens (for small displays like tablets) or, if nothing else fits, a touchpad ..
  - Further similar thoughts for disabled people: hands free (eye-tracking + voice input), eyes free (keyboard + braille display) and brain free (AI).

License?

- This Works is placed under the terms of the Copyright Less License,  
  see file [COPYRIGHT.CLL](COPYRIGHT.CLL).  USE AT OWN RISK, ABSOLUTELY NO WARRANTY.
- Read: Free as free beer, free speech and free baby.
- Read: Copyrigt is slavery.
- Note that the CLL offers a bit more freedom than Public Domain does.

Contact?  Question?

- Open Issue on GitHub.
- Perhaps I listen.

Contrib?  Patches?

- Stick to the License, waive all Copyrights!
- Then send PR on GH.
- Perhaps I listen.

Languages?

- Currently mostly English.
- (Die Datenschutzerklärung ist allerdings weitgehend nur in Deutsch.)
- If you know an easy way to translate, go for it and send Patches.

Code of Conduct?

- Uncensored truthy open speech of course!  Can it be any different?
- Hence fuck all Codes of Conduct.  Also fuck all Political Correctness.  And while you are on it, fuck all enforced Gendering as well!
- All these distort open speech and ultimatively make speech become fake news and lies only, until there is no more truth left at all.
- Note that hate speech is neither open nor truthy, so it is unacceptable still.
- BTW truth is out there, but not a single one.  Please keep that in mind.

Safety?

- AFAICS it should be safe to use.
- I do not give any guarantee that it does not harm data.
- I guarantee following:
  - I will never give anybody else control over the extension (but you can fork it)
  - I will never sell the extension to anybody else
  - I will never trojan the extension
- I cannot protect against following:
  - Anybody breaks into my cloud and takes over control against my will.
  - My systems get trojaned and hence the extension gets updated outside of my control.
  - However such a case will be handed over to officials!
  - And I will do this publicly (as soon as this will not harm investigation).

