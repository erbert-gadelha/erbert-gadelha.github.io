//import Moviment from "./scripts/Moviment.js";
//import Input from "./scripts/Input.js";

if(navigator.userAgent.includes("Android")) {
    //document.getElementById('game').style.display = 'none';
    document.querySelector('.tutorial').style.display = 'none';
}

class Queue {
    constructor() {
      this.elements = {};
      this.head = 0;
      this.tail = 0;
    }
    enqueue(element) {
      this.elements[this.tail] = element;
      this.tail++;
    }
    dequeue() {
      const item = this.elements[this.head];
      delete this.elements[this.head];
      this.head++;
      return item;
    }
    peek() {
      return this.elements[this.head];
    }
    get length() {
      return this.tail - this.head;
    }
    get isEmpty() {
      return this.length === 0;
    }
}

class Input {    
    
    constructor(moviment) {
        this.initial = [0,0]
        this.final = [0,0];

        this.tela = document.getElementById("touchTarget");
        this.moviment = moviment;

        this.adicionar_eventos();
    }

    adicionar_eventos() {

        //  EVENTOS TECLADO
            document.addEventListener('keydown', (event) => {
                if([37,38,39,40].indexOf(event.keyCode) > -1)
                    event.preventDefault();                

                this.input_teclado(event.key.toLowerCase());
            }, false);


            document.getElementById("container").addEventListener('keydown', (event) => {

                if([37,38,39,40].indexOf(event) > -1)
                    event.preventDefault();                

            }, false);

            document.getElementById("container").addEventListener('keydown', (event) => {

                if([37,38,39,40].indexOf(event) > -1)
                    event.preventDefault();                

            }, false);


        //
        //  EVENTOS TOUCH
            let tela_ = document.getElementById("touchTarget");
            
            let moviment_ = this.moviment;
            //console.log(this.moviment);
            tela_.addEventListener("touchstart",
                function clicked2(e) {

                    if(!moviment_.game_is_open)
                        return;

                    let br = tela_.getBoundingClientRect();
                    
                    let x = (e.touches[0].clientX - br.left);
                    let y = (e.touches[0].clientY - br.top);
                    this.initial = [x, y];

                }
            );
            
            this.tela.addEventListener("touchmove",
                function clicked2(e) {

                    if(!moviment_.game_is_open)
                        return;

                    var br = tela_.getBoundingClientRect();
                    
                    let x = (e.touches[0].clientX - br.left);
                    let y = (e.touches[0].clientY - br.top);

                    this.final = [x, y];

                }
            );
            const temporario = this.moviment;
            this.tela.addEventListener("touchend",
                function clicked2(e) {
                    
                    if(!moviment_.game_is_open)
                        return;

                    var aux = [this.initial[0] - this.final[0], this.initial[1] - this.final[1]];

                    if(Math.abs(aux[0]) > Math.abs(aux[1]))
                    {   //HORIZONTAL
                        if( Math.abs(aux[0]) < 70)
                            return;
                        temporario.move_continuous([(aux[0]>0?-1:1), 0]);
                    }
                    else
                    {   //VERTICAL
                        if( Math.abs(aux[1]) < 70)
                            return;
                        temporario.move_continuous([0, (aux[1]>0?-1:1)]);
                    }

                }
            );
        //

        
        console.log('eventos adicionados');
    }

    input_teclado (param) {

        let input = [0,0];

        
        console.log('input_teclado');
    
        if(!this.moviment.game_container_is_open)
            return
    
        switch(param) {
            case 'a':
                input = [-1,0];
                break;
            case 'd':
                input = [1,0];
                break;
            case 'w':
                input = [0,-1];
                break;
            case 's':
                input = [0,1];
                break;
            case 'arrowleft':
                input = [-1,0];
                break;
            case 'arrowright':
                input = [1,0];
                break;
            case 'arrowup':
                input = [0,-1];
                break;
            case 'arrowdown':
                input = [0,1];
                break;
            default:
                return;
        }
    
        console.log(input);
        this.moviment.move_continuous(input);
    }

}

class Moviment {

    constructor() {    
        this.x_cordinate = 0;
        this.y_cordinate = 0;
        this.game_container_is_open = true;
        
        this.player_element = document.querySelector('.player1');
        document.getElementById('arrow').style.transform = 'scale(1, 1)';

        this.cellSize = 45;
      
        this.#SetColliders();
        this.#SetClickEvents();

        this.actual_player_anim = 0;
        this.cast_view = 0;

        this.moveQueue = new Queue();
    }

    async #AllowToCastView() {

        //console.log("chegou");

        if (this.cast_view == 0)
            console.log('bloqueou');

        this.cast_view += 1;


        const delay_seconds = 1 * 1000;
         await new Promise(resolve => setTimeout(resolve, delay_seconds));
    
        this.cast_view -= 1;
        if (this.cast_view == 0)
            console.log('liberou');

        //console.log('saiu');
        
    }

    #SetColliders() {

        this.mapa = [ [1, 0, 0, 0, 0],
                        [1, 1, 1, 0, 1],
                        [0, 1, 1, 1, 1],
                        [1, 1, 0, 0, 0],
                        [1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 0],
                        [0, 0, 0, 1, 1] ];

        this.x = Number(5);
        this.y = Number(7);
        
        this.player_element.style.transition = 'none';
        this.player_element.style.left = `${this.x_cordinate * this.cellSize}px`;
        this.player_element.style.top  = `${this.y_cordinate * this.cellSize}px`;
    }

    move_to(direc) {
        
        if(direc[0]==1) {
            if(this.x_cordinate+1 >= this.x)
                return false;
    
            if(this.mapa[this.y_cordinate][this.x_cordinate+1] == 0)
                return false;
    
            this.x_cordinate++;
        } else if(direc[0]==-1) {
            if(this.x_cordinate == 0)
                return false;
                
            if(this.mapa[this.y_cordinate][this.x_cordinate-1] == 0)
                return false;
    
            this.x_cordinate--;
        } else if(direc[1]==-1) {
            if(this.y_cordinate == 0)
                return false;
                
            if(this.mapa[this.y_cordinate-1][this.x_cordinate] == 0)
                return false;
    
            this.y_cordinate--;
        } else if(direc[1]==1) {
            if(this.y_cordinate+1 == this.y)
                return false;
                
            if(this.mapa[this.y_cordinate+1][this.x_cordinate] == 0)
                return false;
    
            this.y_cordinate++;
        }
    
        return true;
    }

    teleport_to(index, scroll_view) {

        //if(this.cast_view > 0)
        //    return;

        if(this.y_cordinate == Math.floor(index/this.x) & this.x_cordinate == index%this.x)
            return;

        if( !this.player_element.style.animation.includes('surgir1') )
            this.player_element.style.animation = 'surgir1 150ms ease-out';
        else
        this.player_element.style.animation = 'surgir2 150ms ease-out';
    
        this.y_cordinate = Math.floor(index/this.x);
        this.x_cordinate = index%this.x;
        
        this.player_element.style.transition = 'none';
        this.player_element.style.left = `${this.x_cordinate * this.cellSize}px`;
        this.player_element.style.top  = `${this.y_cordinate * this.cellSize}px`;

        this.#refresh_gui(scroll_view);
    }

    #player_colors(index) {

        document.documentElement.style.setProperty('--player-color-anim0', 'none');
        document.documentElement.style.setProperty('--player-color-anim1', 'none');
    


        switch(index) {
            case 'white':
                document.documentElement.style.setProperty('--player-color0', "#d4d4d4");
                document.documentElement.style.setProperty('--player-color1', "#ffffff");

                //document.documentElement.style.setProperty('--handlebar-color', "#d4d4d4");
                break;
            case 'yellow':
                document.documentElement.style.setProperty('--player-color0', "#F0BE09");
                document.documentElement.style.setProperty('--player-color1', "#FFD22E");

                
                document.documentElement.style.setProperty('--handlebar-color', "#FFD22E");
                break;
            case 'blue':
                document.documentElement.style.setProperty('--player-color0', "#0099DB");
                document.documentElement.style.setProperty('--player-color1', "#0AB2FA");

                document.documentElement.style.setProperty('--handlebar-color', "#0AB2FA");
                break;
            case 'red':
                document.documentElement.style.setProperty('--player-color0', "#ff4b4b");
                document.documentElement.style.setProperty('--player-color1', "#ff6d6d");

                document.documentElement.style.setProperty('--handlebar-color', "#ff6d6d");
                break;
            case 'green':
                document.documentElement.style.setProperty('--player-color0', "#29eb90");
                document.documentElement.style.setProperty('--player-color1', "#46ffa2");
                
                document.documentElement.style.setProperty('--handlebar-color', "#46ffa2");
                break;
            case 'pink':
                document.documentElement.style.setProperty('--player-color0', "#a547ad");
                document.documentElement.style.setProperty('--player-color1', "#eb63f0");
                
                document.documentElement.style.setProperty('--handlebar-color', "#eb63f0");
                break;
            case 'rainbow':
                document.documentElement.style.setProperty('--player-color-anim0', 'rainbow1 3s infinite linear');
                document.documentElement.style.setProperty('--player-color-anim1', 'rainbow2 3s infinite linear');

                document.documentElement.style.setProperty('--handlebar-color', "#d4d4d4");
                break;
    
        }
    }

    #scroll_to (class_name) {

        const element = document.querySelector(`.${class_name}`);

        const w_height = window.innerHeight,
              e_height = element.getBoundingClientRect().height;

        const block = (w_height >= e_height ? 'center' : 'start');


        if(navigator.userAgent.includes("Android"))
            element.scrollIntoView({ behavior: 'smooth', block: block});
        else
            element.scrollIntoView({ behavior: 'smooth', block: block});

        this.#AllowToCastView();
    }

    #refresh_gui(scroll_view) {

        document.getElementById('legenda').textContent = '\xA0';

        switch(this.x_cordinate + this.y_cordinate*this.x) {
            case 0:
                document.getElementById('legenda').textContent = 'bem-vindo!';
                if(scroll_view)
                    this.#scroll_to('tutorial')
                this.#player_colors('yellow');
                break;
            case 7:
                document.getElementById('legenda').textContent = 'sobre mim';
                if(scroll_view)
                    this.#scroll_to('info')
                this.#player_colors('blue');
                break;
            case 9:
                //let char = "&ccedil";
                //document.getElementById('legenda').textContent = '\xEA \u0303 ';
                document.getElementById('legenda').textContent = 'projetos';
                if(scroll_view)
                    this.#scroll_to('projetos')
                this.#player_colors('green');
                break;
            case 24:
                document.getElementById('legenda').textContent = 'minhas skills';
                if(scroll_view)
                    this.#scroll_to('skills')
                this.#player_colors('pink');
                break;
            case 25:
                document.getElementById('legenda').textContent = `forma\xE7\xE3o`;                
                if(scroll_view)
                    this.#scroll_to('formacoes')
                    
                this.#player_colors('red');
                break;
            case 34:
                document.getElementById('legenda').textContent = 'obrigado pela visita!';
                if(scroll_view)
                    this.#scroll_to('inprogress')
                this.#player_colors('rainbow');
                break;
            default:
                this.showed = null;
                this.#player_colors('white');
                break;
        }
        
    }

    move_continuous(direc_) {

        this.moveQueue.enqueue(direc_);
        if(this.moveQueue.length > 1)
            return;

        const sliding = async() => {
            
            while(this.moveQueue.length > 0) {
                const direc = this.moveQueue.peek();
                let aux = 0;

                while(this.move_to(direc))
                    aux++;
        
                if(aux > 0) {
                    aux+=2;
                    
                    // PLAYER TRANSITION
                    this.player_element.style.transition = (aux*this.cellSize) + 'ms ease-out all';
                    
                    document.documentElement.style.setProperty('--anim-shrink', (1-aux/20));
                    document.documentElement.style.setProperty('--anim-grow', (1+aux/20));
                    
                    // PLAYER ANIMATION
                    this.player_element.style.animation = `${this.#direc_to_string(direc)} ${aux*70}ms linear`;
                    
                    // PLAYER POSITION
                    this.player_element.style.left = `${this.x_cordinate * this.cellSize}px`;
                    this.player_element.style.top  = `${this.y_cordinate * this.cellSize}px`;
                    
                    // CAST WHERE THE PLAYER IS LANDING
                    this.#refresh_gui(true);
                }
                
                // AWAIT FOR THE PLAYER TO LAND
                await new Promise(resolve => setTimeout(resolve, ((aux-1)*50)));
                this.moveQueue.dequeue();
            }
        }

        sliding();
    }

    #direc_to_string(param) {

        if(param[0] == 1)
            return 'direita';
        else if (param[0] == -1)
            return 'esquerda';
        else if (param[1] == 1)
            return 'baixo';
        else
            return 'cima';
    }

    open_game_container(to_open) {

        let game_container = document.querySelector('.game');

        let container_width;
        if(window.innerWidth > 900) {
            container_width = window.getComputedStyle(document.documentElement).getPropertyValue("--game-max-size");
        } else {
            container_width = window.getComputedStyle(document.documentElement).getPropertyValue("--game-min-size");
        }

        document.documentElement.style.setProperty('--game-size', container_width);
        
        if(to_open == null || this.game_container_is_open == to_open){
            console.log('return', this.game_container_is_open, to_open)
            return;
        }

        if(to_open) {
            game_container.style.animation = 'abrir_game 400ms ease-out forwards';
            document.getElementById('arrow').style.transform = 'scale(1, 1)';
        }
        else {
            game_container.style.animation = 'fechar_game 400ms ease-out forwards';
            document.getElementById('arrow').style.transform = 'scale(-1, 1)';
        }

        this.game_container_is_open = to_open;
        console.log('end of function', this.game_container_is_open, to_open)
    }

    #SetClickEvents(){
        let board;
        board = document.querySelector(".board1");

        const criar = (top, left, pos, boardd) => {
            let a = boardd.appendChild(document.createElement("button"));
            a.addEventListener('click', (event) => { this.teleport_to(pos, true); }, false);
            a.classList.add("atalho");
            a.style.top = `${top * this.cellSize}px`; //top
            a.style.left = `${left * this.cellSize}px`; //left
        };
        
        criar(0, 0,  0, board); // 0
        criar(1, 2,  7, board); // 1
        criar(1, 4,  9, board); // 2
        criar(4,4, 24, board); // 3   
        criar(5,0, 25, board); // 4
        criar(6,4, 34, board); // 5
    }

}

const moviment = new Moviment();
const input = new Input(moviment);
//const game = document.getElementById("game");
moviment.open_game_container(null);

document.getElementById('colapse_button').addEventListener('click', (event) => {
    moviment.open_game_container(!moviment.game_container_is_open);
}, false);
window.addEventListener('resize', function(event) {
    moviment.open_game_container(null);
});

//moviment.open_board(true);
//moviment.move_to(0);

class DragToScroll {

    constructor(element) {
        this.element = document.getElementById(element);
        //this.pos = { top: 0, left: 0, x: 0, y: 0 };

        this.#add_eventos();
    }

    #add_eventos() {
        let pos = { top: 0, left: 0, x: 0, y: 0 };
        const ele = this.element;
        
        const mouseMoveHandler = function (e) {
            // How far the mouse has been moved
            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;
        
            // Scroll the element
            ele.scrollTop = pos.top - dy;
            ele.scrollLeft = pos.left - dx;
        };

        const mouseUpHandler = function () {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        
            ele.style.cursor = 'grab';
            ele.style.removeProperty('user-select');
        };
        
        const mouseDownHandler = function (e) {
            pos = {
                // The current scroll
                top: ele.scrollTop,
                left: ele.scrollLeft,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };
            
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };

        this.element.addEventListener('mousedown', (event) => mouseDownHandler(event), false);

    }
}

let drag = new DragToScroll('project_slider');


let projetos = document.querySelectorAll(".projeto");


const projetos_ = ['projeto_isso-e-um-cururu.html', 'projeto_unbeing.html', 'projeto_go-floresta.html', 'projeto_nassau.html'];

for (let index = 0; index < projetos.length; index++) {
    const element = projetos[index];
    
    let moveu;

    element.addEventListener('mousedown', (event) => {
        moveu = false;
    }, false);

    element.addEventListener('mousemove', (event) => {
        moveu = true;
    }, false);

    element.addEventListener('click', (event) => {
        const id = 'auxiliar';

        if(!moveu)
            loadHtml(id, projetos_[index])

    }, false);

}

function fechar_projeto() {
    document.getElementById('auxiliar').innerHTML = '';
}

function reqListener () {
    const botao_fechar = '<button id="projeto_fechar" onclick="fechar_projeto();">&#10006;</button>';
    document.getElementById('auxiliar').innerHTML = botao_fechar + this.responseText;
};

function loadHtml(id, filename) {

    let element = document.getElementById(id);
    

    fetch(`https://erbert-gadelha.github.io/meu-site/${filename}`)
    //fetch(`./${filename}`)
    .then(response => response.text())
    .then(htmlData => {
        element.innerHTML = htmlData;
    })
    .catch(error => {
        element.innerHTML = "<h1>Page not Found. :c</h1>";
        console.error('Erro ao carregar o HTML:', error);
    });
}




const container = document.getElementById('container');
const scroll_tuto = document.querySelector('.tutorial');
const scroll_info = document.querySelector('.info');
const scroll_proj = document.querySelector('.projetos');
const scroll_form = document.querySelector('.formacoes');
const scroll_skil = document.querySelector('.skills');
const scroll_prog = document.querySelector('.inprogress');


let previousWidth = window.innerWidth;
container.addEventListener('scroll', function () {

    
    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return(rect.top + (rect.height/2)) > 0;
    }

    if(previousWidth != window.innerWidth) {
        previousWidth = window.innerWidth;
        return;
    }

    if(moviment.cast_view > 0)
        return;
    
    
    if(isInViewport(scroll_tuto))
        moviment.teleport_to(0, false);
    else if(isInViewport(scroll_info))
        moviment.teleport_to(7, false);
    else if(isInViewport(scroll_proj))
        moviment.teleport_to(9, false);
    else if(isInViewport(scroll_form))
        moviment.teleport_to(25, false);
    else if(isInViewport(scroll_skil))
        moviment.teleport_to(24, false);
    else if(isInViewport(scroll_prog))
        moviment.teleport_to(34, false);
    

}, true);



let slider_button = document.querySelectorAll(".slider_button");

slider_button.forEach((button, index) => {

    const slider_container = document.getElementById('project_slider');
    const offset = ((index*2)-1);

    button.addEventListener('click', () => slider_container.scrollBy({ left: (243 * offset), behavior: 'smooth' }));
});