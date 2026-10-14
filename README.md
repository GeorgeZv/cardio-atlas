# Human Atlas - GitHub Pages

Upload extracted files to the repository root. Do not upload the ZIP itself.

Updated pages:
- index.html: new Human Atlas welcome page with two explorer cards.
- Chatgpt3b.html: the previous Cardio Atlas explorer, with a Home link.
- about.html: updated navigation.
All existing scripts, styles and vendor assets are retained.

IMPORTANT: Keep or upload your own gem_3d_cardiovascular_explorer.html at the repository root. Its source was not supplied, so this package links to that exact filename but does not contain or overwrite it. Keep its assets too. The second link will return 404 until the file is present.

For an existing installation, replace index.html and about.html, add Chatgpt3b.html, and retain the Gemini file and its dependencies.

Publish: Settings > Pages > Deploy from a branch > main > / (root) > Save. Keep .nojekyll at the root. Filenames are case-sensitive.

Navigation:
index.html -> Chatgpt3b.html
index.html -> gem_3d_cardiovascular_explorer.html
Chatgpt3b.html -> index.html (Home)
about.html -> index.html and Chatgpt3b.html

Scope: procedural teaching anatomy, not clinically validated surgical geometry. Browser/device validation is still required. See the explorer field guide for assumptions and references.
