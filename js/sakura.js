/* Sakura.js - Premium Canvas-based Falling Cherry Blossom Animation */
/* Creates drifting sakura petals with wind variation for Ano's birthday website */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Sakura configuration
const sakuraSettings = {
    colors: ['#FFB7C5', '#FF6B6B', '#FFB347', '#D4AF37', '#FFE4C4'],
    minSize: 6,
    maxSize: 22,
    minSpeed: 1.5,
    maxSpeed: 3.5,
    windStrength: 0.3,
    petalCount: 30,
    bloomChance: 0.3, // Chance to create a 'bloom' cluster
    bloomSize: 5
};

if (prefersReducedMotion.matches) {
    console.log('Reduced motion mode - sakura animation disabled');
} else {
    initSakuraCanvas();
}

// Create canvas
function initSakuraCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'sakura-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Petal class
    class Petal {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Random type: single petal or bloomed cluster
            this.type = Math.random() < sakuraSettings.bloomChance ? 'bloom' : 'petal';
            
            if (this.type === 'bloom') {
                this.petals = []; // Will create a cluster
                // Create 3-5 petals for a bloom
                const clusterCount = Math.floor(Math.random() * 3) + 3;
                for (let i = 0; i < clusterCount; i++) {
                    this.petals.push({
                        size: Math.random() * (sakuraSettings.maxSize - sakuraSettings.minSize) + sakuraSettings.minSize,
                        angle: Math.random() * Math.PI * 2,
                        spread: (i / clusterCount) * Math.PI * 2,
                        offsetY: i * 8
                    });
                }
                this.baseSize = Math.max(...this.petals.map(p => p.size));
                this.width = this.baseSize * 2;
                this.height = this.baseSize * 2.5;
            } else {
                this.size = Math.random() * (sakuraSettings.maxSize - sakuraSettings.minSize) + sakuraSettings.minSize;
                this.width = this.size;
                this.height = this.size;
            }
            
            // Position - start off-screen
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            
            // Physics
            this.speed = Math.random() * (sakuraSettings.maxSpeed - sakuraSettings.minSpeed) + sakuraSettings.minSpeed;
            this.windOffset = Math.random() * sakuraSettings.windStrength;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.opacity = 1;
            this.bounce = 0;
        }
        
        update() {
            // Move down
            this.y += this.speed;
            
            // Apply wind
            this.x += Math.sin(this.y * this.windOffset + this.rotation) * 0.3;
            
            // Rotate
            this.rotation += this.rotationSpeed;
            
            // Bounce gently
            this.bounce += 0.05;
            
            // Reset if fallen off
            if (this.y > canvas.height + this.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            
            if (this.type === 'bloom') {
                // Draw bloomed cherry blossom cluster
                ctx.fillStyle = sakuraSettings.colors[Math.floor(Math.random() * sakuraSettings.colors.length)];
                
                for (const petal of this.petals) {
                    ctx.save();
                    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.rotate(petal.angle);
                    ctx.translate(0, -petal.offsetY);
                    
                    // Draw petal shape
                    ctx.beginPath();
                    // Petal shape - almond/heart shape
                    ctx.moveTo(0, -petal.size * 0.3);
                    ctx.bezierCurveTo(
                        petal.size * 0.2, petal.size * 0.1,
                        petal.size * 0.2, petal.size * 0.8,
                        0, petal.size * 0.5
                    );
                    ctx.bezierCurveTo(
                        -petal.size * 0.2, petal.size * 0.8,
                        -petal.size * 0.2, petal.size * 0.1,
                        0, -petal.size * 0.3
                    );
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
            } else {
                // Draw single falling petal
                ctx.fillStyle = sakuraSettings.colors[Math.floor(Math.random() * sakuraSettings.colors.length)];
                
                // Draw 5-petaled cherry blossom
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const petalAngle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                    const petalRadius = this.size * 0.5;
                    
                    ctx.moveTo(0, 0);
                    ctx.ellipse(
                        Math.cos(petalAngle) * petalRadius * 0.6,
                        Math.sin(petalAngle) * petalRadius * 0.6,
                        petalRadius * 0.4,
                        petalRadius * 0.8,
                        petalAngle,
                        0,
                        Math.PI * 2
                    );
                }
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    // Create petal pool
    const petalPool = [];
    for (let i = 0; i < sakuraSettings.petalCount; i++) {
        petalPool.push(new Petal());
    }
    
    // Animation loop
    let animationId;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petalPool.forEach(petal => {
            petal.update();
            petal.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Add burst of petals on user interaction
    function petalBurst() {
        const burstCount = 10;
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                const burstPetal = new Petal();
                petalPool.unshift(burstPetal);
                if (petalPool.length > sakuraSettings.petalCount + burstCount) {
                    petalPool.pop();
                }
            }, i * 100);
        }
    }
    
    // Trigger bursts on page interactions
    petalBurst();
    
    // Add occasional bursts
    setInterval(petalBurst, 5000);
    
    // Return canvas reference for potential external use
    return canvas;
}

// Export for testing/inspection
window.initSakuraCanvas = initSakuraCanvas;
window.sakuraSettings = sakuraSettings;