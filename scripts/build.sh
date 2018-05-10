#!/bin/sh

set -e

PATH=$(npm bin):"$PATH"
export PATH
CLEANSLATE="node_modules/cleanslate/docs/files/cleanslate.css"

mkdir -p generated/static
mkdir -p generated/static/clippy
scripts/excmds_macros.py
scripts/newtab.md.sh
scripts/make_tutorial.sh
scripts/make_docs.sh &
nearleyc src/grammars/bracketexpr.ne > src/grammars/.bracketexpr.generated.ts
native/install.sh local
scripts/settings_page.sh

(webpack --display errors-only && scripts/git_version.sh)&

wait

# Why fix something when you can hack on top of it?
cp -r generated/static/* build/static/

if [ -e "$CLEANSLATE" ] ; then
	cp "$CLEANSLATE" build/static/cleanslate.css
else
	echo "Couldn't find cleanslate.css. Try running 'npm install'"
fi
