
const telaInicial = document.getElementById('telaInicial'); 
const telaJogo = document.getElementById('telaJogo'); 
const telaFinal = document.getElementById('telaFinal'); 

const entradaNomeJogador = document.getElementById('entradaNomeJogador'); 
const botaoIniciar = document.getElementById('botaoIniciar'); 
const botaoJogarNovamente = document.getElementById('botaoJogarNovamente');   
const botaoVoltar = document.getElementById('botaoVoltar'); 

const avisoCor = document.getElementById('avisoCor'); 
const tempoRestanteDisplay = document.getElementById('tempoRestante'); 
const pontuacaoDisplay = document.getElementById('pontuacao'); 
const gradeCores = document.getElementById('gradeCores'); 

const nomeJogadorFinal = document.getElementById('nomeJogadorFinal'); 
const pontuacaoFinalDisplay = document.getElementById('pontuacaoFinal'); 
const listaRanking = document.getElementById('listaRanking'); 

const totalQuadrados = 9; 
const duracaoJogo = 45; 
const cores = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'];
const pontosPorAcerto = 15; 
const pontosPorErro = -3; 


let pontuacao = 0; 
let tempoRestante = 0; 
let cronometro = null; 
let nomeJogador = ''; 

function sortearCor() {
    const indice = Math.floor(Math.random() * cores.length);
    return cores[indice];
}


function prepararRodada() {
    gradeCores.innerHTML = ''; 
    const coresRodada = [];

    for (let i = 0; i < totalQuadrados; i++) {
        const quadrado = document.createElement('div');
        quadrado.classList.add('quadradoCor');
        const cor = sortearCor();
        quadrado.style.backgroundColor = cor;
        quadrado.dataset.cor = cor; 
        coresRodada.push(cor);
        gradeCores.appendChild(quadrado);
    }

    gradeCores.style.gridTemplateColumns = `repeat(${Math.sqrt(totalQuadrados)}, 1fr)`;

    const corAlvo = coresRodada[Math.floor(Math.random() * coresRodada.length)];
    avisoCor.textContent = corAlvo;
    avisoCor.style.color = corAlvo;
}

function atualizarPontuacao(pontos) {
    pontuacao += pontos;
    pontuacaoDisplay.textContent = pontuacao;
}

function clicarQuadrado(evento) {
    if (!evento.target.classList.contains('quadradoCor')) return;

    const corClicada = evento.target.dataset.cor;
    const corCorreta = avisoCor.textContent;

    if (corClicada === corCorreta) {
        atualizarPontuacao(pontosPorAcerto);
    } else {
        atualizarPontuacao(pontosPorErro);
    }

    prepararRodada(); 
}

function iniciarCronometro() {
    tempoRestante = duracaoJogo;
    tempoRestanteDisplay.textContent = tempoRestante;

    cronometro = setInterval(() => {
        tempoRestante--;
        tempoRestanteDisplay.textContent = tempoRestante;

        if (tempoRestante <= 0) {
            finalizarJogo();
        }
    }, 1000);
}

function finalizarJogo() {
    clearInterval(cronometro); 
    telaJogo.classList.remove('ativa');
    telaFinal.classList.add('ativa');

    nomeJogadorFinal.textContent = nomeJogador;
    pontuacaoFinalDisplay.textContent = pontuacao;

    salvarNoRanking(nomeJogador, pontuacao);
    atualizarRanking();
}

function iniciarJogo() {
    nomeJogador = entradaNomeJogador.value.trim();
    if (!nomeJogador) {
        alert('Digite seu nome.');
        return;
    }

    pontuacao = 0;
    pontuacaoDisplay.textContent = pontuacao;

    telaInicial.classList.remove('ativa');
    telaFinal.classList.remove('ativa');
    telaJogo.classList.add('ativa');

    prepararRodada();
    iniciarCronometro();
}

function salvarNoRanking(nome, pontuacao) {
    let ranking = JSON.parse(localStorage.getItem('rankingDesafioCores')) || [];
    ranking.push({ nome, pontuacao });
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    ranking = ranking.slice(0, 10); 
    localStorage.setItem('rankingDesafioCores', JSON.stringify(ranking));
}

function atualizarRanking() {
    const ranking = JSON.parse(localStorage.getItem('rankingDesafioCores')) || [];
    listaRanking.innerHTML = ranking.length === 0
        ? '<li>Nenhuma pontuação registrada.</li>'
        : ranking.map(jogador => `<li>${jogador.nome} - ${jogador.pontuacao} pontos</li>`).join('');
}


botaoVoltar.addEventListener('click', () => {
    telaInicial.classList.add('ativa');
});

botaoIniciar.addEventListener('click', iniciarJogo);
gradeCores.addEventListener('click', clicarQuadrado);
botaoJogarNovamente.addEventListener('click', () => {
    telaFinal.classList.remove('ativa');
    telaInicial.classList.add('ativa');
    entradaNomeJogador.value = ''; 
});

atualizarRanking();