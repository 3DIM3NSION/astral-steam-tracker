# Reference Screenshots

The README references two screenshots from the live build feed. Save them in this folder with these exact filenames so the README renders correctly on GitHub:

```
references/
├── embed-rust.png        # Rust update embed
└── embed-cs2.png         # Counter-Strike 2 update embed
```

These are the same screenshots the project uses to communicate the visual target for new embed work — keep them up to date if the embed style evolves.

If you don't have the originals, regenerate them by running `npm run force-check -- --force --key=cs2` against a test webhook and screenshotting the result.
