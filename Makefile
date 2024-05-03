# This Works is placed under the terms of the Copyright Less License,
# see file COPYRIGHT.CLL.  USE AT OWN RISK, ABSOLUTELY NO WARRANTY.

.PHONY:	love
love:	all

.PHONY:	all
all:
	@echo
	@echo Nothing need to be done here.
	@echo
	@echo "Use Firefox ESR and copy or link subdirectory 'browser'"
	@echo "to '/usr/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}/aa@geht.net'"
	@echo
	@echo Or use Chrome chrome://extensions and enable developer mode.
	@echo "Then 'Load unpacked' subdirectory 'browser'"
	@echo

.PHONY:	zip
zip:
	NAME="allow-again-`jq -r .version browser/manifest.json`.zip" && rm -vf "$$NAME" && cd browser && zip "../$$NAME" *

