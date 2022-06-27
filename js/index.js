 
document.addEventListener("DOMContentLoaded", () => { 
     

     const errorBanner = document.querySelector("#error-banner")
     const moodBtn = document.querySelector("#mood-btn")
     const spiritBtn = document.querySelector("spirit-btn")
     const recipeSection = document.querySelector("cocktail-recipe")
     const favorites = document.querySelectorAll("favorites")

    document.addEventListener('click', function (event) {

        if (event.target.matches('.moodDropBtn')) {
            console.log(event)
        }
    
        if (event.target.matches('.spiritDropBtn')) {
            console.log(event)
    
        }   
    })   
})








