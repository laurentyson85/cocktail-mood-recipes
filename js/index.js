 
document.addEventListener("DOMContentLoaded", () => { 
     let errorBanner = document.querySelector("#error-banner")
     let moodBtn = document.querySelector(".moodDropDownBtn")
     let spiritBtn = document.querySelector(".spiritDropDownBtn")
     let recipeSection = document.querySelector("cocktail-recipe")
     let favorites = document.querySelectorAll("favorites")
     let mood
     let spirit
     let ids
     let randomDrinkId
     let cocktailId
     let ingredients
     let measurements


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
            .then(data => {                
                ids = data.drinks.map(element => element.idDrink)
                randomDrinkId = Math.floor(Math.random()*ids.length)
                cocktailId = (ids[randomDrinkId])                   
                spiritBtn.hidden = true
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.drinks[0])
                    ingredients = Object.entries(data.drinks[0]).slice(17,31).map(entry => entry[1])
                    console.log(ingredients)
                    measurements = Object.entries(data.drinks[0]).slice(32,46).map(entry => entry[1])
                    console.log(measurements)


                })  
               

            })       
        }  
        
        // function renderCocktail(){

        // }
        


    })
    
    
    
})



  





