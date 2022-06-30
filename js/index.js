 
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
     let allIngredients = []


    document.addEventListener('click', function (event) {      
        if (event.target.matches('.moodDropBtn')) {
           mood = event.target.innerText
           moodBtn.hidden = true
           spiritBtn.hidden = false
           console.log(mood)    
        }
    
        if (event.target.matches('.spiritDropBtn')) {            
            spirit = event.target.innerText            
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

                    ingredients = Object.entries(data.drinks[0]).slice(17,31).map(entry => entry[1]).filter(element => element !== null)                  
                
                    measurements = Object.entries(data.drinks[0]).slice(32,46).map(entry => entry[1]).filter(element => element !== null) 
                    
                    //think about refactoring with a map                                                    
                    for (let i=0; i< measurements.length; i++){
                        let ingredientRow = `${measurements[i]} ${ingredients[i]}`                     
                        allIngredients.push(ingredientRow)                        
                    }

                    renderCocktail()
                })  
            })       
        }  
        
        function renderCocktail(){
            const mainDiv = document.createElement("div")
            mainDiv.classList.add("card")
            mainDiv.id = fullRecipe.idDrink

            const secondDiv = document.createElement("div")
            secondDiv.classList.add("container")
            secondDiv.id = "drinkContainer"
            secondDiv.addEventListener("mouseover",(handleOver))
            secondDiv.addEventListener("mouseleave", (handleLeave))

            const pSpan = document.createElement("p")

            const span = document.createElement("span")
            span.classList.add("hoverMe")
            span.textContent = "Hover for recipe!"         
            
            const img = document.createElement("img")
            img.src = fullRecipe.strDrinkThumb
            img.id = "drinkImg"
            img.classList.add("thumbnail")

            const h2 = document.createElement("h2")
            h2.textContent = `Drink Name: ${fullRecipe.strDrink}`

            const selectedMood= document.createElement("p")
            selectedMood.textContent = `Current Mood: ${mood}` 

            pSpan.append(span)                
            secondDiv.append(pSpan, img, h2, selectedMood)
            mainDiv.append(secondDiv)
            recipeSection.append(mainDiv)
        }     

        
    })

})

  





// const thirdDiv = document.createElement("div")
// thirdDiv.classList.add("cardInfo")

// const p = document.createElement('p')            
// p.textContent = `Ingredients: ${allIngredients.join(", ")}`   

// const br = document.createElement("br")              
         
// const instructions = document.createElement("p")
// instructions.textContent = `Instructions: ${fullRecipe.strInstructions}`   

// thirdDiv.append(p, br, instructions)
// mainDiv.append(thirdDiv)