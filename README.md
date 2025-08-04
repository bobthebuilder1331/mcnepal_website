# MCNepal.fun - Ultimate Minecraft Server Website

A modern, responsive website for the MCNepal.fun Minecraft server (formerly NEPULSE SMP). Built with vanilla HTML, CSS, and JavaScript with advanced features including real-time server status, integrated store system, and comprehensive player statistics.

## 🌟 Features

### 🎮 Server Integration
- **Real-time Server Status** - Live player count and server status
- **Player Statistics** - Economy, playtime, and job leaderboards
- **Server Information** - Version, uptime, and connection quality

### 🛒 E-commerce System
- **Rank Store** - 7 different ranks with detailed perks
- **Coin Store** - In-game currency packages
- **eSewa Integration** - Nepal's digital wallet payment system
- **Transaction Management** - Secure payment processing

### 🎨 Modern Design
- **Responsive Design** - Works perfectly on all devices
- **Dark Theme** - Modern gaming aesthetic
- **Smooth Animations** - Engaging user interactions
- **Particle Effects** - Dynamic background animations

### 💰 Monetization Features
- **Rank Purchases** - Bronze to Champion ranks (NPR 675 - 13,500)
- **Server Coins** - Virtual currency packages
- **Buy Me a Coffee** - Developer support system
- **Secure Payments** - eSewa integration for Nepalese market

### 🚀 Performance Optimizations
- **Service Worker** - Offline functionality and caching
- **Lazy Loading** - Optimized image loading
- **Code Splitting** - Fast initial page load
- **Resource Optimization** - Minimized bundle sizes

## 📁 Project Structure

```
mcnepal_website/
├── index.html                 # Main HTML file
├── sw.js                     # Service Worker
├── README.md                 # This file
├── serverinfo.txt           # Server configuration details
└── assets/
    ├── css/
    │   ├── style.css        # Main stylesheet
    │   └── animations.css   # Animation definitions
    ├── js/
    │   ├── main.js          # Core functionality
    │   ├── particles-config.js # Particle effects
    │   ├── server-status.js # Server status management
    │   ├── store.js         # E-commerce functionality
    │   └── performance.js   # Performance optimizations
    └── images/
        └── server_icon.png  # Server icon and images
```

## 🎯 Server Details

### Server Information
- **Server IP**: mcnepal.fun
- **Version**: Paper 1.21.8
- **Max Players**: 20
- **Game Mode**: Survival SMP
- **Location**: Nepal

### Features Available
- **Economy System** - Starting balance: $90
- **Land Claims** - GriefPrevention protection
- **Jobs System** - 5 different jobs available
- **Player Auctions** - Player-to-player trading
- **Multiple Worlds** - Survival, Nether, End dimensions
- **Voting Rewards** - Support the server and get rewards

### Rank System
1. **Bronze** - NPR 675
2. **Silver** - NPR 1,350
3. **Gold** - NPR 2,700 (Most Popular)
4. **Diamond** - NPR 4,725
5. **Elite** - NPR 6,750
6. **Legend** - NPR 10,125
7. **Champion** - NPR 13,500

## 🛠️ Technical Specifications

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Animations**: CSS Animations, Intersection Observer API
- **Performance**: Service Worker, Lazy Loading, Resource Hints
- **Payment**: eSewa API Integration
- **Server Communication**: REST APIs, RCON integration

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1

## 🚀 Installation & Setup

### Prerequisites
- Web server (Apache, Nginx, or similar)
- Modern web browser
- eSewa merchant account (for payments)

### Quick Start
1. Clone or download the website files
2. Place files in your web server directory
3. Update server IP and eSewa credentials
4. Configure API endpoints for server data
5. Test all functionality

### Configuration
1. Update server IP in `assets/js/server-status.js`
2. Configure eSewa credentials in `assets/js/store.js`
3. Set up server API endpoints for live data
4. Update Discord and social media links

## 📊 Server Statistics Integration

The website integrates with multiple server plugins:

### Database Connections
- **LuckPerms** - Player permissions and ranks
- **BetterEconomy** - Player balances
- **Jobs** - Job levels and progression
- **CoreProtect** - Server activity logs
- **PlayTime** - Player activity tracking

### API Endpoints
- `GET /api/server/status` - Server status and player count
- `GET /api/player/{uuid}` - Individual player statistics
- `GET /api/economy/top` - Top player balances
- `POST /api/purchase/rank` - Rank purchase processing

## 💳 Payment Integration

### eSewa Configuration
The website includes complete eSewa integration for the Nepalese market:

- Secure payment processing
- Transaction verification
- Automatic rank promotion via RCON
- Purchase history tracking
- Refund handling

### Supported Payment Methods
- eSewa Digital Wallet
- Bank transfers (via eSewa)
- Mobile banking (via eSewa)

## 🎨 Customization

### Color Scheme
The website uses CSS custom properties for easy theming:
- Primary: `#00d4ff` (Cyan)
- Secondary: `#ff6b35` (Orange)
- Accent: `#7c3aed` (Purple)
- Background: `#0a0a0f` (Dark)

### Fonts
- **Display Font**: Orbitron (futuristic, gaming feel)
- **Body Font**: Inter (clean, readable)

### Animations
- Particle background effects
- Smooth scroll animations
- Hover interactions
- Loading states

## 📱 Mobile Optimization

- Fully responsive design
- Touch-friendly interface
- Optimized images for mobile
- Fast loading on slow connections
- Mobile-specific animations

## 🔒 Security Features

- Input validation and sanitization
- CSRF protection for forms
- Secure payment processing
- Rate limiting for API calls
- Error handling and logging

## 📈 SEO Optimization

- Semantic HTML structure
- Meta tags and Open Graph
- Structured data markup
- Optimized images with alt text
- Fast loading speeds
- Mobile-friendly design

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- **Discord**: Join our server community
- **Email**: Contact the development team
- **Website**: Visit www.mcnepal.fun for more information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- MCNepal.fun server community
- Contributors and testers
- Plugin developers
- Design inspiration from leading Minecraft servers

---

**MCNepal.fun** - *The Ultimate Minecraft SMP Experience in Nepal*

Built with ❤️ for the Minecraft community
