//import Moviment from "./scripts/Moviment.js";
//import Input from "./scripts/Input.js";

if(navigator.userAgent.includes("Android")) {
    //document.getElementById('game').style.display = 'none';
    document.querySelector('.tutorial').style.display = 'none';
}


class Input {
    
    constructor(_moviment) {
        
        this.initial = [0,0]
        this.final = [0,0];

        this.tela = document.getElementById("game");
        this.moviment = _moviment;

        this.adicionar_eventos();
    }

    adicionar_eventos() {

        //  EVENTOS TECLADO
            document.addEventListener('keydown', (event) => {
                if([37,38,39,40].indexOf(event.keyCode) > -1)
                    event.preventDefault();                

                this.input_teclado(event.key.toLowerCase());
            }, false);
        //
        //  EVENTOS TOUCH
            let tela_ = document.getElementById("game");
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

                    if(x < br.width)
                        e.preventDefault();

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

                    if(x < br.width)
                        e.preventDefault();

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
    }

    input_teclado (param) {

        let input = [0,0];
    
        if(!this.moviment.game_is_open)
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
    
        this.moviment.move_continuous(input);
    }

}

class Moviment {

    constructor() {    
        this.x_cordinate = 0;
        this.y_cordinate = 0;
        this.game_is_open = true;
        
        this.player_element = document.querySelector('.player1');
        document.querySelector('.arrow').style.transform = 'rotate(90deg)';
      
        this.#SetColliders();
        this.#SetClickEvents();

        this.actual_player_anim = 0;
        this.cast_view = 0;
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
        this.player_element.style.left = (this.x_cordinate * 50) + 'px';
        this.player_element.style.top  = (this.y_cordinate * 50) + 'px';
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

        if(this.cast_view > 0)
            return;

        if(this.y_cordinate == Math.floor(index/this.x) & this.x_cordinate == index%this.x)
            return;

        if( !this.player_element.style.animation.includes('surgir1') )
            this.player_element.style.animation = 'surgir1 150ms ease-out';
        else
        this.player_element.style.animation = 'surgir2 150ms ease-out';
    
        this.y_cordinate = Math.floor(index/this.x);
        this.x_cordinate = index%this.x;
        
        this.player_element.style.transition = 'none';
        this.player_element.style.left = (this.x_cordinate * 50) + 'px';
        this.player_element.style.top  = (this.y_cordinate * 50) + 'px';

        this.#refresh_gui(scroll_view);
    }

    #player_colors(index) {

        document.querySelector(".fil4").style.animation = 'none';
        document.querySelector(".fil5").style.animation = 'none';
        document.querySelector(".fil4").style.outline = 'none';
    
        switch(index) {
            case 'white':
                document.querySelector(".fil4").style.fill = "#d4d4d4";
                document.querySelector(".fil5").style.fill = "#ffffff";
                break;
            case 'yellow':
                document.querySelector(".fil4").style.fill = "#F0BE09";
                document.querySelector(".fil5").style.fill = "#FFD22E";
                break;
            case 'blue':
                document.querySelector(".fil4").style.fill = "#0099DB";
                document.querySelector(".fil5").style.fill = "#0AB2FA";
                break;
            case 'red':
                document.querySelector(".fil4").style.fill = "#ff4b4b";
                document.querySelector(".fil5").style.fill = "#ff6d6d";
                break;
            case 'green':
                document.querySelector(".fil4").style.fill = "#29eb90";
                document.querySelector(".fil5").style.fill = "#46ffa2";
                break;
            case 'pink':
                document.querySelector(".fil4").style.fill = "#a547ad";
                document.querySelector(".fil5").style.fill = "#eb63f0";
                break;
            case 'rainbow':
                document.querySelector(".fil4").style.animation = "rainbow1 3s infinite linear";
                document.querySelector(".fil5").style.animation = "rainbow2 3s infinite linear";
    
                
                document.querySelector(".fil4").style.borderRadius = "500px";
                document.querySelector(".fil4").style.outline = "white solid 100px";
    
                
                //document.querySelector(".fil5").style.animation-delay = "0.7";
    
                //document.querySelector(".fil5").style.fill = "#00000050";
                break;
    
        }
    }

    #scroll_to (class_name) {
        //if(this.cast_view > 0)
        //    return;

        
        if(navigator.userAgent.includes("Android"))
            document.querySelector(`.${class_name}`).scrollIntoView({ behavior: 'smooth', block: 'start'});
        else
            document.querySelector(`.${class_name}`).scrollIntoView({ behavior: 'smooth', block: 'start'});
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

    move_continuous(direc) {

        let bool = true;
        let aux = 1;
    
        while(aux < 10 & bool) {
            bool = this.move_to(direc);
            aux++;
        };

        if(aux > 2) {

            this.player_element.style.transition = (aux*50) + 'ms ease-out all';

            if(direc[0] == 1)
                this.player_element.style.animation = 'direita '+(aux+2)*50+'ms linear';
            else if (direc[0] == -1)
                this.player_element.style.animation = 'esquerda '+(aux+2)*50+'ms linear';
            else if (direc[1] == 1)
                this.player_element.style.animation = 'baixo '+(aux+2)*50+'ms linear';
            else
                this.player_element.style.animation = 'cima '+(aux+2)*50+'ms linear';

            this.player_element.style.left = (this.x_cordinate * 50) + 'px';
            this.player_element.style.top  = (this.y_cordinate * 50) + 'px';
            
    
            this.#refresh_gui(true);
        }
        
    }

    open_board(open) {
    
        let aux1 = document.querySelector('.game');
        
        if(open) {  // FOCA NO GAME
            
            if(this.game_is_open == open) 
                aux1.style.marginLeft = '0';
            else
                aux1.style.animation = 'abrir_game 400ms ease-out forwards';

            document.querySelector('.arrow').style.transform = 'rotate(90deg)';
        }
        else {// FOCA NO CONTAINER
            

            if(this.game_is_open == open) {
                // SE TELA TIVE ESPACO
                if(window.innerWidth > 900) {
                    aux1.style.animation = 'none';
                    aux1.style.marginLeft = '-490px';
                }
                else {
                    aux1.style.animation = 'none';
                    aux1.style.marginLeft = 'calc(-100vw + 75px)';
                }

            } else {
                // SE TELA TIVE ESPACO
                if(window.innerWidth > 900) 
                    aux1.style.animation = 'fechar_game_1 400ms ease-out forwards';
                else
                    aux1.style.animation = 'fechar_game_2 400ms ease-out forwards';
            }

            document.querySelector('.arrow').style.transform = 'rotate(-90deg)';
        }

        this.game_is_open = open;
    }

    #SetClickEvents(){
        let board;
        board = document.querySelector(".board1");

        const criar = (top, left, pos, boardd) => {
            let a = boardd.appendChild(document.createElement("button"));
            a.addEventListener('click', (event) => { this.teleport_to(pos, true); }, false);
            a.classList.add("atalho");
            a.style.top = top;
            a.style.left = left;
        };
        
        criar("  0px","  0px",  0, board); // 0
        criar(" 50px","100px",  7, board); // 1
        criar(" 50px","200px",  9, board); // 2
        criar("200px","200px", 24, board); // 3   
        criar("250px","  0px", 25, board); // 4
        criar("300px","200px", 34, board); // 5
    }

}

const moviment = new Moviment();
const input = new Input(moviment);
const game = document.getElementById("game");

document.getElementById('botao').addEventListener('click', (event) => {
    moviment.open_board(!moviment.game_is_open);
    //window.alert('botao');
}, false);
window.addEventListener('resize', function(event) {
    moviment.open_board(moviment.game_is_open);
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

let drag = new DragToScroll('wasd');


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
        const filename = 'projeto_go-floresta.html';

        if(!moveu)
            loadHtml(id, projetos_[index])
            //readTextFile(filename);

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


    let xhttp;
    let element = document.getElementById(id);
    let file = filename;

    if(file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange == function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    element.innerHTML = this.responseText;
                } else if(this.status == 404) {
                    element.innerHTML = "<h1>Page not Found. :c</h1>";
                }
            }
        }
        xhttp.onload = reqListener;
        xhttp.open("get", file, true);
        xhttp.send();

        return;
    }
}




const container = document.querySelector('.container');
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


