# Cardio Atlas — GitHub Pages package

## Publish using the GitHub website
1. Extract this ZIP on your computer. Do not upload the ZIP itself.
2. Create a public GitHub repository named cardio-atlas.
3. Choose Add file > Upload files. Upload all extracted files and the vendor folder, preserving its contents. index.html must be at the repository root.
4. Commit the files to main.
5. Ensure .nojekyll exists at the repository root. If your file picker hides it, use Add file > Create new file and name it .nojekyll. A blank line is sufficient.
6. Open Settings > Pages. Select Deploy from a branch, main, and / (root). Click Save.
7. Check Actions for the pages deployment. Your address will be https://YOUR-USERNAME.github.io/cardio-atlas/ . GitHub Pages also shows the actual address.

No npm install, build, API key, or backend is required. Keep vendor/ intact; it includes Three.js, OrbitControls, fonts and the Three.js license. The site uses relative URLs suitable for a repository subpath.

## Update
Upload changed files to the same paths and commit to main; Pages republishes automatically.

## Troubleshooting
- 404: verify index.html is at the root, main is selected, and the Pages deployment succeeded.
- Blank 3D scene: use a WebGL2-capable browser with hardware acceleration, and verify vendor/ was uploaded.
- Missing styles or scripts: preserve filenames, folder structure and capitalization.
- Do not open index.html via file:// for local testing; use a static HTTP server.

## Model scope
The anatomy is a procedural educational approximation, not clinically validated surgical geometry. Pressure/volume curves and flow are illustrative. Medical assumptions and references are in the in-app field guide. Browser/device validation is still required for production use.

Official documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
