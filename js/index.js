     
document.addEventListener("DOMContentLoaded", () => {
    const errorBanner = document.querySelector("#error-banner")
    const moodBtn = document.querySelector("#mood-btn")
    const spiritBtn = document.querySelector("spirit-btn")
    const recipeSection = document.querySelector("cocktail-recipe")
    const favorites = document.querySelectorAll("favorites")

    function handleMood(event){
        console.log(event)
    }

    moodBtn.addEventListener("click", handleMood)  

 })


function handleMood(event){
 console.log(event)
}






