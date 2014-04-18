default: test

circular:
	@echo "circular"
	@node ./node_modules/madge/bin/madge --circular --format amd ./lib

jshint:
	@echo "jshint"
	@find . -name "*.js" -not -path "./node_modules/*" -print0 | xargs -0 node ./node_modules/jshint/bin/jshint --reporter node_modules/jshint-stylish/stylish.js

test: jshint  circular
	@echo "test"
	@echo
