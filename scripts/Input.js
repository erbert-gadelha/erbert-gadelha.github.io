
export default class Input {
    
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
                this.input_teclado(event.key.toLowerCase());
            }, false);
        //
        //  EVENTOS TOUCH
            let tela_ = document.getElementById("game");
            tela_.addEventListener("touchstart",
                function clicked2(e) {
                    let br = tela_.getBoundingClientRect();
                    
                    let x = (e.touches[0].clientX - br.left);
                    let y = (e.touches[0].clientY - br.top);
                    this.initial = [x, y];
                }
            );
            
            this.tela.addEventListener("touchmove",
                function clicked2(e) {

                    var br = tela_.getBoundingClientRect();
                    
                    let x = (e.touches[0].clientX - br.left);
                    let y = (e.touches[0].clientY - br.top);

                    this.final = [x, y];
                    
                }
            );
            const temporario = this.moviment;
            this.tela.addEventListener("touchend",
                function clicked2(e) {
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