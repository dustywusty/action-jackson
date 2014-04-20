default: test

circular:
	@echo "------------------"
	@echo " circular"
	@echo "------------------"
	@node ./node_modules/madge/bin/madge --circular --format amd ./lib

jshint:
	@echo "------------------"
	@echo " jshint"
	@echo "------------------"
	@find . -name "*.js" -not -path "./node_modules/*" -print0 | xargs -0 node ./node_modules/jshint/bin/jshint --reporter node_modules/jshint-stylish/stylish.js

test: jshint  circular
