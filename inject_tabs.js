const fs = require('fs');

const adminHtmlPath = 'd:/meroskhiva/Meros/Meros/admin.html';
let adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');

const tabsHtml = fs.readFileSync('d:/meroskhiva/Meros/Meros/admin_tabs.html', 'utf8');

adminHtml = adminHtml.replace('        </div><!-- /#admin-dashboard -->', tabsHtml + '\n        </div><!-- /#admin-dashboard -->');

fs.writeFileSync(adminHtmlPath, adminHtml);
console.log('Appended tabs HTML successfully.');
