const mesa = document.querySelector(".mesa");
let nmrCartas = 0;
let jogadas = 0;
let paresFeitos = 0;
let tempo = 0;
let funcaoTempo;
let tela;
let deck = [];
let buffer = [];
const pares = [
	"bobrossparrot",
	"explodyparrot",
	"fiestaparrot",
	"metalparrot",
	"revertitparrot",
	"tripletsparrot",
	"unicornparrot",
];

setInterval(ajustaTela, 100);
comecarJogo();

function comecarJogo() {
	pares.sort(comparador);
	deck = [];
	nmrCartas = 0;
	jogadas = 0;
	paresFeitos = 0;
	tempo = 0;

	while (nmrCartas < 4 || nmrCartas > 14 || nmrCartas % 2 !== 0) {
		nmrCartas = prompt("Numero de cartas:");
	}

	gerarDeck();

	mesa.innerHTML = deck.join(" ");

	document.querySelector(".cronometro p").innerHTML = 0;
	funcaoTempo = setInterval(cronometrar, 1000);
}

function gerarDeck() {
	for (let i = 0; i < nmrCartas / 2; i++) {
		for (let j = 0; j < 2; j++) {
			deck.push(`
      <div class="card" data-test="card" onclick="clicou(this)">
        <div class="front-face face">
          <img data-test="face-down-image" src="./imgs/back.png"></img>
        </div>
        <div class="back-face face">
          <img data-test="face-up-image" src="./imgs/${pares[i]}.gif"></img>
        </div>
      </div>`);
		}
		deck.sort(comparador);
	}
}

function cronometrar() {
	tempo++;
	document.querySelector(".cronometro p").innerHTML = tempo;
}

function ajustaTela() {
	tela = window.matchMedia("(max-width: 1024px)");
	if (!tela.matches) {
		mesa.style.gridTemplateColumns = `repeat(${deck.length / 2}, 117px)`;
		mesa.style.gridTemplateRows = `repeat(2, 146px)`;
	} else {
		mesa.style.gridTemplateColumns = "117px";
		mesa.style.gridTemplateRows = `repeat(${deck.length}, 146px)`;
	}
}

function comparador() {
	return Math.random() - 0.5;
}

function clicou(carta) {
	if (buffer.length < 2 && !carta.classList.contains("virada")) {
		buffer.push(carta);
		jogadas++;
		virar();
		verificarJogada();
	}
}

function virar() {
	buffer[buffer.length - 1].firstElementChild.style.transform =
		"rotateY(-180deg)";
	buffer[buffer.length - 1].lastElementChild.style.transform = "rotateY(0deg)";
	buffer[buffer.length - 1].classList.add("virada");
}

function verificarJogada() {
	if (!verificarCarta()) setTimeout(desvirar, 1000);
	else if (paresFeitos === nmrCartas / 2) {
		setTimeout(() => {
			anunciarVitoria();
			novoJogo();
		}, 500);
	}
}

function verificarCarta() {
	if (buffer.length === 2) {
		if (
			buffer[0].lastElementChild.firstElementChild.src ==
			buffer[1].lastElementChild.firstElementChild.src
		) {
			buffer = [];
			paresFeitos++;
			return true;
		} else {
			return false;
		}
	} else return true;
}

function anunciarVitoria() {
	clearInterval(funcaoTempo);
	alert(
		`Você ganhou em ${jogadas} jogadas! A duração do jogo foi de ${tempo} segundos!`
	);
}

function novoJogo() {
	let reiniciar = "";
	while (reiniciar !== "n" && reiniciar !== "s") {
		reiniciar = prompt("Começar um novo jogo?");
		if (reiniciar === "s") comecarJogo();
	}
}

function desvirar() {
	buffer[0].firstElementChild.style.transform = "rotateY(0deg)";
	buffer[0].lastElementChild.style.transform = "rotateY(-180deg)";

	buffer[1].firstElementChild.style.transform = "rotateY(0deg)";
	buffer[1].lastElementChild.style.transform = "rotateY(-180deg)";

	setTimeout(() => {
		buffer[0].classList.remove("virada");
		buffer[1].classList.remove("virada");
		buffer = [];
	}, 500);
}
