document.addEventListener("DOMContentLoaded",()=> {
   
    var rangeVolume = document.getElementById("range-volume");

    // Adiciona um ouvinte de evento para o evento input
    rangeVolume.addEventListener("input", function() {
        var value = rangeVolume.value;
        document.getElementById("notification-volume-value").textContent = value;


        pywebview.api.setVolumeConfiguration(value/100)
        
    });
})