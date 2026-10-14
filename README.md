# Human Atlas - GitHub Pages

Upload extracted files to the repository root. Do not upload the ZIP itself.

Updated pages:
- index.html: Human Atlas welcome page with cardiovascular and nervous-system collections.
- Chatgpt3b.html: canonical Cardio Atlas explorer.
- gem_3d_cardiovascular_explorer.html: canonical Gemini cardiovascular explorer.
- gem_3d_neuron.html: canonical motor-neuron explorer.
- translations_es.js: shared Spanish localization for the landing page and all three explorers.
- *_es.html: compatibility entry points that open the corresponding canonical page in Spanish.
Keep all existing scripts, styles, vendor assets and model dependencies.

Each canonical page supports English by default and Spanish with `?lang=es`; its language control switches between the two without maintaining duplicate page content. Keep the `_es.html` files when publishing so existing Spanish links continue to work.

Publish: Settings > Pages > Deploy from a branch > main > / (root) > Save. Keep .nojekyll at the root. Filenames are case-sensitive.

Navigation:
- index.html -> Chatgpt3b.html, gem_3d_cardiovascular_explorer.html, and gem_3d_neuron.html
- index_es.html -> index.html?lang=es
- *_es.html explorer links -> corresponding canonical explorer?lang=es
- Chatgpt3b.html -> index.html (Home)
- about.html -> index.html and Chatgpt3b.html

Scope: procedural teaching anatomy, not clinically validated surgical geometry. Browser/device validation is still required. See the explorer field guide for assumptions and references.
