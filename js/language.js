const pageTranslations = {
    en: {
        title: 'Otanjoubi Omedetou, Ano!',
        navHome: 'Home',
        navPuzzle: 'Puzzle',
        navCatGame: 'Cat game',
        navOmikuji: 'Omikuji',
        navRiddles: 'Riddles',
        navGallery: 'Gallery',
        languageLabel: 'Page language',
        heroTitle: 'Otanjoubi Omedetou, Ano!',
        birthdayDate: 'October 27',
        heroCopy: 'I made this little birthday corner just for you, Ano. Hope your day is full of your favorite things.',
        heroPuzzle: 'Solve the puzzle',
        heroGallery: 'See the gallery',
        puzzleTitle: 'A little puzzle for Ano',
        puzzleIntro: 'Choose a photo and put the pieces back together.',
        catGameTitle: 'Snack catcher',
        catGameIntro: 'Help the kitty catch falling treats. Move with the arrow keys or drag on the screen.',
        omikujiTitle: 'A little omikuji for Ano',
        omikujiIntro: 'One small fortune for the year ahead.',
        galleryTitle: "Ano's gallery",
        galleryIntro: 'A few little moments worth keeping.',
        birthdayKicker: 'One last thing',
        birthdayTitle: 'I love you, Ano.',
        birthdayMessage: 'Happy birthday! I hope you stay healthy and find success in everything ahead.',
        birthdayPromise: "We promised we'd watch the summer fireworks in Japan together. I don't know exactly when, but I'll keep doing my best so we can be there side by side.",
        roseTitle: 'A rose blooming for Ano',
        roseDescription: 'A pink rose slowly opens above two green leaves.',
        footer: 'Made just for You 🌸',
        footerGreeting: 'Otanjoubi omedetou!',
        imageAlt1: 'Two cloaked figures beside a glowing candle in a warm, sunlit forest',
        imageAlt2: 'A cloaked figure standing in a flowered field beneath a blue sky',
        imageAlt3: 'A tiny orange kitten resting on a cat tree',
        imageAlt4: 'Freshly baked pale green meringue cookies on a tray'
    },
    ja: {
        title: 'Ano、お誕生日おめでとう！',
        navHome: 'ホーム',
        navPuzzle: 'パズル',
        navCatGame: '猫ちゃんゲーム',
        navOmikuji: 'おみくじ',
        navRiddles: 'なぞなぞ',
        navGallery: 'ギャラリー',
        languageLabel: '表示言語',
        heroTitle: 'お誕生日おめでとう、Ano！',
        birthdayDate: '10月27日',
        heroCopy: 'Anoのために作った、小さなバースデーページ。好きなものに囲まれた一日になりますように。',
        heroPuzzle: 'パズルに挑戦',
        heroGallery: 'ギャラリーを見る',
        puzzleTitle: 'Anoへ、小さなパズル',
        puzzleIntro: '写真を選んで、ピースを元に戻そう。',
        catGameTitle: 'おやつキャッチ',
        catGameIntro: '落ちてくるおやつを猫ちゃんにキャッチさせよう。矢印キーか画面をドラッグして動かしてね。',
        omikujiTitle: 'Anoのおみくじ',
        omikujiIntro: 'これからの一年に、小さな運だめし。',
        galleryTitle: 'Anoのギャラリー',
        galleryIntro: '心に残しておきたい、小さな思い出。',
        birthdayKicker: '最後にもうひとつ',
        birthdayTitle: '大好きだよ、Ano。',
        birthdayMessage: 'お誕生日おめでとう！これからもずっと健康で、これから先もたくさんの成功に恵まれますように。',
        birthdayPromise: 'いつか一緒に日本の夏の花火を見ようって約束したよね。いつになるかはまだわからないけど、隣で一緒に見られるように、これからも頑張るね。',
        roseTitle: 'Anoへ贈る、咲きかけのバラ',
        roseDescription: '緑の葉の上で、ピンクのバラがゆっくりと花開きます。',
        footer: 'Anoのために作りました 🌸',
        footerGreeting: 'お誕生日おめでとう！',
        imageAlt1: '暖かな夕日の森で、光るろうそくのそばに立つ二人',
        imageAlt2: '青空の下、花畑に立つマント姿の人',
        imageAlt3: 'キャットタワーで休む小さな茶トラの子猫',
        imageAlt4: '焼きたての淡い緑色のメレンゲクッキー'
    }
};

const pageTranslationTargets = {
    navHome: 'nav-home',
    navPuzzle: 'nav-puzzle',
    navCatGame: 'nav-cat-game',
    navOmikuji: 'nav-omikuji',
    navRiddles: 'nav-riddles',
    navGallery: 'nav-gallery',
    heroTitle: 'hero-title',
    birthdayDate: 'birthday-date',
    heroCopy: 'hero-copy',
    heroPuzzle: 'hero-puzzle-link',
    heroGallery: 'hero-gallery-link',
    puzzleTitle: 'puzzle-title',
    puzzleIntro: 'puzzle-intro',
    catGameTitle: 'cat-game-title',
    catGameIntro: 'cat-game-intro',
    omikujiTitle: 'omikuji-title',
    omikujiIntro: 'omikuji-intro',
    galleryTitle: 'gallery-title',
    galleryIntro: 'gallery-intro',
    birthdayKicker: 'birthday-note-kicker',
    birthdayTitle: 'birthday-note-title',
    birthdayMessage: 'birthday-note-message',
    birthdayPromise: 'birthday-promise',
    roseTitle: 'rose-title',
    roseDescription: 'rose-description',
    footer: 'footer-note',
    footerGreeting: 'footer-greeting'
};

function applyPageLanguage(language) {
    const copy = pageTranslations[language];
    if (!copy) return;

    window.siteLanguage = language;
    document.documentElement.lang = language;
    document.title = copy.title;

    Object.entries(pageTranslationTargets).forEach(([key, id]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = copy[key];
    });

    [1, 2, 3, 4].forEach(index => {
        const image = document.getElementById(`gallery-image-${index}`);
        if (image) image.alt = copy[`imageAlt${index}`];
    });

    const languageGroup = document.querySelector('.site-language');
    const englishButton = document.getElementById('language-en');
    const japaneseButton = document.getElementById('language-ja');
    if (languageGroup) languageGroup.setAttribute('aria-label', copy.languageLabel);
    if (englishButton) englishButton.setAttribute('aria-pressed', String(language === 'en'));
    if (japaneseButton) japaneseButton.setAttribute('aria-pressed', String(language === 'ja'));

    document.dispatchEvent(new CustomEvent('site-language-change', { detail: { language } }));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('language-en')?.addEventListener('click', () => applyPageLanguage('en'));
    document.getElementById('language-ja')?.addEventListener('click', () => applyPageLanguage('ja'));
    applyPageLanguage('en');
});
