const fs = require('fs');

const keysFile = "d:/meroskhiva/Meros/Meros/translation-keys.js";
const content = fs.readFileSync(keysFile, 'utf-8');

let pagesHtml = `
            <!-- ── PAGES TAB ── -->
            <div class="tab-panel" id="panel-pages">
                <div class="admin-card">
                    <h3>🖼️ Page Banners & Main Images</h3>
                    <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
                        Upload new photos (JPG/PNG/WebP, max 2MB). The URL will be saved automatically after upload.
                    </p>
`;

let diningHtml = `
            <!-- ── DINING TAB ── -->
            <div class="tab-panel" id="panel-dining">
`;

const lines = content.split('\n');
const groups = {};

for (const line of lines) {
    if (line.includes("{ key:") && line.includes("category: 'pages'")) {
        const keyMatch = line.match(/key:\s*'([^']+)'/);
        const labelMatch = line.match(/label:\s*'([^']+)'/);
        if (keyMatch && labelMatch) {
            const key = keyMatch[1];
            const label = labelMatch[1];
            const safeId = key.replace(/\./g, "_");
            pagesHtml += `
                    <div class="edit-group">
                        <label>${label}</label>
                        <div class="img-upload-row">
                            <input type="text" id="img-input-${safeId}"
                                data-edit-key="${key}" data-edit-category="pages"
                                placeholder="Image URL or upload below">
                            <label class="img-upload-label">
                                <i class="fas fa-upload"></i> Upload
                                <input type="file" accept="image/*"
                                    onchange="uploadAdminImage(this.files[0], 'img-input-${safeId}', '${key}')">
                            </label>
                        </div>
                        <div class="img-status" id="img-upload-status-img-input-${safeId}"></div>
                    </div>`;
        }
    } else if (line.includes("{ key:") && line.includes("category: 'dining'")) {
        const keyMatch = line.match(/key:\s*'([^']+)'/);
        const labelMatch = line.match(/label:\s*'([^']+)'/);
        const typeMatch = line.match(/type:\s*'([^']+)'/);
        if (keyMatch && labelMatch && typeMatch) {
            const key = keyMatch[1];
            const label = labelMatch[1];
            const typ = typeMatch[1];
            
            const itemName = label.split(' –')[0];
            if (!groups[itemName]) groups[itemName] = [];
            groups[itemName].push({ key, label, type: typ });
        }
    }
}

for (const [itemName, items] of Object.entries(groups)) {
    if (itemName.includes("Hero") || itemName.includes("Menu")) continue;
    
    diningHtml += `
                <div class="admin-card">
                    <h3>🍽️ ${itemName}</h3>`;
    
    for (const item of items) {
        const safeId = item.key.replace(/\./g, "_");
        if (item.type === 'image') {
            diningHtml += `
                    <div class="edit-group">
                        <label>${item.label}</label>
                        <div class="img-upload-row">
                            <input type="text" id="img-input-${safeId}"
                                data-edit-key="${item.key}" data-edit-category="dining"
                                placeholder="Image URL or upload below">
                            <label class="img-upload-label">
                                <i class="fas fa-upload"></i> Upload
                                <input type="file" accept="image/*"
                                    onchange="uploadAdminImage(this.files[0], 'img-input-${safeId}', '${item.key}')">
                            </label>
                        </div>
                        <div class="img-status" id="img-upload-status-img-input-${safeId}"></div>
                    </div>`;
        } else {
            diningHtml += `
                    <div class="edit-group"><label>${item.label} <span class="lang-badge">EN</span></label>
                        <input type="text" data-edit-key="${item.key}" data-edit-lang="en" data-edit-category="dining">
                    </div>
                    <div class="edit-group"><label>${item.label} <span class="lang-badge">UZ</span></label>
                        <input type="text" data-edit-key="${item.key}" data-edit-lang="uz" data-edit-category="dining">
                    </div>
                    <div class="edit-group"><label>${item.label} <span class="lang-badge">RU</span></label>
                        <input type="text" data-edit-key="${item.key}" data-edit-lang="ru" data-edit-category="dining">
                    </div>`;
        }
    }
    diningHtml += `
                </div>`;
}

pagesHtml += `
                </div>
                <div class="save-bar">
                    <button class="btn-save" onclick="saveAdminContentOverrides('pages')">
                        <i class="fas fa-save"></i> Save Page Changes
                    </button>
                    <span class="save-status" id="content-save-status"></span>
                    <button class="btn-restore" onclick="restoreLastBackup()">
                        <i class="fas fa-undo"></i> Restore Backup
                    </button>
                </div>
            </div>
`;

diningHtml += `
                <div class="save-bar">
                    <button class="btn-save" onclick="saveAdminContentOverrides('dining')">
                        <i class="fas fa-save"></i> Save Dining Changes
                    </button>
                    <span class="save-status" id="content-save-status"></span>
                    <button class="btn-restore" onclick="restoreLastBackup()">
                        <i class="fas fa-undo"></i> Restore Backup
                    </button>
                </div>
            </div>
`;

fs.writeFileSync("d:/meroskhiva/Meros/Meros/admin_tabs.html", pagesHtml + "\n" + diningHtml);
console.log("Done");
