d:
	pnpm run dev

l:
	pnpm run lint

lf:
	pnpm run lint:fix

p:
	pnpm run prettify

s:
	pnpm run start

t:
	pnpm run test:watch

typecheck:
	pnpm run typecheck

check:
	make typecheck
	make l
	pnpm run test

up:
	pnpm up -L

b:
	make check
	pnpm run build

i:
	rm -rf node_modules
	pnpm i
