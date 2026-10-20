install:
	npm ci

install-browsers:
	npx playwright install --with-deps chromium

dev:
	npm run dev

lint:
	npm run lint

lint-fix:
	npm run lint:fix

test:
	npx playwright test

.PHONY: install install-browsers dev lint lint-fix test
