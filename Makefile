BIN = ./node_modules/.bin
DIST = _dist
GREEN = \033[0;32m
NO_COLOR = \033[0m

build: test clean make_dir copy min_css min_js

clean:
	rm -rf $(DIST)/
	@echo "${GREEN}Removed old build directory.${NO_COLOR}\n"

copy:
	cp index.html $(DIST)/index.html
	cp data/us-states-output.json $(DIST)/data/us-states-output.json
	cp data/data.json $(DIST)/data/data.json
	@echo "${GREEN}Copied files.${NO_COLOR}\n"

make_dir:
	mkdir $(DIST)
	mkdir $(DIST)/css
	mkdir $(DIST)/js
	mkdir $(DIST)/data
	@echo "${GREEN}Created new directories.${NO_COLOR}\n"

min_css:
	$(BIN)/node-sass --output-style compressed -o $(DIST)/css/ sass/main.scss bundle.css

min_js:
	uglifyjs js/bundle.js -o $(DIST)/js/bundle.js
	@echo "${GREEN}Minified JavaScript.${NO_COLOR}\n"

test:
	@jshint --verbose js/** --config .jshintrc
	@echo "${GREEN}Linted .js files.${NO_COLOR}\n"