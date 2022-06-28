 
document.addEventListener("DOMContentLoaded", () => { 
     let errorBanner = document.querySelector("#error-banner")
     let moodBtn = document.querySelector(".moodDropDownBtn")
     let spiritBtn = document.querySelector(".spiritDropDownBtn")
     let recipeSection = document.querySelector("#cocktail-recipe")
     let favorites = document.querySelector("#favorites")
     let mood
     let spirit
     let ids
     let randomDrinkId
     let cocktailId
     let fullRecipe
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
                    fullRecipe = data.drinks[0]
                    console.log(fullRecipe)

                    ingredients = Object.entries(data.drinks[0]).slice(17,31).map(entry => entry[1]).filter(element => element !== null)                  
                
                    console.log(ingredients)

                    measurements = Object.entries(data.drinks[0]).slice(32,46).map(entry => entry[1]).filter(element => element !== null)                 

                    console.log(measurements)

                    renderCocktail()
                })  
            })       
        }  
        
        function renderCocktail(){
            const div = document.createElement("div")
            div.classList.add("card")
            div.id = fullRecipe.idDrink

            const img = document.createElement("img")
            img.src = fullRecipe.strDrinkThumb
            img.classList.add("thumbnail")

            const h2 = document.createElement("h2")
            h2.textContent = fullRecipe.strDrink

            const p1 = document.createElement('p')            
            p1.textContent = (measurements.forEach(measurement => measurement))

            const p2 = document.createElement('p')            
            p2.textContent = (ingredients.forEach(measurement => measurement))

            const instructions = document.createElement("p")
            instructions.textContent = fullRecipe.strInstructions      
                  
            const selectedMood= document.createElement("p")
            selectedMood.textContent = mood

            div.append(img, h2, p1, p2, instructions, selectedMood)
            recipeSection.append(div)
        }     

        
    })

})

  





