/* Omikuji.js - Japanese Fortune Drawer for Ano's Birthday Website */
/* Draws sweet, positive fortunes (Daikichi - Great Fortune) */

// Fortune results with positive messages for Ano's birthday
const birthdayFortunes = [
    {
        rank: '大吉',
        displayRank: 'Daikichi · Great fortune',
        percentage: 35,
        message: 'This year is full of good things waiting to find you, Ano. ✨',
        messageJa: '今年は、Anoにたくさんの素敵なことが訪れますように。✨',
        color: '#FFB7C5',
        advice: 'Try one new thing you have been thinking about. There is no rush.',
        adviceJa: '気になっていたことを、一つ試してみて。焦らなくて大丈夫。'
    },
    {
        rank: '吉',
        displayRank: 'Kichi · Good fortune',
        percentage: 25,
        message: 'Good news can come from the smallest things today. 🌸',
        messageJa: '今日は、小さなことから嬉しい知らせが届きそう。🌸',
        color: '#FF6B6B',
        advice: 'Make time for the little things that make you feel at home.',
        adviceJa: 'ほっとできる、小さな楽しみを大切にしてね。'
    },
    {
        rank: '中吉',
        displayRank: 'Chūkichi · Fair fortune',
        percentage: 20,
        message: 'The things you have been working on are starting to find their way. 🌸',
        messageJa: '頑張ってきたことが、少しずつ形になり始めそう。🌸',
        color: '#FFB347',
        advice: 'Keep your own pace. Your path does not have to look like anyone else’s.',
        adviceJa: '自分のペースで大丈夫。あなたらしい道を進んでね。'
    },
    {
        rank: '小吉',
        displayRank: 'Shōkichi · Small fortune',
        percentage: 15,
        message: 'A quiet day can still bring something good. 🌸',
        messageJa: '穏やかな一日にも、素敵なことが待っていそう。🌸',
        color: '#FF6B6B',
        advice: 'Take a break when you need one. There is always tomorrow.',
        adviceJa: '疲れたらひと休み。明日もちゃんとやってくるよ。'
    },
    {
        rank: '末吉',
        displayRank: 'Suekichi · Fortune yet to come',
        percentage: 5,
        message: 'Something good is taking shape, even if you cannot see it yet. 🍀',
        messageJa: 'まだ見えなくても、いいことが少しずつ育っています。🍀',
        color: '#D4AF37',
        advice: 'Trust the small steps you are taking.',
        adviceJa: '今進んでいる、小さな一歩を信じてみて。'
    }
];

// Default fortune
const defaultFortune = {
    rank: '大吉',
    displayRank: 'Daikichi · Great fortune',
    message: 'May this year bring you plenty of days worth remembering. ✨',
    messageJa: '思い出に残る素敵な日が、たくさん訪れますように。✨',
    color: '#FFB7C5',
    advice: 'Start with one thing you are looking forward to.',
    adviceJa: '楽しみにしていることを、一つずつ始めてみよう。'
};

// Drawer state
let drawerElement = null;
let lastFortune = null;
let displayedFortune = defaultFortune;
let omikujiLanguage = window.siteLanguage || 'en';

function setOmikujiLanguage(language) {
    omikujiLanguage = language;
    const container = document.getElementById('omikuji-container');
    const rankDisplay = document.getElementById('omikuji-rank');
    const messageDisplay = document.getElementById('omikuji-message');
    const adviceTitle = document.getElementById('omikuji-advice-title');
    const adviceText = document.getElementById('omikuji-advice');
    const fortuneIdTag = document.getElementById('omikuji-id');
    const drawButton = document.getElementById('draw-btn');
    const resetButton = document.getElementById('reset-btn');
    if (!rankDisplay) return;

    const isJapanese = language === 'ja';
    if (container) container.lang = language;
    rankDisplay.textContent = isJapanese ? displayedFortune.rank : displayedFortune.displayRank;
    messageDisplay.textContent = isJapanese ? displayedFortune.messageJa : displayedFortune.message;
    adviceTitle.textContent = isJapanese ? '✨ Anoへのひとこと' : '✨ A little note for Ano';
    adviceText.textContent = isJapanese ? displayedFortune.adviceJa : displayedFortune.advice;
    fortuneIdTag.textContent = isJapanese
        ? `Anoのおみくじ · ${new Date().toLocaleDateString('ja-JP')}`
        : `Omikuji for Ano · ${new Date().toLocaleDateString('en-US')}`;
    drawButton.textContent = isJapanese ? '🎋 おみくじを引く' : '🎋 Draw a fortune';
    resetButton.textContent = isJapanese ? 'もう一度引く' : 'Draw again';
}

window.setOmikujiLanguage = setOmikujiLanguage;
document.addEventListener('site-language-change', event => setOmikujiLanguage(event.detail.language));

// Initialize omikuji drawer
function initOmikuji() {
    const container = document.getElementById('omikuji-container');
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = 'true';
    container.style.maxWidth = '550px';
    container.style.margin = '30px auto';
    container.style.padding = '50px 40px';
    container.style.background = 'rgba(26, 26, 46, 0.8)';
    container.style.borderRadius = '25px';
    container.style.border = '1px solid rgba(255, 183, 197, 0.2)';
    container.style.textAlign = 'center';
    container.style.color = 'var(--soft-white)';
    container.style.fontFamily = 'Noto Serif, serif';
    container.style.backdropFilter = 'blur(10px)';
    container.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
    
    // Fortune display area
    const fortuneArea = document.createElement('div');
    fortuneArea.style.marginBottom = '40px';
    fortuneArea.style.paddingBottom = '40px';
    fortuneArea.style.borderBottom = '1px solid rgba(255, 183, 197, 0.2)';
    
    const rankDisplay = document.createElement('div');
    rankDisplay.style.fontSize = 'clamp(1.1rem, 3.6vw, 1.8rem)';
    rankDisplay.style.fontWeight = '700';
    rankDisplay.style.marginBottom = '15px';
    rankDisplay.style.transition = 'color 0.5s ease, transform 0.3s ease';
    rankDisplay.style.userSelect = 'none';
    rankDisplay.style.lineHeight = '1.2';
    rankDisplay.id = 'omikuji-rank';
    rankDisplay.tabIndex = -1;
    
    const messageDisplay = document.createElement('p');
    messageDisplay.style.fontSize = '1.3rem';
    messageDisplay.style.lineHeight = '1.6';
    messageDisplay.style.minHeight = '80px';
    messageDisplay.style.opacity = '0';
    messageDisplay.style.transform = 'translateY(10px)';
    messageDisplay.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    messageDisplay.id = 'omikuji-message';
    
    fortuneArea.appendChild(rankDisplay);
    fortuneArea.appendChild(messageDisplay);
    
    // Advice section
    const adviceSection = document.createElement('div');
    adviceSection.style.margin = '30px 0';
    adviceSection.style.padding = '25px';
    adviceSection.style.background = 'rgba(255, 183, 197, 0.1)';
    adviceSection.style.borderRadius = '15px';
    adviceSection.style.border = '1px solid rgba(255, 183, 197, 0.2)';
    adviceSection.style.marginTop = '30px';
    
    const adviceTitle = document.createElement('h4');
    adviceTitle.style.color = '#D4AF37';
    adviceTitle.style.marginBottom = '15px';
    adviceTitle.style.fontSize = '1rem';
    adviceTitle.style.fontWeight = '600';
    adviceTitle.style.fontFamily = 'Playfair Display, serif';
    adviceTitle.id = 'omikuji-advice-title';
    
    const adviceText = document.createElement('p');
    adviceText.style.fontSize = '1rem';
    adviceText.style.lineHeight = '1.6';
    adviceText.style.color = '#FFFFFF';
    adviceText.id = 'omikuji-advice';
    
    const fortuneIdTag = document.createElement('p');
    fortuneIdTag.style.marginTop = '20px';
    fortuneIdTag.style.fontSize = '0.85rem';
    fortuneIdTag.style.color = 'rgba(255, 183, 197, 0.5)';
    fortuneIdTag.id = 'omikuji-id';
    fortuneIdTag.textContent = 'Omikuji for Ano';
    
    adviceSection.appendChild(adviceTitle);
    adviceSection.appendChild(adviceText);
    adviceSection.appendChild(fortuneIdTag);
    
    // Draw button - styled beautifully
    const drawBtn = document.createElement('button');
    drawBtn.id = 'draw-btn';
    drawBtn.style.width = '240px';
    drawBtn.style.padding = '18px 30px';
    drawBtn.style.background = 'linear-gradient(135deg, #FFB7C5, #FF6B6B)';
    drawBtn.style.color = '#1A1A2E';
    drawBtn.style.border = 'none';
    drawBtn.style.borderRadius = '30px';
    drawBtn.style.fontWeight = '600';
    drawBtn.style.fontSize = '1.1rem';
    drawBtn.style.fontFamily = 'Playfair Display, serif';
    drawBtn.style.cursor = 'pointer';
    drawBtn.style.boxShadow = '0 10px 30px rgba(255, 183, 197, 0.4)';
    drawBtn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    drawBtn.textContent = '🎋 Draw a fortune';
    
    drawBtn.addEventListener('mouseover', () => {
        drawBtn.style.transform = 'translateY(-3px) scale(1.02)';
        drawBtn.style.boxShadow = '0 20px 40px rgba(255, 183, 197, 0.5)';
    });
    
    drawBtn.addEventListener('mouseout', () => {
        drawBtn.style.transform = 'translateY(0) scale(1)';
        drawBtn.style.boxShadow = '0 10px 30px rgba(255, 183, 197, 0.4)';
    });
    
    drawBtn.addEventListener('mousedown', () => {
        drawBtn.style.transform = 'translateY(2px) scale(0.98)';
    });
    
    drawBtn.addEventListener('mouseup', () => {
        setTimeout(() => {
            drawBtn.style.transform = 'translateY(-3px) scale(1.02)';
        }, 100);
    });
    
    drawBtn.addEventListener('click', drawFortune);
    
    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-btn';
    resetBtn.style.marginTop = '25px';
    resetBtn.style.width = '140px';
    resetBtn.style.padding = '12px';
    resetBtn.style.background = 'rgba(255, 183, 197, 0.1)';
    resetBtn.style.color = '#FFB7C5';
    resetBtn.style.border = '1px solid rgba(255, 183, 197, 0.3)';
    resetBtn.style.borderRadius = '25px';
    resetBtn.style.fontSize = '0.95rem';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.fontFamily = 'Noto Serif, serif';
    resetBtn.textContent = 'Draw again';
    resetBtn.addEventListener('click', resetFortune);
    
    // Assemble
    container.appendChild(fortuneArea);
    container.appendChild(adviceSection);
    container.appendChild(drawBtn);
    container.appendChild(resetBtn);
    
    drawerElement = container;
    setOmikujiLanguage(omikujiLanguage);
    
    // Initial draw
    drawFortune(false);
}

// Draw a random fortune with animation
function drawFortune(showAnimation = true, isInitial = false) {
    // Weighted random selection
    const total = birthdayFortunes.reduce((sum, f) => sum + f.percentage, 0);
    const random = Math.random() * total;
    let cumulative = 0;
    
    let selected = birthdayFortunes[0];
    for (const fortune of birthdayFortunes) {
        cumulative += fortune.percentage;
        if (random <= cumulative) {
            selected = fortune;
            break;
        }
    }
    
    const previousFortune = lastFortune;
    lastFortune = selected;
    displayedFortune = selected;
    
    // Update DOM with animation
    const rankDisplay = document.querySelector('#omikuji-container #omikuji-rank');
    const messageDisplay = document.getElementById('omikuji-message');
    const adviceText = document.getElementById('omikuji-advice');
    const fortuneIdTag = document.getElementById('omikuji-id');
    
    // Animate rank change
    if (showAnimation && previousFortune && previousFortune !== selected) {
        // Flash old color -> new color
        rankDisplay.style.color = '#FF6B6B';
        setTimeout(() => {
            rankDisplay.style.color = selected.color;
            
            // Scale up effect
            rankDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                rankDisplay.style.transform = 'scale(1)';
            }, 300);
        }, 150);
    } else if (!showAnimation) {
        // Instant update for initial load
        rankDisplay.style.color = selected.color;
    }

    rankDisplay.textContent = omikujiLanguage === 'ja' ? selected.rank : selected.displayRank;
    
    // Show message with fade-in
    messageDisplay.style.opacity = '0';
    messageDisplay.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        messageDisplay.textContent = omikujiLanguage === 'ja' ? selected.messageJa : selected.message;
        messageDisplay.style.opacity = '1';
        messageDisplay.style.transform = 'translateY(0)';
    }, 100);
    
    // Update advice
    if (adviceText) {
        adviceText.textContent = omikujiLanguage === 'ja' ? selected.adviceJa : selected.advice;
    }
    if (fortuneIdTag) {
        fortuneIdTag.textContent = omikujiLanguage === 'ja'
            ? `Anoのおみくじ · ${new Date().toLocaleDateString('ja-JP')}`
            : `Omikuji for Ano · ${new Date().toLocaleDateString('en-US')}`;
    }
    
    // Add subtle pulse to the rank if it's Daikichi
    if (selected.rank === '大吉') {
        rankDisplay.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            rankDisplay.style.animation = '';
        }, 500);
    }
    
}

// Reset fortune to default
function resetFortune() {
    if (!lastFortune) return;
    
    displayedFortune = defaultFortune;
    lastFortune = null;
    setOmikujiLanguage(omikujiLanguage);

    const rankDisplay = document.querySelector('#omikuji-container #omikuji-rank');
    const messageDisplay = document.getElementById('omikuji-message');
    if (rankDisplay) rankDisplay.style.color = defaultFortune.color;
    if (messageDisplay) {
        messageDisplay.style.opacity = '0';
        messageDisplay.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            messageDisplay.style.opacity = '1';
            messageDisplay.style.transform = 'translateY(0)';
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', initOmikuji);

// Export for testing
window.drawFortune = drawFortune;
window.resetFortune = resetFortune;
window.initOmikuji = initOmikuji;