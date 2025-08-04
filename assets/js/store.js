// Store functionality for MCNepal.fun

class MCNepalStore {
    constructor() {
        this.ranks = {
            'bronze': { price: 675, group: 'bronze', name: 'Bronze' },
            'silver': { price: 1350, group: 'silver', name: 'Silver' },
            'gold': { price: 2700, group: 'gold', name: 'Gold' },
            'diamond': { price: 4725, group: 'diamond', name: 'Diamond' },
            'elite': { price: 6750, group: 'elite', name: 'Elite' },
            'legend': { price: 10125, group: 'legend', name: 'Legend' },
            'champion': { price: 13500, group: 'champion', name: 'Champion' }
        };

        this.coinPackages = {
            1000: { price: 250, bonus: 0 },
            5000: { price: 1000, bonus: 500 },
            10000: { price: 1750, bonus: 1500 }
        };

        this.cart = [];
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCartFromStorage();
        this.setupPaymentModal();
    }

    setupEventListeners() {
        // Rank purchase buttons
        document.querySelectorAll('.rank-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const rankCard = e.target.closest('.rank-card');
                const rankClass = Array.from(rankCard.classList).find(cls => 
                    Object.keys(this.ranks).includes(cls)
                );
                if (rankClass) {
                    this.purchaseRank(rankClass);
                }
            });
        });

        // Coin purchase buttons
        document.querySelectorAll('.coin-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const coinPackage = e.target.closest('.coin-package');
                const amount = parseInt(coinPackage.querySelector('.coin-amount').textContent.replace(/[$,]/g, ''));
                this.purchaseCoins(amount);
            });
        });

        // Coffee support buttons
        document.querySelectorAll('.amount-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const amount = parseInt(e.target.textContent.replace(/[^\d]/g, ''));
                this.buyCoffee(amount);
            });
        });
    }

    purchaseRank(rankType) {
        if (this.isProcessing) return;
        
        const rank = this.ranks[rankType];
        if (!rank) {
            this.showError('Invalid rank selected');
            return;
        }

        this.showPlayerInputModal('rank', rank);
    }

    purchaseCoins(amount) {
        if (this.isProcessing) return;
        
        const package = this.coinPackages[amount];
        if (!package) {
            this.showError('Invalid coin package selected');
            return;
        }

        this.showPlayerInputModal('coins', { amount, ...package });
    }

    buyCoffee(amount) {
        if (this.isProcessing) return;
        
        // For coffee, we don't need player username
        this.processPayment('coffee', { amount, price: amount }, null);
    }

    showPlayerInputModal(type, item) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('player-input-modal');
        if (!modal) {
            modal = this.createPlayerInputModal();
        }

        // Update modal content
        const itemName = type === 'rank' ? item.name : `$${item.amount.toLocaleString()} Coins`;
        const itemPrice = `NPR ${item.price.toLocaleString()}`;

        modal.querySelector('.modal-item-name').textContent = itemName;
        modal.querySelector('.modal-item-price').textContent = itemPrice;
        modal.querySelector('#player-username').value = '';
        
        // Store item data
        modal.dataset.type = type;
        modal.dataset.item = JSON.stringify(item);

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Focus on input
        setTimeout(() => {
            modal.querySelector('#player-username').focus();
        }, 100);
    }

    createPlayerInputModal() {
        const modal = document.createElement('div');
        modal.id = 'player-input-modal';
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Purchase Confirmation</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="purchase-item">
                        <h4 class="modal-item-name">Item Name</h4>
                        <p class="modal-item-price">Price</p>
                    </div>
                    <form id="player-form">
                        <div class="form-group">
                            <label for="player-username">Minecraft Username:</label>
                            <input type="text" id="player-username" required 
                                   placeholder="Enter your Minecraft username" 
                                   pattern="[a-zA-Z0-9_]{3,16}" 
                                   title="Username must be 3-16 characters, letters, numbers, and underscores only">
                            <small>Make sure this is your exact Minecraft username</small>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-cancel">Cancel</button>
                            <button type="submit" class="btn-purchase">Proceed to Payment</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add styles
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            justify-content: center;
            align-items: center;
        `;

        document.body.appendChild(modal);

        // Setup modal event listeners
        this.setupModalEventListeners(modal);

        return modal;
    }

    setupModalEventListeners(modal) {
        // Close modal events
        const closeButtons = modal.querySelectorAll('.modal-close, .btn-cancel, .modal-overlay');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(modal));
        });

        // Form submission
        const form = modal.querySelector('#player-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(modal);
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeModal(modal);
            }
        });
    }

    handleFormSubmission(modal) {
        const username = modal.querySelector('#player-username').value.trim();
        const type = modal.dataset.type;
        const item = JSON.parse(modal.dataset.item);

        if (!this.validateUsername(username)) {
            this.showError('Please enter a valid Minecraft username (3-16 characters, letters, numbers, and underscores only)');
            return;
        }

        this.closeModal(modal);
        this.processPayment(type, item, username);
    }

    validateUsername(username) {
        const pattern = /^[a-zA-Z0-9_]{3,16}$/;
        return pattern.test(username);
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    processPayment(type, item, username) {
        this.isProcessing = true;
        
        // Show loading state
        this.showNotification('Preparing payment...', 'info');

        // Simulate payment processing
        setTimeout(() => {
            this.initiateEsewaPayment(type, item, username);
        }, 1000);
    }

    initiateEsewaPayment(type, item, username) {
        // Create transaction ID
        const transactionId = this.generateTransactionId();
        
        // Prepare eSewa payment data
        const paymentData = {
            amt: item.price,
            pdc: 0,
            psc: 0,
            txAmt: item.price,
            tAmt: item.price,
            pid: transactionId,
            scd: 'EPAYTEST', // Use your actual eSewa merchant code
            su: `https://www.mcnepal.fun/payment-success.html?type=${type}&item=${encodeURIComponent(JSON.stringify(item))}&user=${username}&tid=${transactionId}`,
            fu: `https://www.mcnepal.fun/payment-failed.html?tid=${transactionId}`
        };

        // Store transaction data
        this.storeTransaction(transactionId, type, item, username);

        // For demo purposes, show success message
        // In production, redirect to eSewa
        this.simulatePaymentSuccess(type, item, username, transactionId);
    }

    simulatePaymentSuccess(type, item, username, transactionId) {
        setTimeout(() => {
            this.isProcessing = false;
            
            let message = '';
            if (type === 'rank') {
                message = `${item.name} rank purchase successful! Check your in-game rank.`;
            } else if (type === 'coins') {
                message = `$${item.amount.toLocaleString()} coins added to your account!`;
            } else if (type === 'coffee') {
                message = `Thank you for your support! NPR ${item.amount} donation received.`;
            }

            this.showNotification(message, 'success', 5000);
            this.showTransactionSuccess(transactionId, type, item, username);
            
            // In production, send rank promotion command via RCON
            if (type === 'rank' && username) {
                this.promotePlayerRank(username, item.group);
            }
        }, 2000);
    }

    showTransactionSuccess(transactionId, type, item, username) {
        const successModal = document.createElement('div');
        successModal.className = 'success-modal';
        successModal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Payment Successful!</h3>
                <div class="transaction-details">
                    <p><strong>Transaction ID:</strong> ${transactionId}</p>
                    ${username ? `<p><strong>Username:</strong> ${username}</p>` : ''}
                    <p><strong>Item:</strong> ${type === 'rank' ? item.name + ' Rank' : type === 'coins' ? `$${item.amount.toLocaleString()} Coins` : 'Coffee Support'}</p>
                    <p><strong>Amount:</strong> NPR ${item.price.toLocaleString()}</p>
                </div>
                <div class="success-actions">
                    <button class="btn-close">Close</button>
                    <button class="btn-discord">Join Discord</button>
                </div>
            </div>
        `;

        successModal.style.cssText = `
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            justify-content: center;
            align-items: center;
        `;

        document.body.appendChild(successModal);

        // Event listeners
        successModal.querySelector('.btn-close').addEventListener('click', () => {
            document.body.removeChild(successModal);
        });

        successModal.querySelector('.btn-discord').addEventListener('click', () => {
            window.open('#', '_blank'); // Replace with actual Discord invite
        });

        // Auto close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(successModal)) {
                document.body.removeChild(successModal);
            }
        }, 10000);
    }

    promotePlayerRank(username, rankGroup) {
        // In production, this would send RCON command to server
        console.log(`Promoting ${username} to ${rankGroup} rank`);
        
        // Simulate RCON command
        const rconCommands = [
            `lp user ${username} parent set ${rankGroup}`,
            `broadcast ${username} has been promoted to ${rankGroup} rank!`,
            `tell ${username} Congratulations on your new rank! Use /rankinfo to see your perks.`
        ];

        console.log('RCON Commands:', rconCommands);
    }

    generateTransactionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `MCN_${timestamp}_${random}`.toUpperCase();
    }

    storeTransaction(transactionId, type, item, username) {
        const transaction = {
            id: transactionId,
            type: type,
            item: item,
            username: username,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Store in localStorage for demo
        const transactions = JSON.parse(localStorage.getItem('mcnepal_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('mcnepal_transactions', JSON.stringify(transactions));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('mcnepal_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCartToStorage() {
        localStorage.setItem('mcnepal_cart', JSON.stringify(this.cart));
    }

    showNotification(message, type = 'info', duration = 3000) {
        if (window.MCNepal && window.MCNepal.showNotification) {
            window.MCNepal.showNotification(message, type, duration);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    // Price formatting
    formatPrice(price) {
        return `NPR ${price.toLocaleString()}`;
    }

    formatCoins(amount) {
        return `$${amount.toLocaleString()}`;
    }
}

// Payment Modal Styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .payment-modal .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    }

    .payment-modal .modal-content {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        z-index: 1;
    }

    .payment-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .payment-modal .modal-header h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.5rem;
    }

    .payment-modal .modal-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .payment-modal .modal-close:hover {
        background: var(--border-color);
        color: var(--text-primary);
    }

    .payment-modal .modal-body {
        padding: 2rem;
    }

    .payment-modal .purchase-item {
        text-align: center;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 12px;
        border: 1px solid rgba(0, 212, 255, 0.2);
    }

    .payment-modal .modal-item-name {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .payment-modal .modal-item-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        font-family: var(--font-display);
        margin: 0;
    }

    .payment-modal .form-group {
        margin-bottom: 1.5rem;
    }

    .payment-modal .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        font-weight: 500;
    }

    .payment-modal .form-group input {
        width: 100%;
        padding: 1rem;
        background: var(--bg-darker);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .payment-modal .form-group input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
    }

    .payment-modal .form-group small {
        display: block;
        margin-top: 0.5rem;
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    .payment-modal .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
    }

    .payment-modal .btn-cancel,
    .payment-modal .btn-purchase {
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    .payment-modal .btn-cancel {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
    }

    .payment-modal .btn-cancel:hover {
        background: var(--border-color);
        color: var(--text-primary);
    }

    .payment-modal .btn-purchase {
        background: var(--gradient-primary);
        color: var(--text-primary);
    }

    .payment-modal .btn-purchase:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }

    .success-modal .success-content {
        text-align: center;
        padding: 3rem 2rem;
    }

    .success-modal .success-icon {
        font-size: 4rem;
        color: var(--success-color);
        margin-bottom: 1rem;
    }

    .success-modal .transaction-details {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 2rem 0;
        text-align: left;
    }

    .success-modal .transaction-details p {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }

    .success-modal .transaction-details strong {
        color: var(--text-primary);
    }

    .success-modal .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    .success-modal .btn-close,
    .success-modal .btn-discord {
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    .success-modal .btn-close {
        background: var(--border-color);
        color: var(--text-primary);
    }

    .success-modal .btn-discord {
        background: #5865f2;
        color: white;
    }

    .success-modal .btn-close:hover,
    .success-modal .btn-discord:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }

    @media (max-width: 768px) {
        .payment-modal .modal-content {
            width: 95%;
            margin: 1rem;
        }

        .payment-modal .modal-header,
        .payment-modal .modal-body {
            padding: 1.5rem;
        }

        .payment-modal .form-actions {
            flex-direction: column;
        }

        .success-modal .success-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(modalStyles);

// Global functions for onclick handlers
function purchaseRank(rankType) {
    if (window.mcnepalStore) {
        window.mcnepalStore.purchaseRank(rankType);
    }
}

function purchaseCoins(amount) {
    if (window.mcnepalStore) {
        window.mcnepalStore.purchaseCoins(amount);
    }
}

function buyCoffee(amount) {
    if (window.mcnepalStore) {
        window.mcnepalStore.buyCoffee(amount);
    }
}

// Initialize store when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.mcnepalStore = new MCNepalStore();
});

// Export for use in other scripts
window.MCNepalStore = MCNepalStore;