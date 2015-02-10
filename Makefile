BIN = ./node_modules/.bin
DIST = _dist
GREEN = \033[0;32m
NO_COLOR = \033[0m

# --------------------------
# Dev Tasks
# --------------------------

dev: watch_js watch_sass serve

watch_js:
	watchify js/main.js -o js/bundle.js -dv
	@echo "${GREEN}Watching JS files.${NO_COLOR}\n"

watch_sass:
	$(BIN)/nodemon -e scss -x "make compile_sass"
	@echo "${GREEN}Watching SASS files.${NO_COLOR}\n"

compile_sass:
	$(BIN)/node-sass -o css sass/main.scss bundle.css
	@echo "${GREEN}Compile SASS files.${NO_COLOR}\n"

serve:
	node server.js
	@echo "${GREEN}Start server.${NO_COLOR}\n"


# --------------------------
# Build Tasks
# --------------------------

build: test clean make_dir copy min_css min_js update_paths

clean:
	rm -rf $(DIST)/
	@echo "${GREEN}Removed old build directory.${NO_COLOR}\n"

copy:
	cp index.html $(DIST)/index.html
	cp data/us-states-output.json $(DIST)/data/us-states-output.json
	cp data/data.json $(DIST)/data/data.json
	@echo "${GREEN}Copied files.${NO_COLOR}\n"

make_dir:
	mkdir $(DIST) $(DIST)/css $(DIST)/js $(DIST)/data
	@echo "${GREEN}Created new directories.${NO_COLOR}\n"

min_css:
	$(BIN)/node-sass --output-style compressed -o $(DIST)/css/ sass/main.scss bundle.min.css

min_js:
	browserify js/main.js | uglifyjs -o $(DIST)/js/bundle.min.js
	@echo "${GREEN}Minified JavaScript.${NO_COLOR}\n"

update_paths:
	node bin/update-paths
	@echo "${GREEN}Updated static paths.${NO_COLOR}\n"


# --------------------------
# Test
# --------------------------

test:
	@jshint --verbose js/** --config .jshintrc
	@echo "${GREEN}Linted .js files.${NO_COLOR}\n"