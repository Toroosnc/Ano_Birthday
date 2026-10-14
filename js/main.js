/* Main.js - Core Interactive Features for Ano's Japanese Birthday Website */
/* Orchestrates all animations and interactions with the name "Ano" prominently featured */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initTypewriter();
    initSakuraEffect();
    initPolaroidGallery();
});

// ============ Typewriter Effect ============
function initTypewriter() {
    const typewriterEl = document.querySelector('.typewriter');
    if (!typewriterEl) return;

    let typingTimer;
    function typeGreeting(language) {
        clearTimeout(typingTimer);
        const text = language === 'ja' ? 'Anoへ、ちょっとしたサプライズ。' : 'A little surprise, just for you.';
        let charIndex = 0;
        typewriterEl.textContent = '';

        function typeChar() {
            if (charIndex < text.length) {
                typewriterEl.textContent += text.charAt(charIndex);
                charIndex++;
                typingTimer = setTimeout(typeChar, 80);
            }
        }

        typeChar();
    }

    document.addEventListener('site-language-change', event => typeGreeting(event.detail.language));
    typeGreeting(window.siteLanguage || 'en');
}

// ============ Background Music Toggle ============
function initBackgroundMusic() {
    const musicToggle = document.getElementById('music-toggle');
    if (!musicToggle) return;
    
    // Create audio element
    const bgMusic = new Audio();
    // Using a MIDI-inspired sound theme for Japanese aesthetic
    bgMusic.src = 'data:audio/midi;base64,placeholder';
    bgMusic.loop = true;
    bgMusic.volume = 0.25;
    
    let isPlaying = false;
    
    musicToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            bgMusic.play().catch(e => {
                console.log('Autoplay prevented:', e);
                isPlaying = false;
                musicToggle.textContent = '🎵';
                musicToggle.title = 'Background music';
            });
            musicToggle.textContent = '🔇';
            musicToggle.title = 'Pause background music';
        } else {
            bgMusic.pause();
            musicToggle.textContent = '🎵';
            musicToggle.title = 'Background music';
        }
    });
}

// ============ Origami Letter Envelope ============
function initOrigamiLetter() {
    const letterEl = document.querySelector('.origami-letter');
    const toggle = document.getElementById('origami-toggle');
    if (!letterEl || !toggle) return;
    const toggleLabel = toggle.querySelector('.origami-toggle-label');
    
    let isUnfolded = false;
    
    toggle.addEventListener('click', () => {
        isUnfolded = !isUnfolded;
        toggle.setAttribute('aria-expanded', String(isUnfolded));
        if (toggleLabel) toggleLabel.textContent = isUnfolded ? 'Tutup surat' : 'Buka surat untuk Ano';
        letterEl.classList.toggle('unfolded', isUnfolded);
        
        if (isUnfolded) {
            const message = document.createElement('div');
            message.className = 'letter-message';
            message.style.padding = '30px';
            message.style.color = '#1A1A2E';
            message.style.fontFamily = 'Noto Serif, serif';
            message.style.lineHeight = '1.8';
            const heading = document.createElement('h3');
            heading.textContent = 'Untuk Ano, di hari istimewamu';
            const note = document.createElement('p');
            note.textContent = 'Semoga hari ini ada banyak hal kecil yang bikin kamu senang, waktu untuk melakukan yang kamu suka, dan orang-orang yang ingin kamu ajak tertawa. Selamat ulang tahun. Semoga tahun ini baik padamu.';
            message.append(heading, note);
            
            letterEl.appendChild(message);
            createUnfoldingPetals();
            setTimeout(triggerConfetti, 500, 'pink');
        } else {
            letterEl.querySelector('.letter-message')?.remove();
        }
    });
}

// Create petals when letter unfolds
function createUnfoldingPetals() {
    const colors = ['#FFB7C5', '#FF6B6B', '#FFB347', '#D4AF37'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const petal = document.createElement('span');
            petal.style.position = 'fixed';
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.top = '-20px';
            petal.style.color = colors[Math.floor(Math.random() * colors.length)];
            petal.style.fontSize = `${Math.random() * 15 + 10}px`;
            petal.style.pointerEvents = 'none';
            petal.style.textShadow = '0 0 5px currentColor';
            petal.innerHTML = '🌸';
            
            document.body.appendChild(petal);
            
            // Animate fall with spring physics
            const startY = -20;
            const duration = 3500;
            const startTime = Date.now();
            
            const animate = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    clearInterval(animate);
                    document.body.removeChild(petal);
                } else {
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    petal.style.transform = `translateY(${startY + 800 * easeOut}px) rotate(${progress * 360}deg)`;
                    petal.style.opacity = 1 - easeOut * 0.5;
                }
            }, 16);
        }, i * 70);
    }
}

// ============ Ema Wish Tree ============
function initEmaTree() {
    const wishForm = document.createElement('div');
    wishForm.id = 'ema-form';
    wishForm.style.maxWidth = '450px';
    wishForm.style.margin = '30px auto';
    wishForm.style.padding = '30px';
    wishForm.style.background = 'rgba(245, 240, 232, 0.95)';
    wishForm.style.borderRadius = '20px';
    wishForm.style.border = '1px solid rgba(255, 183, 197, 0.3)';
    wishForm.style.color = '#1A1A2E';
    wishForm.style.fontFamily = 'Noto Serif, serif';
    wishForm.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    
    wishForm.innerHTML = `
        <h3 style="color: #FFB7C5; margin-bottom: 20px; font-family: 'Playfair Display', serif;">🗾 Tulis doa untuk Ano</h3>
        <div style="background: #FAFAF0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <input type="text" id="wish-input" placeholder="Semoga tahun ini..." 
                   style="width: 100%; padding: 12px; border: 1px solid rgba(255, 183, 197, 0.3); border-radius: 8px; 
                          background: #FFFFFF; color: #1A1A2E; font-family: 'Noto Serif', serif; font-size: 1rem;">
        </div>
        <button id="submit-wish" style="width: 100%; padding: 12px; 
                     background: linear-gradient(135deg, #FFB7C5, #FF6B6B);
                     color: #1A1A2E; border: none; border-radius: 8px;
                     font-weight: 600; cursor: pointer; font-family: 'Playfair Display', serif;">
            Gantung doa
        </button>
    `;
    
    const emaSection = document.querySelector('.ema-section');
    const emaTree = document.querySelector('.ema-tree');
    if (emaSection && emaTree) {
        emaSection.insertBefore(wishForm, emaTree);
    }

    const wishInput = document.getElementById('wish-input');
    const submitBtn = document.getElementById('submit-wish');
    if (!wishInput || !submitBtn) return;
    
    submitBtn.addEventListener('click', () => {
        const wishText = wishInput.value.trim();
        if (wishText) {
            addWish(wishText);
            wishInput.value = '';
            wishInput.placeholder = 'Semoga tahun ini...';
        }
    });
    
    // Allow pressing Enter
    wishInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
    
    // Add form to page
}

// Add a wish to the tree
function addWish(wishText) {
    const wishCard = document.createElement('div');
    wishCard.className = 'ema-card';
    wishCard.style.background = 'rgba(255, 243, 245, 0.95)';
    wishCard.style.color = '#1A1A2E';
    wishCard.style.fontFamily = 'Noto Serif, serif';
    
    // Add rotation for variety
    const rotation = (Math.random() - 0.5) * 8;
    wishCard.style.transform = `rotate(${rotation}deg)`;
    wishCard.style.transition = 'transform 0.3s ease';
    
    const marker = document.createElement('strong');
    marker.textContent = '🌸';
    const wish = document.createElement('span');
    wish.className = 'wish-text';
    wish.textContent = wishText;
    wishCard.append(marker, wish);
    
    // Find the ema tree section and append
    const emaTree = document.querySelector('.ema-tree');
    if (emaTree) {
        emaTree.appendChild(wishCard);
        
        // Add confetti for new wish
        setTimeout(() => {
            triggerConfetti('purple');
        }, 200);
    } else {
        // Create tree section if it doesn't exist
        const treeSection = document.createElement('section');
        treeSection.className = 'ema-tree';
        treeSection.style.textAlign = 'center';
        treeSection.style.marginTop = '30px';
        
        const treeTitle = document.createElement('h2');
        treeTitle.textContent = '🗾 Ema Wish Tree for Ano';
        treeTitle.style.color = '#FFB7C5';
        treeTitle.style.marginBottom = '20px';
        treeTitle.style.fontFamily = 'Playfair Display, serif';
        
        treeSection.appendChild(wishCard);
        document.body.appendChild(treeSection);
    }
    
    // Gently animate the new wish
    setTimeout(() => {
        if (wishCard.parentNode) {
            wishCard.style.transform = `rotate(${rotation}deg) scale(1.05)`;
            setTimeout(() => {
                wishCard.style.transform = `rotate(${rotation}deg)`;
            }, 200);
        }
    }, 10);
}

// Create confetti for new wish
function createWishConfetti() {
    const colors = ['#FFB7C5', '#D4AF37', '#FF6B6B', '#4A90E2'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = `${Math.random() * 15 + 8}px`;
            confetti.style.height = `${Math.random() * 5 + 2}px`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-30px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = `${Math.random() > 0.5 ? '2px' : '0px'}`;
            confetti.style.pointerEvents = 'none';
            confetti.style.boxShadow = `0 0 10px ${confetti.style.background}`;
            const rotation = Math.random() * 360;
            
            document.body.appendChild(confetti);
            
            const startTime = Date.now();
            const duration = 2500;
            
            const animate = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    clearInterval(animate);
                    document.body.removeChild(confetti);
                } else {
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    confetti.style.transform = `translateY(${progress * 600 + 50}px) rotate(${progress * 360 + rotation}deg) scale(${1 - easeOut * 0.4})`;
                    confetti.style.opacity = 1 - easeOut;
                }
            }, 16);
        }, i * 40);
    }
}

function triggerConfetti() {
    createWishConfetti();
}

// ============ Sakura Canvas Effect ============
function initSakuraEffect() {
    // Already handled by sakura.js - just add a subtle interaction
    const canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        // Add click burst effect
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create a burst at click position
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createBurst(x, y);
                }, i * 100);
            }
        });
    }
}

// Create burst at click position
function createBurst(x, y) {
    const colors = ['#FFB7C5', '#FF6B6B', '#FFB347', '#D4AF37'];
    
    for (let i = 0; i < 8; i++) {
        const petal = document.createElement('span');
        petal.style.position = 'fixed';
        petal.style.left = `${x}px`;
        petal.style.top = `${y}px`;
        petal.style.color = colors[Math.floor(Math.random() * colors.length)];
        petal.style.fontSize = '12px';
        petal.style.pointerEvents = 'none';
        petal.innerHTML = '🌸';
        
        document.body.appendChild(petal);
        
        const startTime = Date.now();
        const duration = 1000;
        
        const animate = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                clearInterval(animate);
                document.body.removeChild(petal);
            } else {
                const easeOut = 1 - Math.pow(1 - progress, 2);
                petal.style.transform = `translateY(${progress * 100}px) rotate(${progress * 360}deg) scale(${1 - progress})`;
                petal.style.opacity = 1 - progress;
            }
        }, 16);
    }
}

// ============ Polaroid Gallery ============
function initPolaroidGallery() {
    const polaroids = document.querySelectorAll('.polaroid');
    
    polaroids.forEach((polaroid, index) => {
        // Stagger entrance
        polaroid.style.animation = `fade-in-up 0.6s ease-out forwards`;
        polaroid.style.animationDelay = `${index * 0.1}s`;
        
        polaroid.addEventListener('click', () => {
            polaroid.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            polaroid.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                polaroid.style.transform = 'scale(1)';
            }, 300);
        });
        
        polaroid.addEventListener('mouseenter', () => {
            polaroid.style.boxShadow = '0 15px 35px rgba(255, 183, 197, 0.4)';
        });
        
        polaroid.addEventListener('mouseleave', () => {
            polaroid.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
        });
    });
}

// ============ Omikuji Fortune Drawer ============
// This is handled by omikuji.js, but we add a nice entrance effect

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transition = 'opacity 0.5s ease';
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.disconnect();
            }
        });
    });
    
    observer.observe(section);
})

// ============ Scroll Reveal Enhancement ============
window.addEventListener('scroll', () => {
    const fadedElements = document.querySelectorAll('.fade-in-on-scroll');
    
    fadedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (elementTop < viewportHeight - 100 && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});