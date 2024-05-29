const canvas= document.querySelector('canvas')
const c= canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravita =0.9
let myMusic
//sprite immagine 
class Sprite {
    constructor ({posizione, imagesrc, scale = 1, frameMax = 1, offset ={x:0,y:0} }) {
        this.posizione= posizione
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imagesrc
        this.scale = scale
        this.frameMax = frameMax//quanti frame ha un immgine
        this.frameOra = 0//se l'immagine ha un solo frame (sfondo) non sposta la visualizzazione
        this.framePassati = 0
        this.frameFuturi = 1//quanto veloce è l'animazione
        this.offset = offset
    }
    //disegna lo sprite
    draw(){
        c.drawImage(this.image,this.frameOra*(this.image.width/this.frameMax),0,(this.image.width/this.frameMax),this.image.height,this.posizione.x - this.offset.x,this.posizione.y - this.offset.y,(this.image.width/this.frameMax) * this.scale,this.image.height * this.scale)
    }

    animaFrame(){//funzione per animare gli sprite
        this.framePassati++
        if(this.framePassati % this.frameFuturi === 0){//rallenta animazione
            if(this.frameOra<this.frameMax -1){
                this.frameOra ++
            }else
            {
                this.frameOra = 0
            }
        }
    }

    //aggiorna lo sprite per il movimento
    aggiorna(){
        this.draw()
        this.animaFrame()
        
        
    }

}

//sprite del giocatore
class combattente extends Sprite{
    constructor ({posizione, velocita, color,imagesrc, scale = 1, frameMax = 1,offset ={x:0,y:0},sprites,attackBox={offset:{},width,height}}) {
        super({
            posizione,
            imagesrc,
            scale,
            frameMax,
            offset
        })
        this.velocita= velocita
        this.width = 50
        this.height = 150
        this.LastKey//tengo traccia dell'ultimo tasto premuto
        this.attackBox = {//proprietà dell oggetto attackBox
            posizione:{
                x: this.posizione.x,
                y: this.posizione.y
            } ,
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color=color//differenziare nemico e player
        this.isAttacking
        this.vita = 100
        this.frameOra = 0//se l'immagine ha un solo frame (sfondo) non sposta la visualizzazione
        this.framePassati = 0
        this.frameFuturi = 20//velocità aimazione
        this.sprites = sprites
        this.death = false

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imagesrc
        }
        console.log(this.sprites)
    }
    //aggiorna lo sprite per il movimento
    aggiorna(){
        if(!this.death)
            this.animaFrame()

        this.draw()
        

        //hitbox della spada lontano dal corpo
        this.attackBox.posizione.x = this.posizione.x + this.attackBox.offset.x
        this.attackBox.posizione.y = this.posizione.y + this.attackBox.offset.y

        //disegna hitbox
        //c.fillRect(this.attackBox.posizione.x,this.attackBox.posizione.y, this.attackBox.width, this.attackBox.height)

        this.posizione.x += this.velocita.x
        this.posizione.y += this.velocita.y

        //questo if serve a non far fuori uscire lo sprite dallo schermo e applicare la grività dopo il salto
        if(this.posizione.y+this.height+this.velocita.y>=canvas.height - 33){
            this.velocita.y=0
            this.posizione.y=393
        }
        else this.velocita.y +=gravita
    }

    cambiaFrame(sprite){//cambia la posa in base all'input da tastiera

       
        
        //override delle animazioni con l'attacco
        if(this.image === this.sprites.attack.image && this.frameOra < this.sprites.attack.frameMax -1 && this.vita!==0)//per non farlo tornare in idle e non farlo attaccare all'infinito
            return
        //override delle animazioni con colpito
        if(this.image === this.sprites.takeHit.image && this.frameOra < this.sprites.takeHit.frameMax -1 && this.vita!==0)
            return
        //override delle animazioni con la morte e si impedisce al player di muoversi dopo la morte con la variabile death
        if(this.image === this.sprites.death.image){
            if(this.frameOra === this.sprites.death.frameMax -1){
                this.death = true
            }
            return
        }

        //switch dell'input da tastiera
        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){//controlla che l'immagine sia diversa
                    this.image = this.sprites.idle.image//cambia immagine
                    this.frameMax = this.sprites.idle.frameMax//cambia il numero di frame
                    this.frameOra =0//per portare al primo frame ogni cambio di immagine
                }
                    
                break
            case 'run':
                if(this.image !==this.sprites.run.image){//controlla che l'immagine sia diversa
                    this.image = this.sprites.run.image//cambia immagine
                    this.frameMax = this.sprites.run.frameMax//cambia il numero di frame
                    this.frameOra =0//per portare al primo frame ogni cambio di immagine
                }
                    
                break
            case 'jump':
                if(this.image !== this.sprites.jump.image){//controlla che l'immagine sia diversa
                    this.image = this.sprites.jump.image//cambia immagine
                    this.frameMax = this.sprites.jump.frameMax//cambia il numero di frame
                    this.frameOra =0//per portare al primo frame ogni cambio di immagine
                }
                
                break
            case 'fall':
                if(this.image !== this.sprites.fall.image){//controlla che l'immagine sia diversa
                    this.image = this.sprites.fall.image//cambia immagine
                    this.frameMax = this.sprites.fall.frameMax//cambia il numero di frame
                    this.frameOra =0//per portare al primo frame ogni cambio di immagine
                }
                break
            case 'attack':
                if(this.image !== this.sprites.attack.image){//controlla che l'immagine sia diversa
                    this.image = this.sprites.attack.image//cambia immagine
                    this.frameMax = this.sprites.attack.frameMax//cambia il numero di frame
                    this.frameOra =0//per portare al primo frame ogni cambio di immagine
                }
                break
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){//controlla che l'immagine sia diversa
                    this.image = this.sprites.takeHit.image//cambia immagine
                    this.frameMax = this.sprites.takeHit.frameMax//cambia il numero di frame
                    this.frameOra =0//per portare al primo frame ogni cambio di immagine
                }
                break
            case 'death':
                if(this.image !== this.sprites.death.image){//controlla che l'immagine sia diversa
                    this.image = this.sprites.death.image//cambia immagine
                    this.frameMax = this.sprites.death.frameMax//cambia il numero di frame
                    this.frameOra =0//per portare al primo frame ogni cambio di immagine
                }
                break
            
        }
    }
    //funzione di attacco
    attacco(){
        this.cambiaFrame('attack')
        this.isAttacking = true
    }

    //funzione che attiva l'animazione di colpito
    takeHit(){
        this.vita-=20
        if(this.vita<= 0){
            this.cambiaFrame('death')
        }else{
            this.cambiaFrame('takeHit')
        }
    }
}

//sfondo
const sfondo = new Sprite({
    posizione:{
        x:0,
        y:0
    },
    imagesrc:'./img/Hills Free.png'
})



//lo sprite del giocatore
const player= new combattente({
    posizione:{
    x:10,
    y:393
    },
    velocita:{
    x:0,
    y:0
    },
    color:'blue',
    offset: {
        x: 0 ,
        y: 0
    },
    imagesrc:'./img/WizardPack/Idle.png',
    frameMax : 6,
    scale : 1.5,
    offset : {
        x:120,
        y:59
    },
    sprites:{
        idle:{
            imagesrc:'./img/WizardPack/Idle.png',
            frameMax:6
        },
        run:{
            imagesrc:'./img/WizardPack/Run.png',
            frameMax:8
        },
        jump:{
            imagesrc:'./img/WizardPack/Jump.png',
            frameMax:2
        },
        fall:{
            imagesrc:'./img/WizardPack/Fall.png',
            frameMax:2
        },
        attack:{
            imagesrc:'./img/WizardPack/Attack2.png',
            frameMax:8
        },
        takeHit:{
            imagesrc:'./img/WizardPack/Hit.png',
            frameMax:4
        },
        death:{
            imagesrc:'./img/WizardPack/Death.png',
            frameMax:7
        }
    },
    attackBox:{//grandezza hitbox e distanza dal personaggio
        offset:{
            x:80,
            y:25
        },
        width:125,
        height:60
    }
})
//lo sprite del nemico
const enemy= new combattente({
    posizione:{
    x:950,
    y:393
    },
    velocita:{
    x:0,
    y:0
    },
    color:'red',
    offset: {
        x: -50 ,
        y: 0
    },
    imagesrc:'./img/enemy/Idle.png',
    frameMax : 10,
    scale : 3,
    offset : {
        x:235,
        y:150
    },
    sprites:{
        idle:{
            imagesrc:'./img/enemy/Idle.png',
            frameMax:10
        },
        run:{
            imagesrc:'./img/enemy/runr.png',
            frameMax:8
        },
        jump:{
            imagesrc:'./img/enemy/Jump.png',
            frameMax:3
        },
        fall:{
            imagesrc:'./img/enemy/Fall.png',
            frameMax:3
        },
        attack:{
            imagesrc:'./img/enemy/Attack.png',
            frameMax:7
        },
        takeHit:{
            imagesrc:'./img/enemy/Hit.png',
            frameMax:3
        },
        death:{
            imagesrc:'./img/enemy/deathr.png',
            frameMax:7
        }
    },
    attackBox:{//grandezza hitbox e distanza dal personaggio
        offset:{
            x:-140,
            y:50
        },
        width:120,
        height:50
    }
})

//disegno i personaggi nel canvas
player.draw()
enemy.draw()

const keys = {//tengo traccia dei tasti premuti
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    ArrowR:{
        pressed:false
    },
    ArrowL:{
        pressed:false
    }
}
//funzioni che controllano le collisioni tra le hitbox di attacco e la hitbox dei personaggi
function collisioni({hitbox1,hitbox2}){
    return(
       hitbox1.attackBox.posizione.x + hitbox1.attackBox.width >= hitbox2.posizione.x &&
       hitbox1.attackBox.posizione.x <= hitbox2.posizione.x + hitbox2.width &&
       hitbox1.attackBox.posizione.y + hitbox1.attackBox.height >= hitbox2.posizione.y &&
       hitbox1.attackBox.posizione.y <= hitbox2.posizione.y + hitbox2.height 
    )
}


function determinaVincitore({player, enemy, tempoId}){//se la vita va a 0 finisci prima del timer
    clearTimeout(tempoId)
    document.querySelector('#testo').style.display = 'flex'
    if(player.vita === enemy.vita){
        document.querySelector('#testo').innerHTML = 'Pareggio'
        vincitore = 'pareggio'  
    }else if(player.vita>enemy.vita){
        document.querySelector('#testo').innerHTML = 'player vince'
        vincitore = 'player'
    }else if(enemy.vita>player.vita){
        document.querySelector('#testo').innerHTML = 'enemy vince'
        vincitore = 'enemy'
    }
    player.isAttacking = false
    enemy.isAttacking = false
}

//diminuire il tempo nel timer
let tempo = 60
let tempoId
let fineTempo = false
function diminuisciTempo(){
    tempoId = setTimeout(diminuisciTempo, 1000)//loop infinito
    if(tempo>0){
        tempo --
        document.querySelector('#tempo').innerHTML = tempo
    }
    if(tempo === 0){
        fineTempo= true
        determinaVincitore({player,enemy,tempoId})
        
    }    
    
}

diminuisciTempo()

//funzione per animare il frame, è ricorsiva
function anima() {
    window.requestAnimationFrame(anima)//loop infinito
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)//serve a pulire il canvas per non far rimane l'immagine residua
    sfondo.aggiorna()
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.aggiorna()//non serve fare draw perchè è giù contenuto in aggiorna
    enemy.aggiorna()


    //creo una funzione dentro anima per avere il movimento continuo, senza farlo se rilasciassi un pulasnte annullerebbe ogni input
    player.velocita.x = 0 //senza questa inizializzazione lo sprite si muove anche se rilascio i tasti
    if(keys.a.pressed && player.LastKey==='a' && player.posizione.x>0){
        player.velocita.x = -5
        player.cambiaFrame('run')
    }else if (keys.d.pressed && player.LastKey==='d' && player.posizione.x<940){
        player.velocita.x = 5
        player.cambiaFrame('run')
    } else {
        player.cambiaFrame('idle')
    }

    
    //cambiare la posa in salto o caduta
    if(player.velocita.y<0){
        player.cambiaFrame('jump')
    }else if(player.velocita.y>0){
        player.cambiaFrame('fall')
    }

    //movimento enemy
    enemy.velocita.x = 0
    if(keys.ArrowL.pressed && enemy.LastKey==='ArrowLeft'&& enemy.posizione.x>0){
        enemy.velocita.x = -5
        enemy.cambiaFrame('run')
    }else if (keys.ArrowR.pressed && enemy.LastKey==='ArrowRight' && enemy.posizione.x<940){
        enemy.velocita.x = 5
        enemy.cambiaFrame('run')
    }else {
        enemy.cambiaFrame('idle')
    }

    //cambiare la posa in salto o caduta
    if(enemy.velocita.y<0){
        enemy.cambiaFrame('jump')
    }else if(enemy.velocita.y>0){
        enemy.cambiaFrame('fall')
    }

    //controllo collisioni player & enemy viene colpito
    if( collisioni({
        hitbox1: player,
        hitbox2: enemy
    }) && player.isAttacking && player.frameOra === 6){
        enemy.takeHit()
        player.isAttacking = false //altrimenti esegue tropppi attacchi premendo solo una volta
        gsap.to('#vitaEnemy',{//riduzione vita enemy con animazione
            width: enemy.vita + "%"
        })
    }

    //player manca attaco
    if(player.isAttacking && player.frameOra === 6){
        player.isAttacking = false
    }

    //controllo collisioni enemy
    if( collisioni({
        hitbox1: enemy,
        hitbox2: player
    }) && enemy.isAttacking && enemy.frameOra === 3){
        player.takeHit()
        enemy.isAttacking = false //altrimenti esegue tropppi attacchi premendo solo una volta
        gsap.to('#vitaPlayer',{//riduzione vita enemy con animazione
            width: player.vita + "%"
        })
    }

    //enemy manca attacco
    if(enemy.isAttacking && enemy.frameOra === 3){
        enemy.isAttacking = false
    }

    //finisci gioco quando vita=0
    if(enemy.vita<=0 || player.vita<=0){
        determinaVincitore({player,enemy,tempoId})

    }
}

anima()

//listener per i movimenti dei giocatori
window.addEventListener('keydown', (event) => {
    if(!player.death){//player non può muoversi dopo che è morto
    switch(event.key){
        case 'd'://inizia movimento destra per player
            keys.d.pressed = true
            player.LastKey = 'd'
            break

        case 'a'://inizia movimento sinistra per player
            keys.a.pressed = true
            player.LastKey = 'a'
            break

        case 'w'://inizia il salto
            
            if(player.posizione.y+player.height+player.velocita.y>canvas.height - 33.1){//no doppio salto
                player.velocita.y = -20
            }
            break

        case 's':
            if(!fineTempo)
                player.attacco() 
            break

    }

    
}

    if(!enemy.death){//enemy non può muoversi dopo che è morto      
        switch(event.key){
        case 'ArrowRight'://inizia movimento destra per player
            keys.ArrowR.pressed = true
            enemy.LastKey = 'ArrowRight'
            break

        case 'ArrowLeft'://inizia movimento sinistra per player
            keys.ArrowL.pressed = true
            enemy.LastKey = 'ArrowLeft'
            break

        case 'ArrowUp'://inizia il salto
            if(enemy.posizione.y+enemy.height+enemy.velocita.y>canvas.height - 33.1){//no doppio salto
                enemy.velocita.y = -20
            }
            break

        case 'ArrowDown'://inizia movimento sinistra per player
            if(!fineTempo)
                enemy.attacco()
            break
    }
}
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd'://ferma movimento destra per player
            keys.d.pressed = false
            break

        case 'a'://ferma movimento sinistra per player
            keys.a.pressed = false
            break


            case 'ArrowRight'://ferma movimento destra per player
            keys.ArrowR.pressed = false
            break

        case 'ArrowLeft'://ferma movimento sinistra per player
            keys.ArrowL.pressed = false
            break
    }
})


