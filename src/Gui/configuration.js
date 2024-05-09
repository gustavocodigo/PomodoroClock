const buttonClickSound = new Audio("./assets/analog-appliance-button-15-186961.mp3")



document.addEventListener("DOMContentLoaded", () => {

    var rangeVolume = document.getElementById("range-volume");



    // Adiciona um ouvinte de evento para o evento input
    rangeVolume.addEventListener("input", function () {
        var value = rangeVolume.value;
        document.getElementById("notification-volume-value").textContent = value * 10;
        lastVolume = value



    });


    //dc-check


    async function save_configs() {
        const blackLists = []
        const dc_checked = document.getElementById("dc-check").checked;
        const wpp_checked = document.getElementById("wpp-check").checked;
        const pwa_checked = document.getElementById("pwa-check").checked;



        if (dc_checked)
            blackLists.push("Discord.exe")
        if (wpp_checked)
            blackLists.push("WhatsApp.exe")
        if (pwa_checked)
            blackLists.push("Pwa.exe")


        for (const index in blackLists) {
            const app = blackLists[index]
            await pywebview.api.addBlackListExecutable(app)
        }

        await pywebview.api.clearExecutables()
        await pywebview.api.setVolumeConfiguration(rangeVolume.value / 10)

        await pywebview.api.setBlackListedApps(blackLists)




    }
    document.getElementById("save-button").addEventListener("click", async () => {



        await save_configs()


        buttonClickSound.volume = rangeVolume.value / 10
        await buttonClickSound.play()

        setTimeout(async function(){
            await pywebview.api.showMainWindowToast("Alterações salvas com sucesso !")
            await pywebview.api.closeSoundFactorConfigurationWindow()
        }, 500)


    })



})




window.addEventListener('pywebviewready', async function () {
    const soundFactor = await pywebview.api.getSoundFactorConfiguration()

    document.getElementById("range-volume").value = soundFactor * 10
    document.getElementById("notification-volume-value").textContent = soundFactor * 100;

    document.getElementById("dc-check").checked = false;
    document.getElementById("wpp-check").checked = false;
    document.getElementById("pwa-check").checked = false;


    const app_list = await pywebview.api.getAplicationBlacklist()


    if (app_list.includes("Discord.exe")) {
        document.getElementById("dc-check").checked = true
    }

    if (app_list.includes("WhatsApp.exe")) {
        document.getElementById("wpp-check").checked = true
    }


    if (app_list.includes("Pwa.exe")) {
        document.getElementById("pwa-check").checked = true
    }

    save_configs()


})

