// Japan Post Digital Address API integration
class DigitalAddressService {
    constructor() {
        this.baseUrl = 'https://guide-biz.da.pf.japanpost.jp/api';
        this.endpoints = {
            search: '/search/address'
        };
    }

    async searchAddress(digitalAddress) {
        try {
            // Clean and validate input
            const cleanAddress = digitalAddress.trim();
            if (!cleanAddress) {
                throw new Error('デジタルアドレスを入力してください');
            }

            // For demonstration purposes, since the actual API might require authentication,
            // we'll simulate the API response format based on Japan Post documentation
            // In a real implementation, you would make an actual HTTP request:
            
            /*
            const response = await fetch(`${this.baseUrl}${this.endpoints.search}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY' // If required
                },
                body: JSON.stringify({
                    digitalAddress: cleanAddress
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
            */

            // Simulated response for demonstration
            // This simulates what the Japan Post API would return
            return await this.simulateApiResponse(cleanAddress);

        } catch (error) {
            throw new Error(`検索エラー: ${error.message}`);
        }
    }

    // Simulation method for demonstration purposes
    async simulateApiResponse(digitalAddress) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Simple pattern matching for common addresses (for demo)
        const mockResponses = {
            '東京都新宿区西新宿2-8-1': {
                postalCode: '163-8001',
                address: '東京都新宿区西新宿二丁目8番1号',
                digitalAddress: '東京都新宿区西新宿2-8-1'
            },
            '大阪府大阪市北区梅田1-1-1': {
                postalCode: '530-0001',
                address: '大阪府大阪市北区梅田一丁目1番1号',
                digitalAddress: '大阪府大阪市北区梅田1-1-1'
            },
            '神奈川県横浜市西区みなとみらい2-2-1': {
                postalCode: '220-8120',
                address: '神奈川県横浜市西区みなとみらい二丁目2番1号',
                digitalAddress: '神奈川県横浜市西区みなとみらい2-2-1'
            }
        };

        // Check for exact match first
        if (mockResponses[digitalAddress]) {
            return {
                success: true,
                data: mockResponses[digitalAddress]
            };
        }

        // Simple partial matching for demonstration
        for (const [key, value] of Object.entries(mockResponses)) {
            if (digitalAddress.includes(key.split('市')[0] + '市') || 
                digitalAddress.includes(key.split('区')[0] + '区') ||
                digitalAddress.includes(key.split('県')[0] + '県')) {
                
                return {
                    success: true,
                    data: {
                        ...value,
                        digitalAddress: digitalAddress,
                        // Modify postal code slightly to show it's different
                        postalCode: value.postalCode.slice(0, -1) + (parseInt(value.postalCode.slice(-1)) + 1)
                    }
                };
            }
        }

        // If no match found, return error
        throw new Error('指定されたデジタルアドレスが見つかりませんでした。正しいアドレスを入力してください。');
    }
}

// UI Controller
class UIController {
    constructor() {
        this.digitalAddressInput = document.getElementById('digitalAddress');
        this.searchBtn = document.getElementById('searchBtn');
        this.loading = document.getElementById('loading');
        this.results = document.getElementById('results');
        this.error = document.getElementById('error');
        this.postalCode = document.getElementById('postalCode');
        this.address = document.getElementById('address');
        this.digitalAddressResult = document.getElementById('digitalAddressResult');
        this.errorMessage = document.getElementById('errorMessage');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Enter key support
        this.digitalAddressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.searchBtn.disabled) {
                searchAddress();
            }
        });

        // Auto-hide error/results when typing
        this.digitalAddressInput.addEventListener('input', () => {
            this.hideError();
            this.hideResults();
        });
    }

    showLoading() {
        this.loading.style.display = 'flex';
        this.searchBtn.disabled = true;
        this.searchBtn.textContent = '検索中...';
        this.hideError();
        this.hideResults();
    }

    hideLoading() {
        this.loading.style.display = 'none';
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = '検索';
    }

    showResults(data) {
        this.postalCode.textContent = data.postalCode || '-';
        this.address.textContent = data.address || '-';
        this.digitalAddressResult.textContent = data.digitalAddress || '-';
        
        this.results.style.display = 'block';
        this.hideError();

        // Smooth scroll to results
        this.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    hideResults() {
        this.results.style.display = 'none';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.error.style.display = 'block';
        this.hideResults();

        // Smooth scroll to error
        this.error.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    hideError() {
        this.error.style.display = 'none';
    }

    getDigitalAddress() {
        return this.digitalAddressInput.value.trim();
    }
}

// Global instances
const digitalAddressService = new DigitalAddressService();
const uiController = new UIController();

// Global search function
async function searchAddress() {
    const digitalAddress = uiController.getDigitalAddress();
    
    if (!digitalAddress) {
        uiController.showError('デジタルアドレスを入力してください');
        return;
    }

    try {
        uiController.showLoading();
        
        const result = await digitalAddressService.searchAddress(digitalAddress);
        
        if (result.success && result.data) {
            uiController.showResults(result.data);
        } else {
            uiController.showError('検索結果が見つかりませんでした');
        }
        
    } catch (error) {
        console.error('Search error:', error);
        uiController.showError(error.message || '検索中にエラーが発生しました');
    } finally {
        uiController.hideLoading();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('デジタルアドレス検索サービスを開始しました');
    
    // Focus on input field
    uiController.digitalAddressInput.focus();
});