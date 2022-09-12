## Developing

you need pnpm, which you can install with:
```bash
npm install -g pnpm
```

install deps:
```bash
pnpm install
```

run devserver:
```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of openlearn:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.