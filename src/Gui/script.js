const alarmSound1 = new Audio('./assets/oldphone.mp3');
alarmSound1.preload=true
const buttonClickSound = new Audio("./assets/analog-appliance-button-15-186961.mp3")
buttonClickSound.preload = true
const timeToShortBreakSound = new Audio("./assets/hora-do-intervalo.mp3")
timeToShortBreakSound.preload=true
const socialMidiasFoundSound = new Audio("./assets/fechamos-redes.mp3")
socialMidiasFoundSound.preload=true

const audios_count = {
    "15": new Audio('./assets/faltam-15.mp3'),
    "10": new Audio('./assets/faltam-10.mp3'),
    "5": new Audio('./assets/faltam-5.mp3'),
    "1": new Audio('./assets/faltam-1.mp3'),
    "20": new Audio('./assets/faltam-20.mp3')
}

for (index in audios_count) {
    audio = audios_count[index]
    audio.preload = true

}

let audioVolumeFactor = 0.2

function playAudioVolumed(audio) {
    audio.pause()

    audio.currentTime=0

    audio.volume = audioVolumeFactor
    audio.play()
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
        pomodoroSeconds: 25 * 60// tempo em segundos equivalente com 25 minutos
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

        playAudioVolumed(alarmSound1)
        pywebview.api.showNotification("Relogio de pomodoro", "Sessao terminada tome um folego.", 30)







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
            playAudioVolumed(dontLetDistractYou)

        } else if (currentPomodoroState == POMODORO_STATES.PAUSED) {
            currentPomodoroState = POMODORO_STATES.RUNNING
            clockMessageElement.innerText = "Hora de trabalhar !!"
            button.innerHTML = "PAUSAR"
            button.classList.add("btn-warning")


        } else if (currentPomodoroState == POMODORO_STATES.RUNNING) {
            currentPomodoroState = POMODORO_STATES.PAUSED
            clockMessageElement.innerText = "Relogio está em pausa"
            button.classList.add("btn-success")


            button.innerText = "CONTINUAR"
        }

        else if (currentPomodoroState == POMODORO_STATES.SESSION_FINISHED) {
            document.getElementById("shortbreak-tab-button").click()

        }

        playAudioVolumed(buttonClickSound)

    })
    const clock = document.getElementById("clock")
    function initializeTimeoutCounter() {
        return setInterval(() => {
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
                    dontLetDistractYou(audios_count["1"])
                    break;
                case 60 * 5:
                    dontLetDistractYou(audios_count["5"])
                    break;
                case 60 * 10:
                    dontLetDistractYou(audios_count["10"])
                    break;
                case 60 * 15:
                    dontLetDistractYou(audios_count["15"])
                    break;
                case 60 * 20:
                    dontLetDistractYou(audios_count["20"])
                    break;
                default:
                // Caso nenhum dos tempos corresponda, não faz nada
            }
            try{
                pywebview.api.setClockMessage(timeRest,pomodoro_configuration.pomodoroSeconds)

            }catch(e){
                console.log(e)
            }



            if (currentPomodoroTimeInSeconds >= pomodoro_configuration.pomodoroSeconds) {
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
        pomodoroSeconds: 5 * 60// tempo em segundos equivalente com 5 minutos
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

        pywebview.api.showNotification("Relogio de pomodoro", "Descanço esgotado.", 30)
        playAudioVolumed(alarmSound1)

    }
    button.addEventListener("click", function () {

        button.classList.remove("btn-secondary")
        button.classList.remove("btn-warning")


        if (currentPomodoroState == POMODORO_STATES.IDLE) {
            currentPomodoroState = POMODORO_STATES.RUNNING
            clockMessageElement.innerText = "Hora de Descançar !!"
            button.innerHTML = "PAUSAR"
            button.classList.add("btn-warning")

            playAudioVolumed(timeToShortBreakSound)



        }else if (currentPomodoroState == POMODORO_STATES.PAUSED) {
            currentPomodoroState = POMODORO_STATES.RUNNING
            clockMessageElement.innerText = "Hora de Descançar !!"
            button.innerHTML = "PAUSAR"
            button.classList.add("btn-warning")


        } else if (currentPomodoroState == POMODORO_STATES.RUNNING) {
            currentPomodoroState = POMODORO_STATES.PAUSED
            clockMessageElement.innerText = "Pausado"
            button.classList.add("btn-success")


            button.innerText = "CONTINUAR"
        }

        else if (currentPomodoroState == POMODORO_STATES.SESSION_FINISHED) {

            document.getElementById("pomodoro-tab-button").click()


        }
        playAudioVolumed(buttonClickSound)

    })
    const clock = document.getElementById("clock-break")
    function initializeTimeoutCounter() {
        return setInterval(() => {
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


            const timeRet = pomodoro_configuration.pomodoroSeconds - currentPomodoroTimeInSeconds

            if (currentPomodoroTimeInSeconds >= pomodoro_configuration.pomodoroSeconds) {
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



var toastLiveExample = undefined;


function showToast(message) {
    if (toastLiveExample != undefined) {
        document.getElementById("main-toast-message-div").innerText = message
        var toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
    }
}


document.addEventListener("DOMContentLoaded", () => {

    toastLiveExample = document.getElementById('liveToast')
    


    const pomodoro = initialize_pomodoro_logic()
    const short_break = initialize_pomodoro_short_break_logic()

    pomodoro.reset_state()
    short_break.reset_state()



    document.getElementById("configuration-button").addEventListener("click", function () {
        pywebview.api.showConfigurationWindow()
        playAudioVolumed(buttonClickSound)
    })

    document.getElementById("pomodoro-floating-button").addEventListener("click", function () {
        pywebview.api.openSmallClock()
        playAudioVolumed(buttonClickSound)
    })

    document.getElementById("pomodoro-tab-button").addEventListener("click", () => {
        pomodoro.reset_state()
        short_break.reset_state()
        playAudioVolumed(buttonClickSound)

    })

    document.getElementById("shortbreak-tab-button").addEventListener("click", () => {
        pomodoro.reset_state()
        short_break.reset_state()
        playAudioVolumed(buttonClickSound)

    })



 


    async function closeSocialMedias() {
        

        const has = await pywebview.api.closeSocialMedias()
        if (has == true) {
            playAudioVolumed(socialMidiasFoundSound)
        }
        setTimeout(closeSocialMedias, 3000)


    }

    setTimeout(closeSocialMedias, 4000)



    document.getElementById("task-manager-floating-button").addEventListener("click", () => {
        playAudioVolumed(buttonClickSound)

        pywebview.api.openTaskManagerWindow()

    })
})




function setup_configurations(audio_volume_factor) {
    audioVolumeFactor = audio_volume_factor
}



window.addEventListener('pywebviewready', async function() {
    const soundFactor = await pywebview.api.getSoundFactorConfiguration()



   


    
})
