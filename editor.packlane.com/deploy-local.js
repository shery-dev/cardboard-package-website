const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3005;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.webp': 'image/webp'
};

function getLocalFilePath(pathname) {
    if (pathname === '/' || pathname === '/personalize' || pathname === '/personalize.html') {
        return path.join(ROOT_DIR, 'editor.packlane.com', 'personalization', 'personalize.html');
    }

    // Try direct relative path under root
    let directPath = path.join(ROOT_DIR, pathname);
    if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
        return directPath;
    }

    // Subdirectories to check
    const subdirs = [
        'editor.packlane.com',
        's1-ecp.packlane.com',
        'calc-js.packlane.com',
        'editor-images.packlane.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'webpack---'
    ];

    for (const dir of subdirs) {
        let candidate = path.join(ROOT_DIR, dir, pathname);
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            return candidate;
        }
    }

    // Try with .html extension
    if (fs.existsSync(directPath + '.html') && fs.statSync(directPath + '.html').isFile()) {
        return directPath + '.html';
    }

    return null;
}

const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
    let pathname = decodeURIComponent(reqUrl.pathname);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Stub mock endpoints
    if (pathname.includes('/collect') || 
        pathname.includes('datadog') ||
        pathname.includes('gtm.js') ||
        pathname.includes('analytics') ||
        pathname.includes('clarity') ||
        pathname.includes('dialpad')) {
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        res.end('/* local mock */');
        return;
    }

    // Serve main HTML with rewritten hostnames so it runs fully locally
    if (pathname === '/' || pathname === '/personalize' || pathname.endsWith('personalize.html')) {
        const htmlPath = path.join(ROOT_DIR, 'editor.packlane.com', 'personalization', 'personalize.html');
        if (fs.existsSync(htmlPath)) {
            let content = fs.readFileSync(htmlPath, 'utf8');

            // Rewrite remote CDN URLs to local paths
            content = content.replace(/https:\/\/editor\.packlane\.com/g, '');
            content = content.replace(/https:\/\/s1-ecp\.packlane\.com/g, '/s1-ecp.packlane.com');
            content = content.replace(/https:\/\/editor-images\.packlane\.com/g, '/editor-images.packlane.com');
            content = content.replace(/https:\/\/calc-js\.packlane\.com/g, '/calc-js.packlane.com');
            content = content.replace(/https:\/\/fonts\.googleapis\.com/g, '/fonts.googleapis.com');
            content = content.replace(/https:\/\/fonts\.gstatic\.com/g, '/fonts.gstatic.com');

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
            return;
        }
    }

    // 3D Preview renderCache endpoint
    if (pathname.includes('/packing/renderCache3D')) {
        const viewerHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>3D Preview</title>
    <link rel="stylesheet" href="/default/packing-3D/default.css">
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #eef0f4; }
        #renderCanvas { width: 100%; height: 100%; touch-action: none; outline: none; }
        .canvas-fallback { display: flex; align-items: center; justify-content: center; height: 100%; font-family: sans-serif; color: #555; }
    </style>
</head>
<body>
    <canvas id="renderCanvas"></canvas>
    <div id="noWebGl" class="canvas-fallback" style="display:none;">WebGL not supported</div>
    <script src="/default/js/packing/jquery-3.2.1.min.js"></script>
    <script src="/default/js/packing/pep.min.js"></script>
    <script src="/default/packing-3D/babylon.js"></script>
    <script>
        window.Engine3DVariables = {
            thickness: "0.0640625",
            preview: {
                three_d: {
                    outlineColor: "#2140aa",
                    highlightAlpha: "0.5",
                    highlightColor: "#2140aa",
                    highlightSpeedRatio: "1",
                    foldAnimationInterval: "1.5",
                    selectPanelAnimationInterval: "0.5",
                    defaultAnimationInterval: "1"
                }
            },
            cameraSettings: { cameraCenter: "mesh0" },
            panelData: {},
            meshes: {}
        };
    </script>
    <script src="/default/packing-3D/packing.js"></script>
</body>
</html>`;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(viewerHtml);
        return;
    }

    const filePath = getLocalFilePath(pathname);
    if (filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + pathname);
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`====================================================`);
    console.log(` Packlane Editor deployed locally!`);
    console.log(` URL: http://localhost:${PORT}/`);
    console.log(`====================================================`);
});
