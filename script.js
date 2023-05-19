//import Moviment from "./scripts/Moviment.js";
//import Input from "./scripts/Input.js";

document.querySelector('.t1').style.display = (!navigator.userAgent.includes("Android")?"flex":"none");
document.querySelector('.t2').style.display = ( navigator.userAgent.includes("Android")?"flex":"none");

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
            tela_.addEventListener("touchstart",
                function clicked2(e) {

                    //e.preventDefault();        

                    let br = tela_.getBoundingClientRect();
                    
                    let x = (e.touches[0].clientX - br.left);
                    let y = (e.touches[0].clientY - br.top);
                    this.initial = [x, y];
                }
            );
            
            this.tela.addEventListener("touchmove",
                function clicked2(e) {
                    //e.preventDefault(); 

                    var br = tela_.getBoundingClientRect();
                    
                    let x = (e.touches[0].clientX - br.left);
                    let y = (e.touches[0].clientY - br.top);

                    this.final = [x, y];
                    
                }
            );
            const temporario = this.moviment;
            this.tela.addEventListener("touchend",
                function clicked2(e) {
                    //e.preventDefault(); 
                    var aux = [this.initial[0] - this.final[0], this.initial[1] - this.final[1]];

                    if(Math.abs(aux[0]) > Math.abs(aux[1]))
                    {   //HORIZONTAL
                        if( Math.abs(aux[0]) < 50)
                            return;
                        temporario.slide([(aux[0]>0?-1:1), 0]);
                    }
                    else
                    {   //VERTICAL
                        if( Math.abs(aux[1]) < 50)
                            return;
                        temporario.slide([0, (aux[1]>0?-1:1)]);
                    }

                }
            );
        //
    }

    input_teclado (param) {

        let input = [0,0];
    
        if(window.innerWidth < 900 & !this.moviment.focused)
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
    
        this.moviment.slide(input);
    }

}

class Moviment {

    constructor() {    
        this.posX = 0;
        this.posY = 0;
        this.showed = null;
        this.focused = false;
        
        this.player1 = document.querySelector('.player1');
        this.player2 = document.querySelector('.player2');
      
        this.set_board(0);
        //this.set_board(1);
        this.#setar_atalhos();

        this.cor_transic = 1;
        this.id_transic = 0;

        this.rastros = new Array(20);

        for (let index = 0; index < 20; index++) {
            const board = document.querySelector('.board2');

            let a = board.appendChild(document.createElement("span"));
            a.classList.add("rastro");
            this.rastros[index] = a;
        }
    }

    set_board(param) {

        
        this.actual_board = param;

        if(param == 0){
            document.querySelector(".board1").style.display = "flex";
            document.querySelector(".board2").style.display = "none";

            this.mapa = [ [1, 0, 0, 0, 0],
                          [1, 1, 1, 0, 1],
                          [0, 1, 1, 1, 1],
                          [1, 1, 0, 0, 0],
                          [1, 1, 1, 1, 1],
                          [1, 1, 1, 1, 0],
                          [0, 0, 0, 1, 1] ];

             this.x = Number(5);
             this.y = Number(7);
             this.move_to(0);

        } else {
            document.querySelector(".board1").style.display = "none";
            document.querySelector(".board2").style.display = "flex";

             this.mapa = [  [0,0,1,1,1, 1,1,1,0,1],
                            [0,0,1,0,1, 0,0,1,1,1],
                            [0,0,0,0,1, 1,1,1,1,1],
                            [1,1,1,1,1, 0,1,1,1,1],
                            [1,0,1,1,1, 0,1,1,0,1],

                            [1,0,1,1,0, 0,1,0,0,1],
                            [1,0,0,1,1, 1,1,1,1,1],
                            [1,0,0,1,0, 0,0,0,1,0],
                            [1,0,0,0,0, 0,0,0,1,0],
                            [1,1,1,1,1, 1,1,1,1,0]];

             
             this.x = Number(10);
             this.y = Number(10);
             this.move_to(9);
        }        
    }

    move(param) {
        //param:{x, y}

        //console.log(`[${this.mapa}][${this.posX}:${this.posY}]`);
    
        if(param[0]==1) {
            if(this.posX+1 >= this.x)
                return false;
    
            if(this.mapa[this.posY][this.posX+1] == 0)
                return false;
    
            this.posX++;
        } else if(param[0]==-1) {
            if(this.posX == 0)
                return false;
                
            if(this.mapa[this.posY][this.posX-1] == 0)
                return false;
    
            this.posX--;
        } else if(param[1]==-1) {
            if(this.posY == 0)
                return false;
                
            if(this.mapa[this.posY-1][this.posX] == 0)
                return false;
    
            this.posY--;
        } else if(param[1]==1) {
            if(this.posY+1 == this.y)
                return false;
                
            if(this.mapa[this.posY+1][this.posX] == 0)
                return false;
    
            this.posY++;
        }
    
        return true;
    }

    move_to(param) {

        if(this.actual_board == 0) {
            if( !this.player1.style.animation.includes('surgir1') )
                this.player1.style.animation = 'surgir1 150ms ease-out';
            else
            this.player1.style.animation = 'surgir2 150ms ease-out';
        }
    
        console.log(`[${this.x}:${this.y}]`);
        this.posY = Math.floor(param/this.x);
        this.posX = param%this.x;
        
        if(this.actual_board == 0) {
            this.player1.style.transition = 'none';
        
            this.player1.style.left = (this.posX * 50) + 'px';
            this.player1.style.top  = (this.posY * 50) + 'px';
        } else {
            this.player2.style.transition = 'none';
        
            this.player2.style.left = (this.posX * 50) + 'px';
            this.player2.style.top  = (this.posY * 50) + 'px';

            this.player2.src = "images/player_gif.gif";
        }
    
        this.show_hide();
    }

    cores(param) {

        document.querySelector(".fil4").style.animation = 'none';
        document.querySelector(".fil5").style.animation = 'none';
        document.querySelector(".fil4").style.outline = 'none';
    
        switch(param) {
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

    show_hide() {

        //if(this.showed != null)
        //this.showed.style.display = 'none';
        //let botao = document.getElementById('botao');
        
        document.getElementById('legenda').textContent = '\xA0';
        //botao.disabled = false;

        if(this.actual_board == 0) {

            this.cores('white');
            switch(this.posX + this.posY*this.x) {
                case 0:
                    document.getElementById('legenda').textContent = 'bem-vindo!';
                    document.querySelector('.tutorial').scrollIntoView({ behavior: 'smooth', block: 'end'});
                    this.cores('yellow');
                    break;
                case 5:
                    //botao.disabled = true;
                    break;
                case 7:
                    document.getElementById('legenda').textContent = 'sobre mim';
                    document.querySelector('.info').scrollIntoView({ behavior: 'smooth', block: 'start'});
                    this.cores('blue');
                    break;
                case 9:
                    //let char = "&ccedil";
                    //document.getElementById('legenda').textContent = '\xEA \u0303 ';
                    document.getElementById('legenda').textContent = 'projetos';
                    document.querySelector('.projetos').scrollIntoView({ behavior: 'smooth', block: 'start'});
                    this.cores('green');
                    break;
                case 24:
                    document.getElementById('legenda').textContent = 'o que procuro';
                    document.querySelector('.inprogress').scrollIntoView({ behavior: 'smooth', block: 'start'});
                    this.cores('pink');
                    break;
                case 25:
                    document.getElementById('legenda').textContent = `forma\xE7\xE3o`;
                    document.querySelector('.inprogress').scrollIntoView({ behavior: 'smooth', block: 'start'});
                    //this.showed.style.display = 'flex';
                    this.cores('red');
                    break;
                case 34:
                    document.getElementById('legenda').textContent = 'obrigado pela visita!';
                    document.querySelector('.inprogress').scrollIntoView({ behavior: 'smooth', block: 'start'});
                    this.cores('rainbow');
                    break;
                default:
                    this.showed = null;
                    //botao.disabled = true;
                    break;
            }
        } else {
            switch(this.posX + this.posY*this.x) {
                case 9:
                    document.getElementById('legenda').textContent = 'bem-vindo!';
        
                    this.showed = document.querySelector('.tutorial');
                    this.showed.style.display = 'flex';
                    break;
                case 63:
                    document.getElementById('legenda').textContent = 'sobre mim';
        
                    this.showed = document.querySelector('.info');
                    this.showed.style.display = 'flex';
                    break;
                case 5:
                    document.getElementById('legenda').textContent = 'sobre mim';
        
                    this.showed = document.querySelector('.info');
                    this.showed.style.display = 'flex';
                    break;
                case 44:
                    document.getElementById('legenda').textContent = 'experi\xEAncias';
        
                    this.showed = document.querySelector('.inprogress');
                    this.showed.style.display = 'flex';
                    break;
                case 98:
                    document.getElementById('legenda').textContent = 'o que procuro';
        
                    this.showed = document.querySelector('.inprogress');
                    this.showed.style.display = 'flex';
                    this.cores('pink');
                    break;
                case 46:
                    document.getElementById('legenda').textContent = `forma\xE7\xE3o`;
        
                    this.showed = document.querySelector('.inprogress');
                    this.showed.style.display = 'flex';
                    break;
                case 12:
                    document.getElementById('legenda').textContent = 'obrigado pela visita!';
                    
                    this.showed = document.querySelector('.inprogress');
                    this.showed.style.display = 'flex';
                    break;
                default:
                    this.showed = null;
                    //botao.disabled = true;
                    break;
            }
        }
    }

    slide(input) {

        let bool = true;
        let aux = 1;
    
        while(aux < 10 & bool) {
            bool = this.move(input);
            aux++;
        };

        if(aux > 2) {
            if(this.actual_board == 0) {
                this.player1.style.transition = (aux*50) + 'ms ease-out all';

                if(input[0] == 1)
                    this.player1.style.animation = 'direita '+(aux+2)*50+'ms linear';
                else if (input[0] == -1)
                    this.player1.style.animation = 'esquerda '+(aux+2)*50+'ms linear';
                else if (input[1] == 1)
                    this.player1.style.animation = 'baixo '+(aux+2)*50+'ms linear';
                else
                    this.player1.style.animation = 'cima '+(aux+2)*50+'ms linear';

                this.player1.style.left = (this.posX * 50) + 'px';
                this.player1.style.top  = (this.posY * 50) + 'px';
            } else {
                
                this.player2.style.transition = (aux*50) + 'ms linear all';
                this.player2.style.left = (this.posX  * 50) + 'px';
                this.player2.style.top  = (this.posY  * 50) + 'px';

                if(input[0] == 1)
                    this.anim('direita', aux);
                else if (input[0] == -1)
                    this.anim('esquerda', aux);
                else if (input[1] == 1)
                    this.anim('baixo', aux);
                else
                    this.anim('cima', aux);
            }
    
            //var audio = new Audio('audio_2.M4A');
            //audio.play();
    
            this.show_hide();
        }
        
    }

    async anim(direc, tempo) {

        tempo *= 10;

        for (let index = 0; index < 7; index++) {
            this.player2.src =  `images/player2/${direc}_${index}.png`;
            await new Promise(resolve => setTimeout(resolve, tempo));
        }

      }

    focus_on(param) {
    
        let aux1 = document.querySelector('.game');
        let aux2 = document.querySelector('.container');
        
        if(param) {  // FOCA NO GAME
            
            aux1.style.marginLeft = '0px';
            document.querySelector('.arrow').style.transform = 'rotate(90deg)';
        }
        else {// FOCA NO CONTAINER

            // SE TELA TIVE ESPACO
            if(window.innerWidth > 900) 
                aux1.style.marginLeft = '-490px';
            else
                aux1.style.marginLeft = '-88%';

            document.querySelector('.arrow').style.transform = 'rotate(-90deg)';
        }

        this.focused = param;
        
    }

    #setar_atalhos(){
        let board;
        board = document.querySelector(".board1");

        const criar = (top, left, pos, boardd) => {
            let a = boardd.appendChild(document.createElement("button"));
            a.addEventListener('click', (event) => { this.move_to(pos); }, false);
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

        board = document.querySelector(".board2");
        criar(" 50px","  100px",  12, board); // 0
        criar(" 0px"," 450px",  9, board); // 1
        criar("200px","200px", 44, board); // 3  

        criar("200px","300px",  46, board); // 2 
        criar("300px","150px", 63, board); // 5
        criar("450px","400px", 98, board); // 4
    }

}

const moviment = new Moviment();
const input = new Input(moviment);
const game = document.getElementById("game");

document.getElementById('botao').addEventListener('click', (event) => {
    moviment.focus_on(!moviment.focused);
    //window.alert('botao');
}, false);
window.addEventListener('resize', function(event) {
    moviment.focus_on(moviment.focused);
});

moviment.focus_on(true);
//moviment.move_to(9);

document.getElementById("change").addEventListener('click', (event) => {
    const transicao = async function transicao () {
        document.getElementById('barra_cima').style.height = '50vh';
        document.getElementById('barra_cima').style.margin = '0';
        document.querySelector('.cortina').style.backgroundColor = 'white';
        auxiliar = true;
    
        await new Promise(resolve => setTimeout(resolve, 300));
        if(moviment.actual_board==0) {
            moviment.set_board(1);
            game.classList.add('retro');
        } else {
            moviment.set_board(0);
            game.classList.remove('retro');
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
    
        document.getElementById('barra_cima').style.height = '0px';
        document.getElementById('barra_cima').style.marginBottom = '100vh';
        document.querySelector('.cortina').style.backgroundColor = 'transparent';
        auxiliar = false;
    }

    transicao();
}, false);