const alarmSound1 = new Audio('./assets/oldphone.mp3');
const buttonClickSound = new Audio("./assets/analog-appliance-button-15-186961.mp3")
const timeToShortBreakSound = new Audio("./assets/hora-do-intervalo.mp3")


const audios_count = {
    "15" : new Audio('./assets/faltam-15.mp3'),
    "10" : new Audio('./assets/faltam-10.mp3'),
    "5" : new Audio('./assets/faltam-5.mp3'),
    "1": new Audio('./assets/faltam-1.mp3'),
    "20":new Audio('./assets/faltam-20.mp3')
}


function initialize_pomodoro_logic() {
    const POMODORO_STATES = {
        IDLE: "idle",
        RUNNING: "running",
        PAUSED: "paused",
        SHORT_BREAK: "short-break",
        SESSION_FINISHED: "session-finished"
    }

    const pomodoro_configuration = {
        pomodoroSeconds: 25*60// tempo em segundos equivalente com 25 minutos
    }




    let currentPomodoroState = POMODORO_STATES.IDLE
    let currentPomodoroTimeInSeconds = 0





    

    const button = document.getElementById("toggle-continue-and-pause")
    const clockMessageElement = document.getElementById("clock-message")


    function onPomodoroClockFinishedSessionCallback() {
        button.classList.remove("btn-secondary")
        button.classList.remove("btn-warning")
        

        button.classList.add("btn-secondary")

        clockMessageElement.innerText = ("Sessao terminada tome um folego.")
        button.innerHTML = "DESCANÇAR"

        currentPomodoroState = POMODORO_STATES.SESSION_FINISHED
        alarmSound1.play()
        pywebview.api.showNotification("Relogio de pomodoro","Sessao terminada tome um folego.", 30)
       




        

    }

    var dontLetDistractYou = new Audio('./assets/mantenha-o-foco2.mp3');

    button.addEventListener("click", function () {
        button.classList.remove("btn-secondary")
        button.classList.remove("btn-warning")
        if (currentPomodoroState == POMODORO_STATES.IDLE) {
            currentPomodoroState = POMODORO_STATES.RUNNING
            clockMessageElement.innerText = "Hora de trabalhar !!"
            button.innerHTML = "PAUSAR"
            button.classList.add("btn-warning")
            dontLetDistractYou.play();

        }else if (currentPomodoroState == POMODORO_STATES.PAUSED) {
            currentPomodoroState = POMODORO_STATES.RUNNING
            clockMessageElement.innerText = "Hora de trabalhar !!"
            button.innerHTML = "PAUSAR"
            button.classList.add("btn-warning")
         


        }else if (currentPomodoroState == POMODORO_STATES.RUNNING) {
            currentPomodoroState = POMODORO_STATES.PAUSED
            clockMessageElement.innerText = "Relogio está em pausa"
            button.classList.add("btn-success")


            button.innerText = "CONTINUAR"
        }

        else if (currentPomodoroState == POMODORO_STATES.SESSION_FINISHED) {
            document.getElementById("shortbreak-tab-button").click()

        }

        buttonClickSound.play()

    })
    const clock = document.getElementById("clock")
    function initializeTimeoutCounter() {
        return setInterval(()=> {
            if (POMODORO_STATES.PAUSED === currentPomodoroState) {
                return;
            }

            if (POMODORO_STATES.IDLE === currentPomodoroState) {
                return;
            }

            if (POMODORO_STATES.SESSION_FINISHED === currentPomodoroState) {
                return;
            }
            currentPomodoroTimeInSeconds += 1;

            const timeRest = pomodoro_configuration.pomodoroSeconds - currentPomodoroTimeInSeconds;

            switch (timeRest) {
              case 60 * 1:
                audios_count["1"].play();
                break;
              case 60 * 5:
                audios_count["5"].play();
                break;
              case 60 * 10:
                audios_count["10"].play();
                break;
              case 60 * 15:
                audios_count["15"].play();
                break;
              case 60 * 20:
                audios_count["20"].play();
                break;
              default:
                // Caso nenhum dos tempos corresponda, não faz nada
            }
            


            if (currentPomodoroTimeInSeconds >= pomodoro_configuration.pomodoroSeconds){
                currentPomodoroState = POMODORO_STATES.SESSION_FINISHED;
                onPomodoroClockFinishedSessionCallback()
            } else {
                currentPomodoroState = POMODORO_STATES.RUNNING;
            }
            const minutes = Math.floor(timeRest / 60);
            const seconds = timeRest % 60;
            const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            clock.innerText = formattedTime;
        }, 1000);
    }

    const timeout = initializeTimeoutCounter()



    function reset_state() {
        button.classList.remove("btn-warning")
        button.classList.remove("btn-secondary")
        button.classList.remove("btn-success")
        button.classList.add("btn-secondary")

        currentPomodoroState = POMODORO_STATES.IDLE
        currentPomodoroTimeInSeconds = 0;
        button.innerHTML = "INICIAR";
        
        const minutes = Math.floor(pomodoro_configuration.pomodoroSeconds / 60);
        const seconds = pomodoro_configuration.pomodoroSeconds % 60;

        const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        clock.innerText = formattedTime
        clockMessageElement.innerHTML = "<div style='font-size:10px'>Lembrete, Não deixe que <b>NADA</b>, atrapalhe esses 25 minutos, mantenha o foco na tarefa.</div>"


    }


    return {
        reset_state: reset_state
    }
    
}




function initialize_pomodoro_short_break_logic() {
    const POMODORO_STATES = {
        IDLE: "idle",
        RUNNING: "running",
        PAUSED: "paused",
        SHORT_BREAK: "short-break",
        SESSION_FINISHED: "session-finished"
    }

    const pomodoro_configuration = {
        pomodoroSeconds: 5*60// tempo em segundos equivalente com 5 minutos
    }




    let currentPomodoroState = POMODORO_STATES.IDLE
    let currentPomodoroTimeInSeconds = 0





    

    const button = document.getElementById("toggle-continue-and-break-pause")
    const clockMessageElement = document.getElementById("clock-break-message")


   



    function onPomodoroClockFinishedSessionCallback() {
        button.classList.remove("btn-warning")
        button.classList.remove("btn-secondary")
        button.classList.remove("btn-success")

        button.classList.add("btn-secondary")

        clockMessageElement.innerText = ("Descaço esgotado")
        button.innerHTML = "POMODORO"

        currentPomodoroState = POMODORO_STATES.SESSION_FINISHED

        pywebview.api.showNotification("Relogio de pomodoro","Descanço esgotado.", 30)
        alarmSound1.play()

    }
    button.addEventListener("click", function () {

        button.classList.remove("btn-secondary")
        button.classList.remove("btn-warning")


        if (currentPomodoroState == POMODORO_STATES.IDLE) {
            currentPomodoroState = POMODORO_STATES.RUNNING
            clockMessageElement.innerText = "Hora de Descançar !!"
            button.innerHTML = "PAUSAR"
            button.classList.add("btn-warning")


            timeToShortBreakSound.play()


        }

        if (currentPomodoroState == POMODORO_STATES.PAUSED) {
            currentPomodoroState = POMODORO_STATES.RUNNING
            clockMessageElement.innerText = "Hora de Descançar !!"
            button.innerHTML = "PAUSAR"
            button.classList.add("btn-warning")


        }else if (currentPomodoroState == POMODORO_STATES.RUNNING) {
            currentPomodoroState = POMODORO_STATES.PAUSED
            clockMessageElement.innerText = "Pausado"
            button.classList.add("btn-success")


            button.innerText = "CONTINUAR"
        }

        else if (currentPomodoroState == POMODORO_STATES.SESSION_FINISHED) {
            
            document.getElementById("pomodoro-tab-button").click()


        }

        buttonClickSound.play()

    })
    const clock = document.getElementById("clock-break")
    function initializeTimeoutCounter() {
        return setInterval(()=> {
            if (POMODORO_STATES.PAUSED === currentPomodoroState) {
                return;
            }

            if (POMODORO_STATES.SESSION_FINISHED === currentPomodoroState) {
                return;
            }

            if (POMODORO_STATES.IDLE === currentPomodoroState) {
                return;
            }
            currentPomodoroTimeInSeconds += 1;


            const  timeRet = pomodoro_configuration.pomodoroSeconds - currentPomodoroTimeInSeconds

            if (currentPomodoroTimeInSeconds >= pomodoro_configuration.pomodoroSeconds){
                currentPomodoroState = POMODORO_STATES.SESSION_FINISHED;
                onPomodoroClockFinishedSessionCallback()
            } else {
                currentPomodoroState = POMODORO_STATES.RUNNING;
            }
            
            const minutes = Math.floor(timeRet / 60);
            const seconds = timeRet % 60;
            const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            clock.innerText = formattedTime;
        }, 1000);
    }

    const timeout = initializeTimeoutCounter()



    function reset_state() {
        button.classList.remove("btn-warning")
        button.classList.remove("btn-secondary")
        button.classList.remove("btn-success")
        button.classList.add("btn-secondary")
        currentPomodoroState = POMODORO_STATES.IDLE
        currentPomodoroTimeInSeconds = 0;
        button.innerHTML = "INICIAR";
        const minutes = Math.floor(pomodoro_configuration.pomodoroSeconds / 60);
        const seconds = pomodoro_configuration.pomodoroSeconds % 60;
        const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        clock.innerText = formattedTime
        clockMessageElement.innerText = "Iniciar descanço"


    }


    return {
        reset_state: reset_state
    }
    
}

document.addEventListener("DOMContentLoaded", () => {


    const pomodoro = initialize_pomodoro_logic()
    const short_break = initialize_pomodoro_short_break_logic()

    pomodoro.reset_state()
    short_break.reset_state()



    document.getElementById("configuration-button").addEventListener("click",function() {
        buttonClickSound.play()
        pywebview.api.showConfigurationWindow()
    })


    document.getElementById("pomodoro-tab-button").addEventListener("click",()=>{
        pomodoro.reset_state()
        short_break.reset_state()
        buttonClickSound.play()

    })

    document.getElementById("shortbreak-tab-button").addEventListener("click",()=>{
        pomodoro.reset_state()
        short_break.reset_state()
        buttonClickSound.play()

    })


})
