
export default class Moviment {

    constructor(_mapa) {
        this.x = Number(5);
        this.y = Number(7);
        this.mapa = [1, 0, 0, 0, 0,
                    1, 1, 1, 0, 1,
                    0, 1, 1, 1, 1,
                    1, 1, 0, 0, 0,
                    1, 1, 1, 1, 1,
                    1, 1, 1, 1, 0,
                    0, 0, 0, 1, 1];

        this.pos = 0;
        this.showed = null;
        this.focused = false;
        
        this.player = document.querySelector('.player');
      
        this.#setar_atalhos(document.querySelectorAll('.atalho'));
    }

    move(param) {
    
        if(param[0]==1) {
            if(this.pos%5 == 4)
                return false;
    
            if(this.mapa[this.pos+1] == '0')
                return false;
    
            this.pos++;
        } else if(param[0]==-1) {
            if(this.pos%5 == 0)
                return false;
                
            if(this.mapa[this.pos-1] == 0)
                return false;
    
            this.pos--;
        } else if(param[1]==-1) {
            if(this.pos <= 4)
                return false;
                
            if(this.mapa[this.pos-5] == 0)
                return false;
    
            this.pos-=5;
        } else if(param[1]==1) {
            if(this.pos > 29)
                return false;
                
            if(this.mapa[this.pos+5] == 0)
                return false;
    
            this.pos+=5;
        }
    
        return true;
    }

    move_to(param) {

        //window.alert('move to ' + param);
    
        /*if( player.classList.contains("teleporte1")) {
            player.classList.remove("anim1");
            player.classList.remove("anim2");
            player.classList.remove("anim3");
            player.classList.remove("anim4");
            player.classList.remove("teleporte1");
            player.classList.remove("teleporte2");
            player.classList.add("teleporte2");
        } else {
            player.classList.remove("anim1");
            player.classList.remove("anim2");
            player.classList.remove("anim3");
            player.classList.remove("anim4");
            player.classList.remove("teleporte2");
            player.classList.remove("teleporte1");
            player.classList.add("teleporte1");
        }*/
    
        //window.alert(player.style.animation);
    
        //var audio = new Audio('audio_1.M4A');
        //audio.play();
        
    
        if( !this.player.style.animation.includes('surgir1') )
            this.player.style.animation = 'surgir1 150ms ease-out';
        else
        this.player.style.animation = 'surgir2 150ms ease-out';
    
    
        this.pos = param;
        
        this.player.style.transition = 'none';
    
        this.player.style.left = ((this.pos%5) * 50) + 'px';
        this.player.style.top  = (Math.floor(this.pos/5) * 50) + 'px';
    
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

        if(this.showed != null)
        this.showed.style.display = 'none';
        let botao = document.getElementById('botao');
        
        //0xE2 0xA0 0x80
        document.getElementById('legenda').textContent = '\xA0';
        botao.disabled = false;
        this.cores('white');
        
        switch(this.pos) {
            case 0:
                document.getElementById('legenda').textContent = 'bem-vindo!';
    
                this.showed = document.querySelector('.tutorial');
                this.showed.style.display = 'flex';
                this.cores('yellow');
                break;
            case 5:
                document.querySelector('.tutorial').style.display = 'none';
    
                this.showed = null;
                botao.disabled = true;
                
                break;
            case 7:
                document.getElementById('legenda').textContent = 'sobre mim';
    
                this.showed = document.querySelector('.info');
                this.showed.style.display = 'flex';
                this.cores('blue');
                break;
            case 9:
                //let char = "&ccedil";
                //document.getElementById('legenda').textContent = '\xEA \u0303 ';
                document.getElementById('legenda').textContent = 'experi\xEAncias';
    
                this.showed = document.querySelector('.inprogress');
                this.showed.style.display = 'flex';
                this.cores('green');
                break;
            case 24:
                document.getElementById('legenda').textContent = 'o que procuro';
    
                this.showed = document.querySelector('.inprogress');
                this.showed.style.display = 'flex';
                this.cores('pink');
                break;
            case 25:
                document.getElementById('legenda').textContent = `forma\xE7\xE3o`;
    
                this.showed = document.querySelector('.inprogress');
                this.showed.style.display = 'flex';
                this.cores('red');
                break;
            case 34:
                document.getElementById('legenda').textContent = 'obrigado pela visita!';
                
                this.showed = document.querySelector('.inprogress');
                this.showed.style.display = 'flex';
                this.cores('rainbow');
                break;
            default:
                this.showed = null;
                botao.disabled = true;
                break;
        }
    }

    slide(input) {

        let bool = true;
        let aux = 1;
    
        while(aux < 10 & bool) {
            bool = this.move(input);
            aux++;
        }
        
        if(aux > 2) {
    
            this.player.style.transition = (aux*50) + 'ms ease-out all';
    
            if(input[0] == 1)
                this.player.style.animation = 'direita '+(aux+2)*50+'ms linear';
            else if (input[0] == -1)
                this.player.style.animation = 'esquerda '+(aux+2)*50+'ms linear';
            else if (input[1] == 1)
                this.player.style.animation = 'baixo '+(aux+2)*50+'ms linear';
            else
                this.player.style.animation = 'cima '+(aux+2)*50+'ms linear';
    
            //var audio = new Audio('audio_2.M4A');
            //audio.play();
    
            this.player.style.left = ((this.pos%5) * 50) + 'px';
            this.player.style.top  = (Math.floor(this.pos/5) * 50) + 'px';
    
            this.show_hide();
        }
        
    }

    focus_on(param) {
        //return;
    
        let aux1 = document.querySelector('.game');
        let aux2 = document.querySelector('.textos');
        
    
        if(window.innerWidth >= 900) {
            aux1.style.display = 'flex';
            aux2.style.display = 'flex';
            //move_to(pos);
    
        } else {
    
            if(this.showed == null)
                param = true;
    
            if(param) {
                aux1.style.display = 'flex';
                aux2.style.display = 'none';
    
                document.querySelector('.arrow').style.transform = 'rotate(90deg)';
            }
            else {
                aux1.style.display = 'none';
                aux2.style.display = 'flex';
    
                document.querySelector('.arrow').style.transform = 'rotate(-90deg)';
            }
    
            this.focused = param;
            //move_to(pos);
        }
    
        //move_to(pos);
        
    }

    #setar_atalhos(atalhos){
        atalhos[0].style.margin = "9px 7px";
        atalhos[0].addEventListener('click', (event) => { this.move_to(0); }, false);
        
        atalhos[1].style.margin = "59px 107px";
        atalhos[1].addEventListener('click', (event) => { this.move_to(7); }, false);
        
        atalhos[2].style.margin = "59px 207px";
        atalhos[2].addEventListener('click', (event) => { this.move_to(9); }, false);
        
        
        atalhos[3].style.margin = "209px 207px";
        atalhos[3].addEventListener('click', (event) => { this.move_to(24); }, false);
        
        atalhos[4].style.margin = "259px 7px";
        atalhos[4].addEventListener('click', (event) => { this.move_to(25); }, false);
        
        atalhos[5].style.margin = "309px 207px";
        atalhos[5].addEventListener('click', (event) => { this.move_to(34); }, false);
    }

}