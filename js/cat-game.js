const catGameCopy = {
    en: {
        intro: 'Help the kitty catch falling treats. Move with the arrow keys or drag on the screen.',
        treats: 'Treats',
        missed: 'Missed',
        ready: 'Ready when you are!',
        playing: 'Catch the treats!',
        over: score => score === 0
            ? 'The treats got away! Give it another try.'
            : `Paw-some! You caught ${score} treat${score === 1 ? '' : 's'}.`,
        play: 'Play',
        again: 'Play again',
        canvas: 'Cat snack-catching game'
    },
    ja: {
        intro: '落ちてくるおやつを猫ちゃんにキャッチさせよう。矢印キーか画面をドラッグして動かしてね。',
        treats: 'おやつ',
        missed: '見逃し',
        ready: '準備ができたらスタート！',
        playing: 'おやつをキャッチ！',
        over: score => score === 0
            ? 'あれれ、おやつを逃しちゃった！もう一度挑戦してね。'
            : `すごい！おやつを${score}個キャッチしたよ。`,
        play: 'スタート',
        again: 'もう一度遊ぶ',
        canvas: '猫のおやつキャッチゲーム'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cat-game-canvas');
    const startButton = document.getElementById('cat-game-start');
    const status = document.getElementById('cat-game-status');
    const scoreElement = document.getElementById('cat-score');
    const missesElement = document.getElementById('cat-misses');
    const intro = document.getElementById('cat-game-intro');
    const scoreLabel = document.getElementById('cat-score-label');
    const missesLabel = document.getElementById('cat-misses-label');
    if (!canvas || !startButton || !status || !scoreElement || !missesElement) return;

    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const game = {
        language: window.siteLanguage || 'en',
        running: false,
        score: 0,
        misses: 0,
        catX: width / 2,
        treats: [],
        spawnElapsed: 0,
        lastFrame: 0,
        animationFrame: 0
    };

    function updateLanguage(language) {
        game.language = language;
        const copy = catGameCopy[language];
        intro.textContent = copy.intro;
        scoreLabel.textContent = copy.treats;
        missesLabel.textContent = copy.missed;
        canvas.setAttribute('aria-label', copy.canvas);
        status.textContent = game.running ? copy.playing : game.misses >= 3 ? copy.over(game.score) : copy.ready;
        startButton.textContent = game.misses >= 3 ? copy.again : copy.play;
    }

    function drawBackground() {
        const gradient = context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#29283d');
        gradient.addColorStop(1, '#484158');
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        for (let index = 0; index < 28; index++) {
            const x = (index * 137 + 43) % width;
            const y = (index * 61 + 27) % 245;
            context.fillStyle = index % 4 === 0 ? 'rgba(255, 220, 151, .75)' : 'rgba(255, 255, 255, .3)';
            context.beginPath();
            context.arc(x, y, index % 4 === 0 ? 2 : 1.2, 0, Math.PI * 2);
            context.fill();
        }

        context.fillStyle = '#52674f';
        context.beginPath();
        context.ellipse(width / 2, height + 20, width * 0.58, 62, 0, Math.PI, Math.PI * 2);
        context.fill();
        context.fillStyle = '#71815c';
        context.fillRect(0, height - 15, width, 15);
    }

    function drawCat(x, y) {
        context.save();
        context.translate(x, y);

        context.strokeStyle = '#f2a5a7';
        context.lineWidth = 9;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(24, 20);
        context.bezierCurveTo(54, 30, 48, -10, 30, -15);
        context.stroke();

        context.fillStyle = '#f4d7ba';
        context.beginPath();
        context.ellipse(0, 23, 34, 31, 0, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = '#f8e2c8';
        context.beginPath();
        context.arc(0, 0, 27, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = '#f8e2c8';
        context.beginPath();
        context.moveTo(-22, -16);
        context.lineTo(-20, -45);
        context.lineTo(-3, -26);
        context.closePath();
        context.moveTo(22, -16);
        context.lineTo(20, -45);
        context.lineTo(3, -26);
        context.closePath();
        context.fill();

        context.fillStyle = '#d78385';
        context.beginPath();
        context.moveTo(-18, -23);
        context.lineTo(-19, -38);
        context.lineTo(-9, -27);
        context.closePath();
        context.moveTo(18, -23);
        context.lineTo(19, -38);
        context.lineTo(9, -27);
        context.closePath();
        context.fill();

        context.fillStyle = '#46504a';
        context.beginPath();
        context.ellipse(-9, -2, 3, 5, 0, 0, Math.PI * 2);
        context.ellipse(9, -2, 3, 5, 0, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = '#d78385';
        context.beginPath();
        context.moveTo(-4, 7);
        context.lineTo(4, 7);
        context.lineTo(0, 11);
        context.closePath();
        context.fill();

        context.strokeStyle = '#765c58';
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(0, 11);
        context.quadraticCurveTo(-2, 17, -7, 14);
        context.moveTo(0, 11);
        context.quadraticCurveTo(2, 17, 7, 14);
        context.moveTo(-17, 8);
        context.lineTo(-32, 5);
        context.moveTo(-17, 12);
        context.lineTo(-31, 14);
        context.moveTo(17, 8);
        context.lineTo(32, 5);
        context.moveTo(17, 12);
        context.lineTo(31, 14);
        context.stroke();

        context.fillStyle = '#f4d7ba';
        context.beginPath();
        context.ellipse(-15, 48, 13, 8, 0, 0, Math.PI * 2);
        context.ellipse(15, 48, 13, 8, 0, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }

    function drawTreat(treat) {
        context.save();
        context.translate(treat.x, treat.y);
        context.rotate(Math.sin(treat.spin) * 0.12);

        if (treat.type === 'fish') {
            context.fillStyle = '#f2a36b';
            context.beginPath();
            context.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
            context.fill();
            context.beginPath();
            context.moveTo(-17, 0);
            context.lineTo(-30, -10);
            context.lineTo(-30, 10);
            context.closePath();
            context.fill();
            context.fillStyle = '#493c43';
            context.beginPath();
            context.arc(11, -2, 2, 0, Math.PI * 2);
            context.fill();
            context.strokeStyle = '#cf7654';
            context.lineWidth = 1.5;
            context.beginPath();
            context.moveTo(-4, -8);
            context.lineTo(-4, 8);
            context.moveTo(3, -8);
            context.lineTo(3, 8);
            context.stroke();
        } else {
            context.fillStyle = '#e8c986';
            context.beginPath();
            context.arc(0, 0, 15, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = '#98624f';
            [[-6, -5], [5, -7], [7, 4], [-3, 6], [-9, 2]].forEach(([x, y]) => {
                context.beginPath();
                context.arc(x, y, 2, 0, Math.PI * 2);
                context.fill();
            });
        }

        context.restore();
    }

    function render() {
        drawBackground();
        game.treats.forEach(drawTreat);
        drawCat(game.catX, height - 73);
    }

    function endGame() {
        game.running = false;
        game.misses = 3;
        missesElement.textContent = '3 / 3';
        status.textContent = catGameCopy[game.language].over(game.score);
        startButton.textContent = catGameCopy[game.language].again;
        startButton.disabled = false;
        render();
    }

    function update(timestamp) {
        if (!game.running) return;
        const elapsed = Math.min(timestamp - game.lastFrame, 40);
        game.lastFrame = timestamp;
        game.spawnElapsed += elapsed;

        const spawnInterval = Math.max(380, 850 - game.score * 12);
        if (game.spawnElapsed >= spawnInterval) {
            game.spawnElapsed = 0;
            game.treats.push({
                x: 28 + Math.random() * (width - 56),
                y: -24,
                speed: 1.6 + Math.random() * 1.3 + game.score * 0.025,
                spin: Math.random() * Math.PI * 2,
                type: Math.random() > 0.4 ? 'fish' : 'cookie'
            });
        }

        const catY = height - 73;
        game.treats = game.treats.filter(treat => {
            treat.y += treat.speed * (elapsed / 16.67);
            treat.spin += 0.035;
            if (treat.y > catY - 8 && treat.y < catY + 45 && Math.abs(treat.x - game.catX) < 43) {
                game.score += 1;
                scoreElement.textContent = String(game.score);
                return false;
            }
            if (treat.y > height + 20) {
                game.misses += 1;
                missesElement.textContent = `${game.misses} / 3`;
                return false;
            }
            return true;
        });

        if (game.misses >= 3) {
            endGame();
            return;
        }

        render();
        game.animationFrame = requestAnimationFrame(update);
    }

    function moveCatFromPointer(event) {
        const bounds = canvas.getBoundingClientRect();
        const scale = width / bounds.width;
        game.catX = Math.max(40, Math.min(width - 40, (event.clientX - bounds.left) * scale));
    }

    canvas.addEventListener('pointerdown', event => {
        canvas.focus({ preventScroll: true });
        moveCatFromPointer(event);
        if (event.pointerType !== 'mouse') event.preventDefault();
    });
    canvas.addEventListener('pointermove', event => {
        if (event.buttons || event.pointerType === 'touch') moveCatFromPointer(event);
    });
    canvas.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key)) return;
        event.preventDefault();
        const direction = ['ArrowLeft', 'a', 'A'].includes(event.key) ? -1 : 1;
        game.catX = Math.max(40, Math.min(width - 40, game.catX + direction * 28));
        if (!game.running) render();
    });

    startButton.addEventListener('click', () => {
        cancelAnimationFrame(game.animationFrame);
        game.running = true;
        game.score = 0;
        game.misses = 0;
        game.treats = [];
        game.spawnElapsed = 0;
        game.lastFrame = performance.now();
        scoreElement.textContent = '0';
        missesElement.textContent = '0 / 3';
        status.textContent = catGameCopy[game.language].playing;
        startButton.textContent = catGameCopy[game.language].again;
        startButton.disabled = true;
        canvas.focus({ preventScroll: true });
        game.animationFrame = requestAnimationFrame(update);
    });

    document.addEventListener('site-language-change', event => {
        updateLanguage(event.detail.language);
    });

    updateLanguage(game.language);
    render();
});
