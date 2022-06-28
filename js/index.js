 
document.addEventListener("DOMContentLoaded", () => { 
     

     let errorBanner = document.querySelector("#error-banner")
     let moodBtn = document.querySelector(".moodDropDownBtn")
     let spiritBtn = document.querySelector(".spiritDropDownBtn")
     let recipeSection = document.querySelector("cocktail-recipe")
     let favorites = document.querySelectorAll("favorites")
     let mood
     let spirit


    document.addEventListener('click', function (event) {      
        if (event.target.matches('.moodDropBtn')) {
           mood = event.target.innerText
           moodBtn.hidden = true
           spiritBtn.hidden = false
           console.log(mood)    
        }
    
        if (event.target.matches('.spiritDropBtn')) {            
            spirit = event.target.innerText
            console.log(spirit)
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${spirit}`)
            .then(response => response.json())
            .then(data => {console.log(data)})         
    
        }   
    })   
})








