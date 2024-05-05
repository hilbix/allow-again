# This Works is placed under the terms of the Copyright Less License,
# see file COPYRIGHT.CLL.  USE AT OWN RISK, ABSOLUTELY NO WARRANTY.

# Until FF ESR 128 is stable - probably 2024-10-01 - we need to tweak it such that the extension loads.  Then instead use:
# HACK=browser
HACK=esr115

.PHONY:	love
love:	all

.PHONY:	all
all:	$(HACK)
	@echo
	@echo For Firefox 121 and above you can use
	@echo https://addons.mozilla.org/de/firefox/addon/allowagain/
	@echo
	@echo For Chrome go to chrome://extensions and enable developer mode.
	@echo "Then 'Load unpacked' and select subdirectory 'browser'"
	@echo
	@echo For Firefox ESR 128 and above, this extension can be installed like this:
	@echo "sudo ln -s browser '/usr/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}/aa@geht.net'"
	@echo
	@echo For Firefox ESR 115 you need following temporary workaround:
	@echo "sudo ln -s esr115 '/usr/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}/aa@geht.net'"
	@echo

# I'd love to use softlinks - however my FF ESR refuses to load the ext then
.PHONY:	esr115
esr115:
	@mkdir -p '$@'
	@for a in browser/*; do x="$$(basename "$$a")"; [ manifest.json = "$$x" ] || cmp -s "$$a" "$@/$$x" || cp -vf "$$a" "$@/$$x" || break; done
	@FIX="$$(sed -e '/strict_min_version/s/121/115/' -e '/service_worker/d' -e '/minimum_chrome_version/d' browser/manifest.json)" && { echo "$$FIX" | cmp - '$@/manifest.json' || echo "$$FIX" >'$@/manifest.json'; }

.PHONY:	zip
zip:	$(HACK)
	NAME="allow-again-`jq -r .version browser/manifest.json`.zip" && rm -vf "$$NAME" && cd '$(HACK)' && zip "../$$NAME" *

