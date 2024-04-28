


const tasks = [
    "Ser bonito", "Ser gostoso"
]


const success_sound = new Audio("./assets/success-1-6297.mp3")
success_sound.load()



let audioVolumeFactor = 1

function playAudioVolumed(audio) {
    audio.pause()

    audio.currentTime = 0

    audio.volume = audioVolumeFactor
    audio.play()
}



function addTask(title, message) {
    const card_task_template = document.getElementById("task-template")
    const divElementList = document.getElementById("tasks-container")

    const newCardElement = card_task_template.cloneNode(true)
    setTimeout(() => {
        newCardElement.style.transform = "translate(0,0)"

    })
    newCardElement.querySelector("#description").innerText = message
    newCardElement.querySelector("#title").innerText = title
    newCardElement.style.display = "flex"
    divElementList.appendChild(newCardElement)

    newCardElement.querySelector(".checkmark2").onclick = function () {

        if (newCardElement.querySelector(".checkmark").classList.contains("d-none")) {
            playAudioVolumed(success_sound)
        }

        console.log(newCardElement.classList.toggle("task-card-completed"))
        newCardElement.querySelector(".checkmark").classList.toggle("d-none")
        newCardElement.querySelector(".checkmark2").classList.toggle("d-none")


    }

    newCardElement.querySelector(".checkmark").onclick = function () {

        if (newCardElement.querySelector(".checkmark").classList.contains("d-none")) {
            playAudioVolumed(success_sound)
        }

        console.log(newCardElement.classList.toggle("task-card-completed"))
        newCardElement.querySelector(".checkmark").classList.toggle("d-none")
        newCardElement.querySelector(".checkmark2").classList.toggle("d-none")


    }

    newCardElement.querySelector("#delete-icon").onclick = function () {
        setTimeout(()=>{
            newCardElement.style.transform = "translate(-110%, -100%)"
            const y = newCardElement.getBoundingClientRect().top
            const x = newCardElement.getBoundingClientRect().left
            newCardElement.style.position = "relative"

            newCardElement.top = "-100px"



            setTimeout(()=> {
                newCardElement.parentNode.removeChild(newCardElement)

            },500)

        },0)
    
       
    }


}

document.addEventListener("DOMContentLoaded", () => {




    document.getElementById("new-task-button").addEventListener("click", () => {
        addTask("Insira o seu titulo", "Descrição da tarefa.")
    })


})