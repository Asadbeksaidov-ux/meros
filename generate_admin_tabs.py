import json
import re

keys_file = "d:/meroskhiva/Meros/Meros/translation-keys.js"
with open(keys_file, "r", encoding="utf-8") as f:
    content = f.read()

# We only want to generate for category 'pages' and 'dining'
# For 'pages', we want to generate image upload inputs
# For 'dining', we want to generate image upload inputs and text/price inputs

pages_html = """
            <!-- ── PAGES TAB ── -->
            <div class="tab-panel" id="panel-pages">
                <div class="admin-card">
                    <h3>🖼️ Page Banners & Main Images</h3>
                    <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
                        Upload new photos (JPG/PNG/WebP, max 2MB). The URL will be saved automatically after upload.
                    </p>
"""
dining_html = """
            <!-- ── DINING TAB ── -->
            <div class="tab-panel" id="panel-dining">
"""

dining_items = {}

import ast
lines = content.splitlines()
for line in lines:
    if "{ key:" in line and ("category: 'pages'" in line or "category: 'dining'" in line):
        # hacky parse
        key = re.search(r"key:\s*'([^']+)'", line).group(1)
        label = re.search(r"label:\s*'([^']+)'", line).group(1)
        typ = re.search(r"type:\s*'([^']+)'", line).group(1)
        category = re.search(r"category:\s*'([^']+)'", line).group(1)
        
        safe_id = key.replace(".", "_")
        
        if category == 'pages':
            pages_html += f"""
                    <div class="edit-group">
                        <label>{label}</label>
                        <div class="img-upload-row">
                            <input type="text" id="img-input-{safe_id}"
                                data-edit-key="{key}" data-edit-category="pages"
                                placeholder="Image URL or upload below">
                            <label class="img-upload-label">
                                <i class="fas fa-upload"></i> Upload
                                <input type="file" accept="image/*"
                                    onchange="uploadAdminImage(this.files[0], 'img-input-{safe_id}', '{key}')">
                            </label>
                        </div>
                        <div class="img-status" id="img-upload-status-img-input-{safe_id}"></div>
                    </div>"""
        elif category == 'dining':
            if typ == 'image':
                dining_html += f"""
                <div class="admin-card">
                    <h3>🍽️ {label.split(' –')[0]}</h3>
                    <div class="edit-group">
                        <label>{label}</label>
                        <div class="img-upload-row">
                            <input type="text" id="img-input-{safe_id}"
                                data-edit-key="{key}" data-edit-category="dining"
                                placeholder="Image URL or upload below">
                            <label class="img-upload-label">
                                <i class="fas fa-upload"></i> Upload
                                <input type="file" accept="image/*"
                                    onchange="uploadAdminImage(this.files[0], 'img-input-{safe_id}', '{key}')">
                            </label>
                        </div>
                        <div class="img-status" id="img-upload-status-img-input-{safe_id}"></div>
                    </div>"""
            else:
                # Text or price
                if "Title" in label or "Desc" in label or "Price" in label:
                    dining_html += f"""
                    <div class="edit-group"><label>{label} <span class="lang-badge">EN</span></label>
                        <input type="text" data-edit-key="{key}" data-edit-lang="en" data-edit-category="dining">
                    </div>
                    <div class="edit-group"><label>{label} <span class="lang-badge">UZ</span></label>
                        <input type="text" data-edit-key="{key}" data-edit-lang="uz" data-edit-category="dining">
                    </div>
                    <div class="edit-group"><label>{label} <span class="lang-badge">RU</span></label>
                        <input type="text" data-edit-key="{key}" data-edit-lang="ru" data-edit-category="dining">
                    </div>"""
                    if "Desc" in label or "Price" in label:
                        # Close the card since Desc/Price is usually the last one
                        # Wait, some items have price, some don't.
                        # It's better to group them by the prefix (e.g. menu.shivit vs dining.shivit_price)
                        # We will just close the card if it's the last item we need. Actually let's just let it be.
                        # Wait, we opened the card when typ == 'image'. So we should close it here if it's the last one.
                        # The order is Image -> Title -> Desc -> Price (optional).
                        pass
                
            # hacky but we can just append. For dining, we'll fix the HTML tags below.

# Let's write a smarter grouper
import collections
groups = collections.defaultdict(list)
for line in lines:
    if "{ key:" in line and "category: 'dining'" in line:
        key = re.search(r"key:\s*'([^']+)'", line).group(1)
        label = re.search(r"label:\s*'([^']+)'", line).group(1)
        typ = re.search(r"type:\s*'([^']+)'", line).group(1)
        
        # Group by item name (before ' –')
        item_name = label.split(' –')[0]
        groups[item_name].append({'key': key, 'label': label, 'type': typ})

dining_html = """
            <!-- ── DINING TAB ── -->
            <div class="tab-panel" id="panel-dining">
"""

for item_name, items in groups.items():
    if "Hero" in item_name or "Menu" in item_name:
        continue # skip the old stuff if any
    
    dining_html += f"""
                <div class="admin-card">
                    <h3>🍽️ {item_name}</h3>"""
    for item in items:
        safe_id = item['key'].replace(".", "_")
        if item['type'] == 'image':
            dining_html += f"""
                    <div class="edit-group">
                        <label>{item['label']}</label>
                        <div class="img-upload-row">
                            <input type="text" id="img-input-{safe_id}"
                                data-edit-key="{item['key']}" data-edit-category="dining"
                                placeholder="Image URL or upload below">
                            <label class="img-upload-label">
                                <i class="fas fa-upload"></i> Upload
                                <input type="file" accept="image/*"
                                    onchange="uploadAdminImage(this.files[0], 'img-input-{safe_id}', '{item['key']}')">
                            </label>
                        </div>
                        <div class="img-status" id="img-upload-status-img-input-{safe_id}"></div>
                    </div>"""
        else:
            dining_html += f"""
                    <div class="edit-group"><label>{item['label']} <span class="lang-badge">EN</span></label>
                        <input type="text" data-edit-key="{item['key']}" data-edit-lang="en" data-edit-category="dining">
                    </div>
                    <div class="edit-group"><label>{item['label']} <span class="lang-badge">UZ</span></label>
                        <input type="text" data-edit-key="{item['key']}" data-edit-lang="uz" data-edit-category="dining">
                    </div>
                    <div class="edit-group"><label>{item['label']} <span class="lang-badge">RU</span></label>
                        <input type="text" data-edit-key="{item['key']}" data-edit-lang="ru" data-edit-category="dining">
                    </div>"""
    dining_html += """
                </div>"""

dining_html += """
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
"""

pages_html += """
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
"""

with open("d:/meroskhiva/Meros/Meros/admin_tabs.html", "w", encoding="utf-8") as f:
    f.write(pages_html + "\n" + dining_html)
print("Done")
