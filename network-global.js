//  <!-- Name: NetWork Global
// karesh: test con bodan site ha
// owner: Pixon ya Amirxander
// هر گونه کپی پیگیری قانونی داره
// donate bezan hal konim
// link donate: reymit/moditor -->
 document.addEventListener('DOMContentLoaded', function () {
            const urlInput = document.getElementById('urlInput');
            const checkBtn = document.getElementById('checkBtn');
            const resultsContainer = document.getElementById('resultsContainer');
            const statsCount = document.getElementById('statsCount');
            const onlineCountEl = document.getElementById('onlineCount');
            const offlineCountEl = document.getElementById('offlineCount');
            const totalChecksEl = document.getElementById('totalChecks');
            const presetSites = [
                { name: 'Google', url: 'https://google.com', icon: 'fab fa-google' },
                { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
                // { name: 'SyberTik', url: 'https://5.57.39.50', icon: 'fab fa-cammera' },
                { name: 'YouTube', url: 'https://youtube.com', icon: 'fab fa-youtube' },
                { name: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' },
                { name: 'Instagram', url: 'https://instagram.com', icon: 'fab fa-instagram' },
                { name: 'Digikala', url: 'https://digikala.com', icon: 'fas fa-shopping-cart' },
                { name: 'Wikipedia', url: 'https://wikipedia.org', icon: 'fab fa-wikipedia-w' },
                { name: 'StackOverflow', url: 'https://stackoverflow.com', icon: 'fab fa-stack-overflow' },
                { name: 'Varzesh3', url: 'https://varzesh3.com', icon: 'fas fa-futbol' },
                { name: 'Aparat', url: 'https://aparat.com', icon: 'fas fa-video' },
                { name: 'Divar', url: 'https://divar.ir', icon: 'fas fa-tag' },
                { name: 'Snapp', url: 'https://snapp.ir', icon: 'fas fa-car' }
            ];

            // Statistics html toy footer
            let stats = {
                online: 0,
                offline: 0,
                total: 0
            };

            // button icon site
            function initPresetButtons() {
                const presetContainer = document.getElementById('presetButtons');
                presetSites.forEach(site => {
                    const button = document.createElement('button');
                    button.className = 'preset-btn';
                    button.innerHTML = `<i class="${site.icon}"></i> ${site.name}`;
                    button.onclick = () => checkSiteStatus(site.url);
                    presetContainer.appendChild(button);
                });
            }

            // Check site shoma pishfarz
            function checkInitialSites() {
                const initialSites = [
                    'https://google.com',
                    'https://github.com',
                    'https://stackoverflow.com',
                    'https://digikala.com'
                ];

                resultsContainer.innerHTML = '';
                initialSites.forEach(site => checkSiteStatus(site));
            }

            // check status con
            async function checkSiteStatus(url) {
                const emptyState = resultsContainer.querySelector('.empty-state');
                if (emptyState) {
                    emptyState.remove();
                }

                // new loading site karbar
                const card = createSiteCard(url, 'در حال بررسی...', 'loading', 'fas fa-spinner fa-spin');
                resultsContainer.prepend(card);

                try {
                    // api (: هرگونه کپی از این سایت پیگیری میشه
                    const proxyUrl = 'https://api.allorigins.win/get?url=';
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000);

                    const response = await fetch(proxyUrl + encodeURIComponent(url), {
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (response.ok) {
                        updateSiteCard(card, url, 'فعال - اتصال برقرار شد ✓', 'online', 'fas fa-check-circle');
                        stats.online++;
                    } else {
                        updateSiteCard(card, url, 'غیرفعال - اتصال برقرار نشد ✗', 'offline', 'fas fa-times-circle');
                        stats.offline++;
                    }
                } catch (error) {
                    // try check
                    try {
                        const img = new Image();
                        const imgPromise = new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = url + '/favicon.ico?' + Date.now();
                            setTimeout(() => reject(new Error('Timeout')), 5000);
                        });

                        await imgPromise;
                        updateSiteCard(card, url, 'فعال - احتمال متصل شدن  ✓', 'online', 'fas fa-check-circle');
                        stats.online++;
                    } catch {
                        updateSiteCard(card, url, 'غیرفعال - اتصال برقرار نشد ✗', 'offline', 'fas fa-times-circle');
                        stats.offline++;
                    }
                } finally {
                    stats.total++;
                    updateStats();
                }
            }

            // Create site card url icon tatus
            function createSiteCard(url, status, statusClass, icon) {
                const card = document.createElement('div');
                card.className = `site-card ${statusClass}`;

                card.innerHTML = `
                    <div class="status-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="site-info">
                        <div class="site-url">${url}</div>
                        <div class="site-status">
                            <i class="${icon}" style="font-size: 0.9rem;"></i>
                            ${status}
                        </div>
                        
                    </div>
                `;

                return card;
            }

            // Update site card
            function updateSiteCard(card, url, status, statusClass, icon) {
                card.className = `site-card ${statusClass}`;

                const statusIcon = card.querySelector('.status-icon i');
                statusIcon.className = icon;

                const siteUrl = card.querySelector('.site-url');
                siteUrl.textContent = url;

                const siteStatus = card.querySelector('.site-status');
                siteStatus.innerHTML = `<i class="${icon}" style="font-size: 0.9rem;"></i> ${status}`;
            }

            // Update statistics
            function updateStats() {
                statsCount.textContent = `${stats.total} سایت`;
                onlineCountEl.textContent = stats.online;
                offlineCountEl.textContent = stats.offline;
                totalChecksEl.textContent = stats.total;
            }

            // Event listeners
            checkBtn.addEventListener('click', () => {
                const url = urlInput.value.trim();
                if (url) {
                    if (!url.startsWith('http')) {
                        urlInput.value = 'https://' + url;
                        checkSiteStatus('https://' + url);
                    } else {
                        checkSiteStatus(url);
                    }
                    urlInput.value = '';
                }
            });

            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    checkBtn.click();
                }
            });
            urlInput.addEventListener('focus', () => {
                urlInput.select();
            });

            
            initPresetButtons();
            checkInitialSites();
        });
        // Pixon = haji ino anti ddos va e secorty khob barash mizanam mizaram roy server 
//         <!-- Name: NetWork Global
// karesh: test con bodan site ha
// owner: Pixon ya Amirxander
// هر گونه کپی پیگیری قانونی داره
// donate bezan hal konim
// link donate: reymit/moditor -->
