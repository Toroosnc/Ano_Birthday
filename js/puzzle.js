const puzzleConfig = {
    gridSize: 3,
    boardSize: 480
};

const puzzleCopy = {
    en: {
        upload: 'Choose a photo',
        uploadLabel: 'Choose a photo for the puzzle',
        canvasLabel: '3 by 3 photo puzzle for Ano',
        empty: 'Choose a photo to start the puzzle.',
        loading: fileName => `Getting ${fileName} ready...`,
        error: 'That photo could not be opened. Please try another one.',
        playing: 'Click a piece next to the empty space to move it.',
        success: 'Nice work, Ano! Puzzle solved.'
    },
    ja: {
        upload: '写真を選ぶ',
        uploadLabel: 'パズルに使う写真を選ぶ',
        canvasLabel: 'Anoの3×3フォトパズル',
        empty: '写真を選ぶとパズルが始まります。',
        loading: fileName => `${fileName}を読み込んでいます…`,
        error: '写真を開けませんでした。別の写真を選んでください。',
        playing: '空いているマスの隣のピースをクリックして動かします。',
        success: 'できたね、Ano！パズル完成！'
    }
};

let puzzleLanguage = window.siteLanguage || 'en';
let puzzleState = 'empty';
let puzzleFileName = '';

function setPuzzleLanguage(language) {
    puzzleLanguage = language;
    const copy = puzzleCopy[language];
    const uploadLabel = document.getElementById('puzzle-upload-label');
    const upload = document.getElementById('puzzle-upload');
    const canvas = document.getElementById('puzzle-canvas');
    const status = document.getElementById('puzzle-status');
    if (uploadLabel) uploadLabel.textContent = copy.upload;
    if (upload) upload.setAttribute('aria-label', copy.uploadLabel);
    if (canvas) canvas.setAttribute('aria-label', copy.canvasLabel);
    if (status) status.textContent = puzzleState === 'loading' ? copy.loading(puzzleFileName) : copy[puzzleState];
}

window.setPuzzleLanguage = setPuzzleLanguage;
document.addEventListener('site-language-change', event => setPuzzleLanguage(event.detail.language));

function initPuzzleContainer() {
    const container = document.getElementById('puzzle-container');
    if (!container) return;

    container.innerHTML = `
        <label class="puzzle-upload-control" for="puzzle-upload">
            <span id="puzzle-upload-label">Choose a photo</span>
            <input id="puzzle-upload" type="file" accept="image/*" aria-label="Choose a photo for the puzzle">
        </label>
        <canvas id="puzzle-canvas" width="${puzzleConfig.boardSize}" height="${puzzleConfig.boardSize}" aria-label="3 by 3 photo puzzle for Ano"></canvas>
        <p id="puzzle-status" aria-live="polite">Choose a photo to start the puzzle.</p>
    `;

    setPuzzleLanguage(puzzleLanguage);

    const upload = container.querySelector('#puzzle-upload');
    upload.addEventListener('change', () => {
        const file = upload.files?.[0];
        if (file) loadImageAndCreatePuzzle(file);
    });
}

function loadImageAndCreatePuzzle(file) {
    const reader = new FileReader();
    const status = document.getElementById('puzzle-status');
    puzzleFileName = file.name;
    puzzleState = 'loading';
    setPuzzleLanguage(puzzleLanguage);
    reader.addEventListener('error', () => {
        puzzleState = 'error';
        setPuzzleLanguage(puzzleLanguage);
    });
    reader.addEventListener('load', () => {
        const image = new Image();
        image.addEventListener('load', () => startPuzzle(image));
        image.addEventListener('error', () => {
            puzzleState = 'error';
            setPuzzleLanguage(puzzleLanguage);
        });
        image.src = reader.result;
    });
    reader.readAsDataURL(file);
}

function startPuzzle(image) {
    const canvas = document.getElementById('puzzle-canvas');
    const context = canvas.getContext('2d');
    const size = puzzleConfig.gridSize;
    const tiles = Array.from({ length: size * size }, (_, index) => index);
    let emptyIndex = tiles.length - 1;
    let previousIndex = -1;

    for (let move = 0; move < 40; move++) {
        const neighbors = getNeighbors(emptyIndex, size).filter(index => index !== previousIndex);
        const nextIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
        [tiles[emptyIndex], tiles[nextIndex]] = [tiles[nextIndex], tiles[emptyIndex]];
        previousIndex = emptyIndex;
        emptyIndex = nextIndex;
    }

    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceLeft = (image.naturalWidth - side) / 2;
    const sourceTop = (image.naturalHeight - side) / 2;
    const sourceTileSize = side / size;
    const tileSize = canvas.width / size;
    canvas.hidden = false;
    puzzleState = 'playing';

    function drawBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        tiles.forEach((tile, index) => {
            const x = (index % size) * tileSize;
            const y = Math.floor(index / size) * tileSize;
            if (tile === size * size - 1) {
                context.fillStyle = '#1A1A2E';
                context.fillRect(x, y, tileSize, tileSize);
            } else {
                const sourceX = sourceLeft + (tile % size) * sourceTileSize;
                const sourceY = sourceTop + Math.floor(tile / size) * sourceTileSize;
                context.drawImage(image, sourceX, sourceY, sourceTileSize, sourceTileSize, x, y, tileSize, tileSize);
            }
            context.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            context.lineWidth = 4;
            context.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
        });
    }

    canvas.onclick = event => {
        const bounds = canvas.getBoundingClientRect();
        const column = Math.floor((event.clientX - bounds.left) / bounds.width * size);
        const row = Math.floor((event.clientY - bounds.top) / bounds.height * size);
        const selectedIndex = row * size + column;
        if (!getNeighbors(emptyIndex, size).includes(selectedIndex)) return;

        [tiles[emptyIndex], tiles[selectedIndex]] = [tiles[selectedIndex], tiles[emptyIndex]];
        emptyIndex = selectedIndex;
        drawBoard();

        if (tiles.every((tile, index) => tile === index)) {
            puzzleState = 'success';
            setPuzzleLanguage(puzzleLanguage);
        }
    };

    setPuzzleLanguage(puzzleLanguage);
    drawBoard();
}

function getNeighbors(index, size) {
    const row = Math.floor(index / size);
    const column = index % size;
    return [
        ...(row > 0 ? [index - size] : []),
        ...(row < size - 1 ? [index + size] : []),
        ...(column > 0 ? [index - 1] : []),
        ...(column < size - 1 ? [index + 1] : [])
    ];
}

document.addEventListener('DOMContentLoaded', initPuzzleContainer);
