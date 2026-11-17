// ============================================
// SISTEMA DE GERENCIAMENTO ENEM 31
// ============================================

(() => {
const START_DATE = new Date('2026-07-07');

const electronStorage = (() => {
    const bridge = window.electronStorage;

    return {
        getItem: (key) => {
            try {
                if (bridge && typeof bridge.getItem === 'function') {
                    const value = bridge.getItem(key);
                    if (value !== null && value !== undefined) {
                        return value;
                    }
                }
            } catch (error) {
                console.warn('Falha ao ler via bridge:', error);
            }

            return localStorage.getItem(key);
        },
        setItem: (key, value) => {
            try {
                if (bridge && typeof bridge.setItem === 'function') {
                    bridge.setItem(key, value);
                }
            } catch (error) {
                console.warn('Falha ao salvar via bridge:', error);
            }

            localStorage.setItem(key, value);
        },
        removeItem: (key) => {
            try {
                if (bridge && typeof bridge.removeItem === 'function') {
                    bridge.removeItem(key);
                }
            } catch (error) {
                console.warn('Falha ao remover via bridge:', error);
            }

            localStorage.removeItem(key);
        },
        clear: () => {
            try {
                if (bridge && typeof bridge.clear === 'function') {
                    bridge.clear();
                }
            } catch (error) {
                console.warn('Falha ao limpar via bridge:', error);
            }

            localStorage.clear();
        }
    };
})();

const electronAPI = window.electronAPI || {
    getVersion: () => 'unknown',
    getPlatform: () => 'unknown'
};

const topicBank = {
    matematica: [
        'Funções Polinomiais',
        'Geometria Plana (Triângulos)',
        'Progressões Aritméticas e Geométricas',
        'Logaritmos e Exponenciais',
        'Trigonometria Básica',
        'Estatística e Probabilidade',
        'Matrizes e Determinantes',
        'Sistemas Lineares',
        'Geometria Espacial',
        'Análise Combinatória',
        'Números Complexos',
        'Sequências Numéricas',
        'Função Quadrática',
        'Inequações',
        'Polinômios',
        'Relações Métricas no Triângulo',
        'Circunferência e Círculo',
        'Teoremas Geométricos',
        'Congruência e Semelhança',
        'Volumes de Sólidos',
        'Trigonometria Avançada',
        'Identidades Trigonométricas',
        'Funções Trigonométricas',
        'Equações Trigonométricas',
        'Revisão de Funções',
        'Cálculo de Limites Básicos',
        'Derivadas Introdutórias',
        'Problemas de Otimização',
        'Equações Exponenciais',
        'Probabilidade Condicional'
    ],
    linguagens: [
        'Figuras de Linguagem (Metáfora, Metonímia)',
        'Modernismo Brasileiro (Geração de 22)',
        'Análise de Texto Literário',
        'Análise de Publicidade',
        'Coesão e Coerência Textual',
        'Denotação e Conotação',
        'Interpretação de Charge e Tirinha',
        'Estrutura do Texto Narrativo',
        'Realismo e Naturalismo',
        'Poesia e Estrutura Poética',
        'Ensaio e Crônica',
        'Variação Linguística',
        'Trovadorismo Português',
        'Humanismo',
        'Quinhentismo Brasileiro',
        'Leitura de Gráficos e Infográficos',
        'Arcadismo Brasileiro',
        'Narrativa de Ficção Científica',
        'Prosa Contemporânea',
        'Intertextualidade',
        'Literatura Brasileira Contemporânea',
        'Análise de Campanhas Publicitárias',
        'Semiótica e Símbolos',
        'Estilística Textual',
        'Literatura Africana',
        'Análise Comparativa de Textos',
        'Recursos Audiovisuais',
        'Gêneros Digitais',
        'Estudo de Crônicas e Artigos',
        'Gramática em Contexto'
    ],
    humanas: [
        'Revolução Francesa',
        'Iluminismo e Despotismo Esclarecido',
        'Independência da América Latina',
        'Revolução Industrial',
        'Getúlio Vargas e o Estado Novo',
        'Colonialismo Europeu',
        'Capitalismo e Socialismo',
        'Guerra Fria',
        'Renascimento Cultural',
        'Absolutismo Europeu',
        'Mercantilismo',
        'Imperialismo Africano e Asiático',
        'República Oligárquica',
        'Revoluções Sociais (Russa, Chinesa)',
        'Período Joanino no Brasil',
        'Independência do Brasil',
        'Primeira República',
        'Primeira Guerra Mundial',
        'Revolução de 1930',
        'Ditadura Militar (1964-1985)',
        'Abertura Política e Redemocratização',
        'Constituição de 1988',
        'Era Fernando Henrique Cardoso',
        'Era Lula',
        'Globalização',
        'Relações Internacionais Contemporâneas',
        'Movimentos Sociais',
        'Direitos Humanos',
        'Geopolítica Atual',
        'Economia e Sociedade'
    ],
    natureza: [
        'Divisão Celular (Mitose e Meiose)',
        'Genética Molecular',
        'Fotossíntese e Respiração Celular',
        'Ecossistemas e Cadeias Alimentares',
        'Evolução e Seleção Natural',
        'Ciclos Biogeoquímicos',
        'Leis de Mendel',
        'Citologia: Organelas Celulares',
        'Vírus e Bactérias',
        'Reprodução Sexuada e Assexuada',
        'Embriologia',
        'Homeostase e Regulação',
        'Sistema Circulatório',
        'Sistema Respiratório',
        'Sistema Digestivo',
        'Sistema Nervoso',
        'Sistema Endócrino',
        'Imunologia',
        'Nutrição e Metabolismo',
        'Fisiologia Comparada',
        'Origem da Vida',
        'Evolução Química',
        'Paleontologia',
        'Filogenia',
        'Química Geral',
        'Ligações Químicas',
        'Reações Químicas',
        'Tabela Periódica',
        'Energia e Trabalho',
        'Ondas e Som'
    ],
    redacao: [
        'Estrutura do Parágrafo de Abertura',
        'Técnicas de Conclusão de Texto',
        'Argumentação e Evidências',
        'Conectivos Argumentativos',
        'Proposta de Intervenção Social',
        'Coesão Referencial',
        'Evitar Desvios Gramaticais',
        'Elaboração de Tese',
        'Variação Estilística',
        'Manutenção do Registro Formal',
        'Parágrafos de Desenvolvimento',
        'Análise de Problemas Sociais',
        'Expressões Transitivas',
        'Regência Verbal e Nominal',
        'Concordância Verbal e Nominal',
        'Pontuação Estratégica',
        'Dissertação Expositiva',
        'Estrutura de Parágrafos',
        'Tipos de Argumentação',
        'Função Social do Texto',
        'Dissertação Crítica',
        'Análise de Questões Contemporâneas',
        'Recursos Retóricos',
        'Impacto Emocional do Texto',
        'Revisão Geral de Escrita',
        'Estratégias de Leitura',
        'Adaptação ao Público',
        'Finalização de Redação Perfeita',
        'Uso de Dados e Estatísticas',
        'Construção de Tese Forte'
    ]
};

const ennemContent = Array.from({ length: 31 }, (_, day) => {
    const pickTopics = (key, count = 4) =>
        Array.from({ length: count }, (_, offset) => topicBank[key][(day + offset) % topicBank[key].length]);

    return {
        day,
        matematica: pickTopics('matematica', 4),
        linguagens: pickTopics('linguagens', 4),
        humanas: pickTopics('humanas', 4),
        natureza: pickTopics('natureza', 4),
        redacao: pickTopics('redacao', 4)
    };
});

const motivationPhrases = [
    'Ritmo bom: agora transforme revisão em acerto.',
    'Mais uma etapa marcada. Pequena vitória, efeito grande.',
    'Consistência vence intensidade solta. Continue no plano.',
    'A redação melhora quando aparece na rotina, não só na véspera.',
    'Hoje é dia de ganhar clareza, não de estudar tudo ao mesmo tempo.',
    'Questão errada também conta: ela mostra exatamente onde revisar.',
    'Você não precisa de um dia perfeito. Precisa de um dia concluído.',
    'Mantenha o foco no próximo bloco, sem negociar com a distração.'
];

const defaultDisciplineConfig = [
    { time: '15:30', name: 'Matemática', icon: '📐', key: 'matematica', mode: 'Exercícios guiados', image: 'Images/aquarela-matematica.svg' },
    { time: '16:30', name: 'Linguagens', icon: '📝', key: 'linguagens', mode: 'Leitura e interpretação', image: 'Images/aquarela-linguagens.svg' },
    { time: '17:30', name: 'Humanas', icon: '🏛️', key: 'humanas', mode: 'Contexto e repertório', image: 'Images/aquarela-historia.svg' },
    { time: '18:30', name: 'Natureza', icon: '🌿', key: 'natureza', mode: 'Teoria aplicada', image: 'Images/aquarela-natureza.svg' },
    { time: '19:30', name: 'Redação', icon: '✍️', key: 'redacao', mode: 'Tese e intervenção', image: 'Images/aquarela-redacao.svg' }
];

const defaultEditorSettings = {
    siteName: 'ENEM 31',
    heroTitle: '31 dias de foco para chegar mais afiado no ENEM.',
    heroDescription: 'Um painel direto para organizar conteúdo, revisão, redação e constância diária sem perder a noção do que já foi vencido.',
    motivationText: '',
    dayLabel: 'Missão do dia'
};

let disciplines = JSON.parse(electronStorage.getItem('enem_discipline_config')) || defaultDisciplineConfig.map(item => ({ ...item }));
let editorSettings = JSON.parse(electronStorage.getItem('enem_editor_settings')) || { ...defaultEditorSettings };
let customDailyContent = JSON.parse(electronStorage.getItem('enem_custom_daily_content')) || {};
let absences = parseInt(electronStorage.getItem('enem_absences')) || 0;

if (editorSettings.siteName === 'ENEM Elite' || editorSettings.heroTitle === 'O caminho mais elegante para conquistar sua vaga no ENEM.') {
    editorSettings = { ...defaultEditorSettings, motivationText: editorSettings.motivationText || '' };
    electronStorage.setItem('enem_editor_settings', JSON.stringify(editorSettings));
}

const gameState = {
    currentDate: new Date(),
    level: parseInt(electronStorage.getItem('enem_level')) || 1,
    xp: parseInt(electronStorage.getItem('enem_xp')) || 0,
    xpPerLevel: 100,
    totalTasksCompleted: parseInt(electronStorage.getItem('enem_total_tasks')) || 0,
    lastActiveDate: electronStorage.getItem('enem_last_date') || new Date().toDateString(),
    streak: parseInt(electronStorage.getItem('enem_streak')) || 0
};

let activeDayIndex = -1;

function getCurrentDayIndex() {
    const today = new Date();
    const timeDiff = today - START_DATE;
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return dayDiff % 31;
}

function getContentForToday() {
    const dayIndex = getCurrentDayIndex();
    return customDailyContent[dayIndex] || ennemContent[dayIndex];
}

function saveGameState() {
    electronStorage.setItem('enem_level', gameState.level);
    electronStorage.setItem('enem_xp', gameState.xp);
    electronStorage.setItem('enem_total_tasks', gameState.totalTasksCompleted);
    electronStorage.setItem('enem_last_date', gameState.lastActiveDate);
    electronStorage.setItem('enem_streak', gameState.streak);
    electronStorage.setItem('enem_absences', absences);
}

function loadGameState() {
    gameState.currentDate = new Date();
    const today = gameState.currentDate.toDateString();
    const lastDate = electronStorage.getItem('enem_last_date');

    if (!lastDate) {
        gameState.lastActiveDate = today;
        saveGameState();
        return;
    }

    const yesterday = new Date(gameState.currentDate.getTime() - 86400000).toDateString();
    if (today !== lastDate) {
        if (lastDate === yesterday) {
            gameState.streak++;
        } else {
            gameState.streak = 1;
        }
        gameState.lastActiveDate = today;
        saveGameState();
    }
}

function getCompletedTasksCount() {
    return disciplines.reduce((total, _, index) => {
        return total + (electronStorage.getItem(`task_${index}`) === 'true' ? 1 : 0);
    }, 0);
}

function applyXPFromCompletedTasks(options = {}) {
    const previousLevel = gameState.level;
    const completedTasks = getCompletedTasksCount();
    let totalXP = completedTasks * 20;
    let nextLevel = 1;
    let xpRequired = nextLevel * gameState.xpPerLevel;

    while (totalXP >= xpRequired) {
        totalXP -= xpRequired;
        nextLevel++;
        xpRequired = nextLevel * gameState.xpPerLevel;
    }

    gameState.level = nextLevel;
    gameState.xp = totalXP;
    gameState.totalTasksCompleted = completedTasks;

    saveGameState();
    updateXPDisplay();
    updateStats();
    renderAchievements();

    if (options.showLevelUp && gameState.level > previousLevel) {
        triggerLevelUp();
    }
}

function triggerLevelUp() {
    const previousToast = document.querySelector('.level-up-animation');
    if (previousToast) previousToast.remove();

    const levelUpEl = document.createElement('div');
    levelUpEl.className = 'level-up-animation';
    levelUpEl.setAttribute('role', 'status');
    levelUpEl.innerHTML = `
        <span class='level-up-kicker'>Level up</span>
        <strong>Nível ${gameState.level}</strong>
        <small>${gameState.xp} XP no novo nível</small>
    `;
    document.body.appendChild(levelUpEl);
    setTimeout(() => levelUpEl.remove(), 2200);
    createConfetti();
}

function updateXPDisplay() {
    const xpRequired = gameState.level * gameState.xpPerLevel;
    const xpPercentage = Math.min(100, Math.max(0, (gameState.xp / xpRequired) * 100));
    const rankNames = ['Aquecimento', 'Rotina firmando', 'Ritmo de prova', 'Revisão afiada', 'Reta final forte'];
    const rankName = rankNames[Math.min(rankNames.length - 1, gameState.level - 1)];

    const levelEl = document.getElementById('hero-level');
    const xpTextEl = document.getElementById('hero-xp');
    const heroProgress = document.getElementById('hero-progress');
    const rankEl = document.querySelector('.hero-rank');

    if (levelEl) levelEl.textContent = gameState.level;
    if (xpTextEl) xpTextEl.textContent = `${gameState.xp}/${xpRequired} XP`;
    if (heroProgress) heroProgress.style.width = `${xpPercentage}%`;
    if (rankEl) rankEl.textContent = rankName;
}

function createParticles(count = 20) {
    const container = document.getElementById('particles-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            --tx: ${(Math.random() - 0.5) * 120}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${['#00ff88', '#00d4ff', '#a855f7', '#ffd700'][Math.floor(Math.random() * 4)]};
            border-radius: 50%;
            animation: particleFloat ${Math.random() * 2 + 1.2}s ease-out forwards;
        `;
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
    }
}

function createConfetti() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const confettiEmojis = ['🎉', '⭐', '🎊', '✨', '🏆', '💫'];
    for (let i = 0; i < 28; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'particle';
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        confetti.style.cssText = `
            --tx: ${(Math.random() - 0.5) * 180}px;
            left: ${Math.random() * 100}%;
            top: 48%;
            font-size: 1.7rem;
            animation: particleFloat ${Math.random() * 2 + 1.7}s ease-out forwards;
        `;
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

function renderTasks() {
    const tasksContainer = document.getElementById('tasks');
    if (!tasksContainer) return;

    tasksContainer.innerHTML = '';
    disciplines.forEach((discipline, index) => {
        const taskElement = document.createElement('div');
        const isCompleted = electronStorage.getItem(`task_${index}`) === 'true';
        taskElement.className = `task ${isCompleted ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <label class='task-checkbox-wrapper'>
                <input type='checkbox' ${isCompleted ? 'checked' : ''}>
                <span class='task-checkbox'></span>
            </label>
            <div>
                <span class='task-main'>${discipline.icon} ${discipline.time} - ${discipline.name}</span>
                <span class='task-mode'>${discipline.mode || 'Estudo focado'}</span>
            </div>
        `;
        tasksContainer.appendChild(taskElement);

        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                handleTaskComplete(index, checkbox.checked);
            });
        }
    });
}

function handleTaskComplete(index, isChecked) {
    electronStorage.setItem(`task_${index}`, String(isChecked));
    applyXPFromCompletedTasks({ showLevelUp: isChecked });

    if (isChecked) {
        createParticles(15);
    }

    updateProgressBar();
    updateMotivation();
    renderTasks();
    updateStats();
    updateHeroSummary();
    renderTimeline();
    renderAchievements();
}

function renderContent() {
    const contentGrid = document.getElementById('content-grid');
    if (!contentGrid) return;

    const todayContent = getContentForToday();
    const dayNumber = getCurrentDayIndex() + 1;
    const heading = document.querySelector('.content-card .card-header h2');

    if (heading) heading.textContent = `Conteúdo do Dia ${dayNumber} de 31`;
    contentGrid.innerHTML = '';

    disciplines.forEach(discipline => {
        const content = todayContent[discipline.key];
        const contentItem = document.createElement('div');
        contentItem.className = 'content-item';
        contentItem.innerHTML = `
            <div class='content-art'>
                <img src='${discipline.image}' alt='Ilustração em aquarela para ${discipline.name}'>
            </div>
            <div class='content-header'>
                <span class='content-icon'>${discipline.icon}</span>
                <div>
                    <h3 class='content-title'>${discipline.name}</h3>
                    <p class='content-mode'>${discipline.mode || 'Estudo focado'}</p>
                </div>
            </div>
            <ul class='content-list'>
                ${content.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
        contentGrid.appendChild(contentItem);
    });
}

function updateProgressBar() {
    let completed = 0;
    for (let i = 0; i < disciplines.length; i++) {
        if (electronStorage.getItem(`task_${i}`) === 'true') completed++;
    }

    const percentage = Math.round((completed / disciplines.length) * 100);
    const bar = document.getElementById('bar');
    const sideProgress = document.getElementById('side-progress');
    const percent = document.getElementById('percent');

    if (bar) bar.style.width = `${percentage}%`;
    if (sideProgress) sideProgress.style.width = `${percentage}%`;
    if (percent) percent.textContent = `${percentage}%`;
}

function updateMotivation() {
    let completed = 0;
    for (let i = 0; i < disciplines.length; i++) {
        if (electronStorage.getItem(`task_${i}`) === 'true') completed++;
    }

    let phrase = '';
    if (completed === 0) {
        phrase = 'Comece pelo primeiro bloco. Depois o painel vira evidência do seu esforço.';
    } else if (completed < disciplines.length) {
        phrase = motivationPhrases[Math.floor(Math.random() * motivationPhrases.length)];
    } else {
        phrase = 'Plano de hoje concluído. Agora revise os erros e preserve energia para amanhã.';
    }

    const motivationEl = document.getElementById('motivation-text');
    if (motivationEl) motivationEl.textContent = phrase;
}

function updateStats() {
    let completed = 0;
    for (let i = 0; i < disciplines.length; i++) {
        if (electronStorage.getItem(`task_${i}`) === 'true') completed++;
    }

    const rate = Math.min(100, Math.round((gameState.totalTasksCompleted / (disciplines.length * Math.max(1, gameState.streak))) * 100));

    const streakEl = document.getElementById('streak');
    const totalTasksEl = document.getElementById('total-tasks');
    const completionRateEl = document.getElementById('completion-rate');
    const absencesStatEl = document.getElementById('absences-stat');

    if (streakEl) streakEl.textContent = gameState.streak;
    if (totalTasksEl) totalTasksEl.textContent = gameState.totalTasksCompleted;
    if (completionRateEl) completionRateEl.textContent = `${rate}%`;
    if (absencesStatEl) absencesStatEl.textContent = absences;
}

function updateAbsencesUI() {
    const countEl = document.getElementById('absences-count');
    const valueEl = document.getElementById('absences-value');
    const summaryEl = document.getElementById('absences-summary');
    const statEl = document.getElementById('absences-stat');

    if (countEl) countEl.textContent = absences;
    if (valueEl) valueEl.textContent = absences;
    if (summaryEl) {
        summaryEl.textContent = absences === 0
            ? 'Nenhuma falta registrada.'
            : absences === 1
                ? '1 falta registrada.'
                : `${absences} faltas registradas.`;
    }
    if (statEl) statEl.textContent = absences;
}

function changeAbsences(delta) {
    absences = Math.max(0, absences + delta);
    saveGameState();
    updateAbsencesUI();
    updateStats();
}

function updateClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;

    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    clockEl.textContent = now.toLocaleString('pt-BR', options);
}

function updateCurrentDate() {
    const currentDateEl = document.getElementById('current-date');
    if (!currentDateEl) return;

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    const dateString = new Date().toLocaleDateString('pt-BR', options);
    currentDateEl.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
}

function applyEditorSettings() {
    const brandEls = document.querySelectorAll('.brand');
    brandEls.forEach(el => {
        if (el) el.textContent = editorSettings.siteName || defaultEditorSettings.siteName;
    });

    const heroTitleEl = document.querySelector('.hero-copy h1');
    const heroDescriptionEl = document.querySelector('.hero-copy p');
    const heroLabelEl = document.querySelector('.hero-card.secondary .hero-label');
    const heroTextEl = document.getElementById('hero-day-text');
    const motivationEl = document.getElementById('motivation-text');

    if (heroTitleEl) heroTitleEl.textContent = editorSettings.heroTitle || defaultEditorSettings.heroTitle;
    if (heroDescriptionEl) heroDescriptionEl.textContent = editorSettings.heroDescription || defaultEditorSettings.heroDescription;
    if (heroLabelEl) heroLabelEl.textContent = editorSettings.dayLabel || defaultEditorSettings.dayLabel;
    if (heroTextEl) heroTextEl.textContent = `${getContentForToday().matematica[0]} • ${getContentForToday().redacao[0]}`;
    if (motivationEl) motivationEl.textContent = editorSettings.motivationText || motivationEl.textContent;
}

function populateEditorForm() {
    const form = document.getElementById('editor-form');
    if (!form) return;

    form.querySelector('#editor-site-name').value = editorSettings.siteName || defaultEditorSettings.siteName;
    form.querySelector('#editor-title').value = editorSettings.heroTitle || defaultEditorSettings.heroTitle;
    form.querySelector('#editor-description').value = editorSettings.heroDescription || defaultEditorSettings.heroDescription;
    form.querySelector('#editor-motivation').value = editorSettings.motivationText || '';
    form.querySelector('#editor-day-label').value = editorSettings.dayLabel || defaultEditorSettings.dayLabel;

    const taskFields = document.getElementById('task-editor-fields');
    const topicFields = document.getElementById('topic-editor-fields');

    if (taskFields) {
        taskFields.innerHTML = '';
        disciplines.forEach((discipline, index) => {
            taskFields.insertAdjacentHTML('beforeend', `
                <label>
                    <span>${discipline.name}</span>
                    <div class='editor-inline-fields'>
                        <input type='text' name='taskName${index}' value='${discipline.name}' placeholder='Nome da tarefa'>
                        <input type='text' name='taskTime${index}' value='${discipline.time}' placeholder='Horário'>
                    </div>
                </label>
            `);
        });
    }

    if (topicFields) {
        topicFields.innerHTML = '';
        disciplines.forEach((discipline, index) => {
            const todayContent = getContentForToday();
            const topics = (todayContent[discipline.key] || []).join('\n');
            topicFields.insertAdjacentHTML('beforeend', `
                <label>
                    <span>${discipline.name}</span>
                    <textarea name='topic${index}' rows='4' placeholder='Separe os tópicos por linha'>${topics}</textarea>
                </label>
            `);
        });
    }
}

function saveEditorState(event) {
    if (event) event.preventDefault();

    const form = document.getElementById('editor-form');
    if (!form) return;

    const formData = new FormData(form);
    editorSettings.siteName = (formData.get('siteName') || defaultEditorSettings.siteName).toString().trim() || defaultEditorSettings.siteName;
    editorSettings.heroTitle = (formData.get('heroTitle') || defaultEditorSettings.heroTitle).toString().trim();
    editorSettings.heroDescription = (formData.get('heroDescription') || defaultEditorSettings.heroDescription).toString().trim();
    editorSettings.motivationText = (formData.get('motivationText') || '').toString().trim();
    editorSettings.dayLabel = (formData.get('dayLabel') || defaultEditorSettings.dayLabel).toString().trim();

    disciplines = disciplines.map((discipline, index) => ({
        ...discipline,
        name: (formData.get(`taskName${index}`) || discipline.name).toString().trim() || discipline.name,
        time: (formData.get(`taskTime${index}`) || discipline.time).toString().trim() || discipline.time
    }));

    const currentDayIndex = getCurrentDayIndex();
    const topicsObject = {};
    disciplines.forEach((discipline, index) => {
        const rawTopics = (formData.get(`topic${index}`) || '').toString();
        const topics = rawTopics.split('\n').map(item => item.trim()).filter(Boolean);
        topicsObject[discipline.key] = topics.length ? topics : (ennemContent[currentDayIndex][discipline.key] || []);
    });

    customDailyContent[currentDayIndex] = topicsObject;

    electronStorage.setItem('enem_discipline_config', JSON.stringify(disciplines));
    electronStorage.setItem('enem_editor_settings', JSON.stringify(editorSettings));
    electronStorage.setItem('enem_custom_daily_content', JSON.stringify(customDailyContent));

    applyEditorSettings();
    renderTasks();
    renderContent();
    updateProgressBar();
    updateMotivation();
    updateHeroSummary();
    updateStats();
    renderTimeline();
    renderAchievements();
}

function resetEditorState() {
    electronStorage.removeItem('enem_discipline_config');
    electronStorage.removeItem('enem_editor_settings');
    electronStorage.removeItem('enem_custom_daily_content');
    disciplines = defaultDisciplineConfig.map(item => ({ ...item }));
    editorSettings = {
        ...defaultEditorSettings
    };
    customDailyContent = {};
    applyEditorSettings();
    populateEditorForm();
    renderTasks();
    renderContent();
    updateProgressBar();
    updateMotivation();
    updateHeroSummary();
    updateStats();
    renderTimeline();
    renderAchievements();
}

function updateHeroSummary() {
    const todayContent = getContentForToday();
    const dayNumber = getCurrentDayIndex() + 1;
    const heroDayEl = document.getElementById('hero-day');
    const heroDayTextEl = document.getElementById('hero-day-text');
    const heroDaySubtitleEl = document.getElementById('hero-day-subtitle');
    const achievementPreviewEl = document.getElementById('achievement-preview');

    if (heroDayEl) heroDayEl.textContent = `Dia ${dayNumber}`;
    if (heroDayTextEl) heroDayTextEl.textContent = `${todayContent.matematica[0]} • ${todayContent.redacao[0]}`;
    if (heroDaySubtitleEl) heroDaySubtitleEl.textContent = `Foco em ${todayContent.matematica[0].toLowerCase()} e ${todayContent.redacao[0].toLowerCase()}.`;
    if (achievementPreviewEl) achievementPreviewEl.textContent = gameState.totalTasksCompleted >= 5 ? 'Você já tem histórico suficiente para confiar mais no processo e revisar melhor.' : 'Complete os blocos para transformar intenção em progresso visível.';
}

function renderTimeline() {
    const timeline = document.getElementById('timeline-items');
    if (!timeline) return;

    const currentDay = getCurrentDayIndex();
    timeline.innerHTML = '';

    for (let i = 0; i < 31; i++) {
        const pill = document.createElement('div');
        pill.className = 'timeline-pill';

        if (i < currentDay) pill.classList.add('done');
        if (i === currentDay) pill.classList.add('active');

        pill.innerHTML = `<strong>Dia ${i + 1}</strong><span>${i < currentDay ? 'Concluído' : i === currentDay ? 'Hoje' : 'Futuro'}</span>`;
        timeline.appendChild(pill);
    }
}

function renderAchievements() {
    const achievementList = document.getElementById('achievement-list');
    if (!achievementList) return;

    const achievements = [
        { icon: '🌟', title: 'Primeiro bloco', desc: 'Complete a primeira tarefa do plano.', unlocked: gameState.totalTasksCompleted >= 1 },
        { icon: '🔥', title: 'Três dias vivos', desc: 'Mantenha a rotina por 3 dias.', unlocked: gameState.streak >= 3 },
        { icon: '🏅', title: 'Ritmo de prova', desc: 'Atinga o nível 3.', unlocked: gameState.level >= 3 },
        { icon: '⚡', title: '20 blocos feitos', desc: 'Conclua 20 tarefas reais.', unlocked: gameState.totalTasksCompleted >= 20 },
        { icon: '🧠', title: 'Revisão afiada', desc: 'Alcance o nível 5.', unlocked: gameState.level >= 5 }
    ];

    achievementList.innerHTML = '';
    achievements.forEach(item => {
        const card = document.createElement('article');
        card.className = `achievement-card ${item.unlocked ? '' : 'locked'}`;
        card.innerHTML = `
            <i class='${item.unlocked ? 'fas fa-check-circle' : 'far fa-circle'}'></i>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
        `;
        achievementList.appendChild(card);
    });
}

function syncDevPanel() {
    const editorSection = document.getElementById('editor');
    if (!editorSection) return;

    const shouldShow = window.location.hash === '#dev';
    editorSection.classList.toggle('visible', shouldShow);
    editorSection.style.display = shouldShow ? 'block' : 'none';

    if (!shouldShow) {
        editorSection.classList.remove('visible');
    }
}

function setupInteractions() {
    const editorForm = document.getElementById('editor-form');
    const resetEditorBtn = document.getElementById('reset-editor');

    syncDevPanel();
    window.addEventListener('hashchange', syncDevPanel);

    if (editorForm) {
        editorForm.addEventListener('submit', saveEditorState);
    }

    if (resetEditorBtn) {
        resetEditorBtn.addEventListener('click', resetEditorState);
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks?.classList.remove('open'));
    });

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        });
    }

    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    document.querySelectorAll('.absence-btn').forEach(button => {
        button.addEventListener('click', () => {
            changeAbsences(Number(button.dataset.delta));
        });
    });

    const mouseGlows = document.querySelectorAll('.mouse-glow');

    if (mouseGlows.length) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;
        let lastX = currentX;
        let lastY = currentY;
        let angle = 0;
        let speed = 0;
        let hasMoved = false;

        window.addEventListener('pointermove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            hasMoved = true;
            document.body.classList.add('mouse-active');
        }, { passive: true });

        window.addEventListener('pointerleave', () => {
            hasMoved = false;
            document.body.classList.remove('mouse-active');
        });

        function animateGlow() {
            currentX += (mouseX - currentX) * 0.16;
            currentY += (mouseY - currentY) * 0.16;

            const velocityX = currentX - lastX;
            const velocityY = currentY - lastY;
            const distance = Math.hypot(velocityX, velocityY);

            speed += (Math.min(distance / 26, 1) - speed) * 0.14;
            angle += 0.8 + speed * 5.5;

            mouseGlows.forEach((glow, index) => {
                const delay = index * 0.055;
                const followX = currentX - velocityX * delay;
                const followY = currentY - velocityY * delay;
                const coreScale = 1.08 + speed * 0.08;
                const satelliteAScale = 1.1 + speed * 0.18;
                const satelliteCScale = 0.9 + speed * 0.2;
                const orbitDuration = 2.6 - speed;

                glow.style.setProperty('--mouse-x', `${followX}px`);
                glow.style.setProperty('--mouse-y', `${followY}px`);
                glow.style.setProperty('--glow-speed', speed.toFixed(3));
                glow.style.setProperty('--glow-angle', `${angle + index * 72}deg`);
                glow.style.setProperty('--core-scale', coreScale.toFixed(3));
                glow.style.setProperty('--satellite-a-scale', satelliteAScale.toFixed(3));
                glow.style.setProperty('--satellite-c-scale', satelliteCScale.toFixed(3));
                glow.style.setProperty('--orbit-duration', `${orbitDuration.toFixed(3)}s`);
            });

            lastX = currentX;
            lastY = currentY;

            if (!hasMoved && distance < 0.08) {
                speed *= 0.96;
            }

            requestAnimationFrame(animateGlow);
        }

        animateGlow();
    }
}

function initialize() {
    loadGameState();
    applyEditorSettings();
    populateEditorForm();
    setupInteractions();
    renderTasks();
    renderContent();
    updateProgressBar();
    updateMotivation();
    updateClock();
    updateCurrentDate();
    updateHeroSummary();
    applyXPFromCompletedTasks();
    updateStats();
    updateAbsencesUI();
    renderTimeline();
    renderAchievements();
    activeDayIndex = getCurrentDayIndex();

    setInterval(updateClock, 1000);
    setInterval(() => {
        const currentDay = getCurrentDayIndex();
        if (currentDay !== activeDayIndex) {
            activeDayIndex = currentDay;
            renderContent();
            updateCurrentDate();
            updateHeroSummary();
            updateMotivation();
            renderTimeline();
        }
    }, 60000);

    console.log('ENEM 31 iniciado');
    console.log('Dia de conteúdo:', getCurrentDayIndex() + 1);
    console.log('Level:', gameState.level, '| XP:', gameState.xp);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

})();
