# Packlane 3D Box & Packaging Designer (Cleaned Core)

This folder contains the essential frontend files, layout templates, stylesheets, components, and 3D preview engine for the **Packlane Packaging Editor**. All external tracking scripts, third-party analytics, and scraper junk have been stripped away so this folder can easily be moved into another project and integrated by Antigravity or a developer.

---

## 📁 Key File Structure & Architecture

```
editor.packlane.com/
├── deploy-local.js                # Standalone Node.js local server
├── package.json                   # npm start configuration
├── start-local.bat                # Windows 1-click launcher
│
├── editor.packlane.com/           # Core Editor Application
│   ├── personalization/
│   │   ├── personalize.html       # ⭐ MAIN TEMPLATE: DOM layout, toolbars, sidebars, diecut SVG
│   │   └── designer_assets/       # UI icons (rotate, etc.)
│   ├── dri/
│   │   ├── base/
│   │   │   ├── css/designer/light-mode-vars.css  # CSS theme tokens & color variables
│   │   │   ├── js/compiled_angular_scripts.js    # Angular UI components & directives
│   │   │   ├── js/compiled_main.js               # 2D Fabric.js canvas editor engine
│   │   │   └── images/                           # Modal and UI vector icons
│   │   └── PKLN/
│   │       ├── css/compiled-base-styles.min.css  # Main editor UI stylesheets
│   │       ├── css/compiled-module-styles.min.css# Sub-module component styles
│   │       ├── css/designer/3d-preview.css       # 3D preview container styles
│   │       └── images/packlane-logo.svg          # Brand logo
│   ├── default/
│   │   └── packing-3D/
│   │       ├── babylon.js         # Babylon.js 3D WebGL engine
│   │       ├── packing.js         # 3D box folding & mesh rendering script
│   │       └── default.css        # 3D viewport canvas styles
│   ├── packing_textures/
│   │   └── white.png              # Corrugated cardboard box texture
│   └── logo_builder/              # Logo builder module (CSS & JS)
│
├── s1-ecp.packlane.com/           # Shared Framework & Application Module
│   └── static/assets/
│       ├── css_min/global-styles/ # Global layout styles
│       ├── libraries/angular/     # AngularJS 1.5.11 & sanitize libraries
│       ├── libraries/angular-ui-bootstrap/ # Bootstrap UI directives
│       └── scripts_min/angular_app/site-design-studio.min.js # Main Angular app module
│
├── calc-js.packlane.com/          # Box dimension & pricing calculation widgets
├── editor-images.packlane.com/    # Font spritesheets
├── fonts.googleapis.com/          # Libre Franklin typography styles
├── fonts.gstatic.com/             # Offline font files
│
└── webpack---/src/                # ⭐ SOURCE CODE (Unminified ES6)
    ├── entry.js                   # Source for 3D box folding engine & Babylon scene
    └── panel_selector.js          # Source for 3D panel interaction & highlighting
```

---

## 🎨 Layout Breakdown for Antigravity

When copying this layout into your target website:

1. **Top Navigation Bar (`#editorTopbarContainer`)**:
   - Packlane logo container
   - `<wgt-file-menu>`: File dropdown
   - `<wgt-project-name>`: Project title and rename
   - Actions: Download dieline, Theme switcher, Help, Share, Save, Add to Cart

2. **Left Sidebar (`<left-sidebar>`)**:
   - Tool tabs: Add Images, Add Text, Background Color, Box Dimensions, Material Selection

3. **Center Canvas (`#canvasAreaDesigner`)**:
   - Interactive 2D dieline canvas powered by Fabric.js
   - Contains SVG cut lines, crease/perforation lines, and customizable artboards

4. **Right Sidebar / 3D Dock (`.right-sidebar.is-packaging`)**:
   - Collapsible 3D preview panel (`#tdIframe`)
   - Babylon.js WebGL canvas displaying real-time 3D folded box preview with interactive camera controls

5. **Die-Cut Data (`pagesData` in `personalize.html`)**:
   - Full vector SVG definition of the box dieline
   - Cut line paths: `<g id="cuts">`
   - Crease/perforation paths: `<g id="perforation">`

---

## 🚀 How to Run Locally

Run with Node.js:
```bash
npm start
# or: node deploy-local.js
# or double-click: start-local.bat
```
Then visit **`http://localhost:3000/`** in your browser.
