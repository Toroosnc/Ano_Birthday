const birthdayRiddles = [
    {
        en: {
            question: 'What do you call a bear with no teeth?',
            answer: 'A gummy bear.',
            note: 'Gummy bears are soft enough to manage without teeth.'
        },
        ja: {
            question: '歯がないクマって、何て呼ぶ？',
            answer: 'グミベア！',
            note: 'グミならやわらかいから、歯がなくても食べられる…かも。'
        }
    },
    {
        en: {
            question: 'Why did the bicycle fall over?',
            answer: 'It was two-tired.',
            note: '“Two-tired” sounds like “too tired.”'
        },
        ja: {
            question: '自転車が倒れたのはどうして？',
            answer: '二輪だけど、二（too）疲れちゃった！',
            note: '英語の “two-tired” は “too tired”（疲れすぎ）に聞こえるダジャレ。'
        }
    },
    {
        en: {
            question: 'What do you call cheese that is not yours?',
            answer: 'Nacho cheese!',
            note: '“Not your cheese” sounds like “nacho cheese.”'
        },
        ja: {
            question: '自分のじゃないチーズって、何チーズ？',
            answer: 'ナチョチーズ！',
            note: '“Not your cheese” が “nacho cheese” に聞こえる英語のダジャレ。'
        }
    },
    {
        en: {
            question: 'Why could the pony not sing?',
            answer: 'It was a little hoarse.',
            note: '“Hoarse” (a rough voice) sounds exactly like “horse.”'
        },
        ja: {
            question: 'ポニーが歌えなかったのはどうして？',
            answer: 'ちょっと声がかれていたから。',
            note: '英語の “hoarse”（声がかれた）と “horse”（馬）は同じ発音。'
        }
    },
    {
        en: {
            question: 'What did the sushi say to the bee?',
            answer: 'Wasabi!',
            note: '“Was a bee” sounds like “wasabi.”'
        },
        ja: {
            question: 'すしがハチに言った言葉は？',
            answer: '「わさび！」',
            note: '“Was a bee”（ハチだった）が “wasabi” に聞こえる英語のダジャレ。'
        }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const question = document.getElementById('riddle-question');
    const answer = document.getElementById('riddle-answer');
    const punchline = document.getElementById('riddle-punchline');
    const note = document.getElementById('riddle-note');
    const count = document.getElementById('riddle-count');
    const revealButton = document.getElementById('reveal-riddle');
    const nextButton = document.getElementById('next-riddle');
    const title = document.getElementById('riddle-title');
    const intro = document.getElementById('riddle-intro');
    const section = document.getElementById('riddles');
    const gallery = document.getElementById('gallery');
    if (!question || !answer || !punchline || !note || !count || !revealButton || !nextButton || !title || !intro || !section || !gallery) return;

    let currentIndex = 0;
    let language = window.siteLanguage || 'en';
    let isRevealed = false;
    const galleryCaptions = {
        en: [
            'A quiet moment in the clouds',
            'A sky full of little lights',
            'I miss your cat :D',
            'I want to try the cookies you made.'
        ],
        ja: [
            '雲の中の静かなひととき',
            '小さな光がいっぱいの空',
            '君の猫が恋しいよ :D',
            '君が作ったクッキー、食べてみたいな。'
        ]
    };

    function showRiddle() {
        const copy = birthdayRiddles[currentIndex][language];
        const labels = language === 'ja'
            ? { title: 'Anoへ、ひと笑い', intro: '答えを見て、次のなぞなぞへ。', count: `なぞなぞ ${currentIndex + 1} / ${birthdayRiddles.length}`, reveal: '答えを見る', next: '次のなぞなぞ' }
            : { title: 'A little wordplay for Ano', intro: 'Reveal a punchline, then try another one.', count: `Riddle ${currentIndex + 1} of ${birthdayRiddles.length}`, reveal: 'Reveal answer', next: 'Another one' };

        section.lang = language;
        gallery.lang = language;
        title.textContent = labels.title;
        intro.textContent = labels.intro;
        count.textContent = labels.count;
        question.textContent = copy.question;
        punchline.textContent = copy.answer;
        note.textContent = copy.note;
        answer.hidden = !isRevealed;
        revealButton.disabled = isRevealed;
        revealButton.textContent = labels.reveal;
        nextButton.textContent = labels.next;
        galleryCaptions[language].forEach((caption, index) => {
            const galleryCaption = document.getElementById(`gallery-caption-${index + 1}`);
            if (galleryCaption) galleryCaption.textContent = caption;
        });
    }

    revealButton.addEventListener('click', () => {
        isRevealed = true;
        showRiddle();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % birthdayRiddles.length;
        isRevealed = false;
        showRiddle();
    });

    document.addEventListener('site-language-change', event => {
        language = event.detail.language;
        showRiddle();
    });

    showRiddle();
});
