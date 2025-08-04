// Server Status and Statistics for MCNepal.fun

class ServerStatus {
    constructor() {
        this.serverIP = 'mcnepal.fun';
        this.serverPort = 25565;
        this.updateInterval = 30000; // 30 seconds
        this.maxRetries = 3;
        this.retryCount = 0;
        
        this.init();
    }

    init() {
        this.updateServerStatus();
        this.updatePlayerStats();
        this.startAutoUpdate();
        this.setupEventListeners();
    }

    async updateServerStatus() {
        try {
            // For demo purposes, we'll simulate server data
            // In production, you would call your actual server API
            const serverData = await this.fetchServerData();
            this.displayServerStatus(serverData);
            this.retryCount = 0;
        } catch (error) {
            console.error('Failed to fetch server status:', error);
            this.handleStatusError();
        }
    }

    async fetchServerData() {
        // Simulate API call - replace with actual server status API
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = {
                    online: true,
                    playersOnline: Math.floor(Math.random() * 15) + 3, // Random 3-18 players
                    maxPlayers: 20,
                    version: '1.21.8',
                    motd: '§b§l✦ §d§lMCNepal.fun §b§l✦ §r\\n§f§oWelcome to the adventure!',
                    uptime: '99.9%',
                    ping: Math.floor(Math.random() * 50) + 20, // Random 20-70ms ping
                    lastUpdate: new Date().toISOString()
                };
                resolve(mockData);
            }, 1000);
        });
    }

    displayServerStatus(data) {
        // Update online players
        const onlinePlayersElement = document.getElementById('online-players');
        if (onlinePlayersElement) {
            this.animateNumber(onlinePlayersElement, data.playersOnline);
        }

        // Update server status
        const serverStatusElement = document.getElementById('server-status');
        if (serverStatusElement) {
            serverStatusElement.textContent = data.online ? 'Online' : 'Offline';
            serverStatusElement.className = data.online ? 'status-online' : 'status-offline';
        }

        // Update uptime
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            uptimeElement.textContent = data.uptime;
        }

        // Update server info in hero section
        this.updateHeroStats(data);
        
        // Show connection quality indicator
        this.updateConnectionQuality(data.ping);
    }

    updateHeroStats(data) {
        // Update the server stats cards in hero section
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const statNumber = card.querySelector('.stat-number');
            const statLabel = card.querySelector('.stat-label');
            
            if (statLabel) {
                switch (statLabel.textContent) {
                    case 'Players Online':
                        this.animateNumber(statNumber, data.playersOnline);
                        break;
                    case 'Server Status':
                        statNumber.textContent = data.online ? 'Online' : 'Offline';
                        statNumber.style.color = data.online ? '#10b981' : '#ef4444';
                        break;
                    case 'Uptime':
                        statNumber.textContent = data.uptime;
                        break;
                }
            }
        });
    }

    updateConnectionQuality(ping) {
        let quality = 'excellent';
        let color = '#10b981';
        
        if (ping > 100) {
            quality = 'poor';
            color = '#ef4444';
        } else if (ping > 50) {
            quality = 'good';
            color = '#f59e0b';
        }

        // Add ping indicator to server info
        const serverInfo = document.querySelector('.server-info');
        if (serverInfo) {
            let pingElement = serverInfo.querySelector('.server-ping');
            if (!pingElement) {
                pingElement = document.createElement('div');
                pingElement.className = 'server-ping';
                serverInfo.appendChild(pingElement);
            }
            
            pingElement.innerHTML = `<strong>Ping:</strong> <span style="color: ${color}">${ping}ms (${quality})</span>`;
        }
    }

    animateNumber(element, targetNumber) {
        if (!element) return;
        
        const currentNumber = parseInt(element.textContent) || 0;
        const increment = targetNumber > currentNumber ? 1 : -1;
        let current = currentNumber;
        
        const animation = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetNumber) {
                clearInterval(animation);
            }
        }, 50);
    }

    handleStatusError() {
        this.retryCount++;
        
        if (this.retryCount <= this.maxRetries) {
            console.log(`Retrying server status update (${this.retryCount}/${this.maxRetries})`);
            setTimeout(() => this.updateServerStatus(), 5000);
            return;
        }

        // Show offline status
        const serverStatusElement = document.getElementById('server-status');
        if (serverStatusElement) {
            serverStatusElement.textContent = 'Offline';
            serverStatusElement.className = 'status-offline';
        }

        const onlinePlayersElement = document.getElementById('online-players');
        if (onlinePlayersElement) {
            onlinePlayersElement.textContent = '0';
        }

        // Show error notification
        if (window.MCNepal && window.MCNepal.showNotification) {
            window.MCNepal.showNotification('Unable to connect to server', 'error');
        }
    }

    async updatePlayerStats() {
        try {
            const statsData = await this.fetchPlayerStats();
            this.displayPlayerStats(statsData);
        } catch (error) {
            console.error('Failed to fetch player stats:', error);
        }
    }

    async fetchPlayerStats() {
        // Simulate API call for player statistics
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockStats = {
                    topBalances: [
                        { rank: 1, player: 'SherpaGaming', balance: '$50,750' },
                        { rank: 2, player: 'NepalBuilder', balance: '$42,300' },
                        { rank: 3, player: 'HimalayanMiner', balance: '$38,900' },
                        { rank: 4, player: 'KathmanduCrafter', balance: '$35,200' },
                        { rank: 5, player: 'EverestExplorer', balance: '$31,800' }
                    ],
                    topPlaytime: [
                        { rank: 1, player: 'SherpaGaming', playtime: '342h' },
                        { rank: 2, player: 'NepalBuilder', playtime: '298h' },
                        { rank: 3, player: 'HimalayanMiner', playtime: '276h' },
                        { rank: 4, player: 'KathmanduCrafter', playtime: '251h' },
                        { rank: 5, player: 'EverestExplorer', playtime: '234h' }
                    ],
                    topJobs: [
                        { rank: 1, player: 'HimalayanMiner', job: 'Miner', level: 'Level 45' },
                        { rank: 2, player: 'NepalBuilder', job: 'Builder', level: 'Level 38' },
                        { rank: 3, player: 'FarmingGuru', job: 'Farmer', level: 'Level 35' },
                        { rank: 4, player: 'HunterPro', job: 'Hunter', level: 'Level 32' },
                        { rank: 5, player: 'FishingMaster', job: 'Fisherman', level: 'Level 29' }
                    ]
                };
                resolve(mockStats);
            }, 800);
        });
    }

    displayPlayerStats(stats) {
        // Update balance leaderboard
        this.updateLeaderboard('balance-leaderboard', stats.topBalances, 'value');
        
        // Update playtime leaderboard
        this.updateLeaderboard('playtime-leaderboard', stats.topPlaytime, 'playtime');
        
        // Update jobs leaderboard
        this.updateLeaderboard('jobs-leaderboard', stats.topJobs, 'level');
    }

    updateLeaderboard(elementId, data, valueKey) {
        const leaderboard = document.getElementById(elementId);
        if (!leaderboard) return;

        leaderboard.innerHTML = '';

        data.forEach(item => {
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            
            let valueText = '';
            if (valueKey === 'value') {
                valueText = item.balance;
            } else if (valueKey === 'playtime') {
                valueText = item.playtime;
            } else if (valueKey === 'level') {
                valueText = item.level;
            }

            leaderboardItem.innerHTML = `
                <div class="rank">#${item.rank}</div>
                <div class="player">${item.player}</div>
                <div class="value">${valueText}</div>
            `;

            leaderboard.appendChild(leaderboardItem);

            // Add stagger animation
            leaderboardItem.style.opacity = '0';
            leaderboardItem.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                leaderboardItem.style.transition = 'all 0.3s ease';
                leaderboardItem.style.opacity = '1';
                leaderboardItem.style.transform = 'translateY(0)';
            }, item.rank * 100);
        });
    }

    startAutoUpdate() {
        setInterval(() => {
            this.updateServerStatus();
        }, this.updateInterval);

        // Update player stats less frequently
        setInterval(() => {
            this.updatePlayerStats();
        }, this.updateInterval * 2);
    }

    setupEventListeners() {
        // Refresh button (if exists)
        const refreshButton = document.getElementById('refresh-stats');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.updateServerStatus();
                this.updatePlayerStats();
                
                if (window.MCNepal && window.MCNepal.showNotification) {
                    window.MCNepal.showNotification('Statistics updated!', 'success');
                }
            });
        }

        // Auto-refresh when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateServerStatus();
            }
        });
    }

    // Public method to manually refresh data
    refresh() {
        this.updateServerStatus();
        this.updatePlayerStats();
    }
}

// Minecraft Server Status API Integration (Alternative approach)
class MinecraftServerAPI {
    constructor(serverIP, port = 25565) {
        this.serverIP = serverIP;
        this.port = port;
        this.apiUrl = `https://api.mcsrvstat.us/2/${serverIP}:${port}`;
    }

    async getServerStatus() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            
            return {
                online: data.online,
                playersOnline: data.players ? data.players.online : 0,
                maxPlayers: data.players ? data.players.max : 0,
                version: data.version,
                motd: data.motd ? data.motd.clean : '',
                icon: data.icon
            };
        } catch (error) {
            console.error('Error fetching server status:', error);
            throw error;
        }
    }
}

// Player Head Avatar System
class PlayerAvatars {
    static getPlayerHead(username, size = 32) {
        return `https://mc-heads.net/avatar/${username}/${size}`;
    }

    static getPlayerBody(username, size = 100) {
        return `https://mc-heads.net/body/${username}/${size}`;
    }

    static addAvatarsToLeaderboard() {
        const players = document.querySelectorAll('.leaderboard-item .player');
        players.forEach(playerElement => {
            const username = playerElement.textContent;
            const avatar = document.createElement('img');
            avatar.src = this.getPlayerHead(username, 24);
            avatar.alt = `${username}'s avatar`;
            avatar.style.cssText = `
                width: 24px;
                height: 24px;
                margin-right: 10px;
                border-radius: 4px;
                vertical-align: middle;
            `;
            
            playerElement.innerHTML = '';
            playerElement.appendChild(avatar);
            playerElement.appendChild(document.createTextNode(username));
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize server status
    window.serverStatus = new ServerStatus();
    
    // Add player avatars after stats load
    setTimeout(() => {
        PlayerAvatars.addAvatarsToLeaderboard();
    }, 2000);
});

// Export for use in other scripts
window.ServerStatus = ServerStatus;
window.MinecraftServerAPI = MinecraftServerAPI;
window.PlayerAvatars = PlayerAvatars;