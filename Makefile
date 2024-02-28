.PHONY: clean all
all: build/index.js

build:
	mkdir -p build

build/index.js: src/index.ts | build
	npx tsc src/index.ts --outfile build/index.js

clean: 
	rm -rf build
