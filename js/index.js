 
document.addEventListener("DOMContentLoaded", () => {      
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

    
        

    document.addEventListener('click', (handleDropdowns))

    function handleDropdowns(event) {                
    if (event.target.matches('.moodDropBtn')) {            
        mood = event.target.textContent
        //change these to hiddens to be hide class name for consistancy sake. or maybe not since this is on ID
        moodBtn.hidden = true
        spiritBtn.hidden = false              
    }

    if (event.target.matches('.spiritDropBtn')) {            
        spirit = event.target.innerText            
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${spirit}`)
        .then(response => response.json())
        .then(data => {                
            ids = data.drinks.map(element => element.idDrink)
            randomDrinkId = Math.floor(Math.random()*ids.length)
            cocktailId = (ids[randomDrinkId])  
            //change to class hide instead. or maybe not since this is on ID            
            spiritBtn.hidden = true
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`)
            .then(response => response.json())
            .then(data => {
                buildIngredients(data)                             
                renderCocktail()
                
            }) 
        })
    }

function buildIngredients(data){
    fullRecipe = data.drinks[0]                    

    ingredients = Object.entries(data.drinks[0]).slice(17,31).map(entry => entry[1]).filter(element => element !== null)                  

    measurements = Object.entries(data.drinks[0]).slice(32,46).map(entry => entry[1]).filter(element => element !== null) 

    let ingredientRow  = measurements.map((row) => row.ingredients)
    allIngredients.push(ingredientRow)
            
    //think about refactoring with a map                                                    
    // for (let i=0; i< measurements.length; i++){
    //     let ingredientRow = `${measurements[i]} ${ingredients[i]}`                     
    //     allIngredients.push(ingredientRow)
        
        
    // }
}
                
        
    function renderCocktail(){
        const mainDiv = document.createElement("div")
        mainDiv.classList.add("card")
        mainDiv.id = fullRecipe.idDrink

        const secondDiv = document.createElement("div")
        secondDiv.classList.add("container")
        secondDiv.id = "drinkContainer"


        const btn = document.createElement("button")
        btn.classList.add("expand")
        btn.id = "expand"
        btn.textContent = "Expand for details"   
        
        btn.addEventListener("mouseenter",(handleOver))
        btn.addEventListener("mouseleave", (handleLeave))
        
        
        const img = document.createElement("img")
        img.src = fullRecipe.strDrinkThumb
        img.id = "drinkImg"
        img.classList.add("thumbnail")

        const h2 = document.createElement("h2")
        h2.textContent = `you should have a "${fullRecipe.strDrink}"`

        const selectedMood= document.createElement("p")
        selectedMood.textContent = `Since you feel ${mood.toLowerCase()},` 

        const thirdDiv = document.createElement("div")
        thirdDiv.id = "cardInfo"
        thirdDiv.classList.add("hide")           

        const p = document.createElement('p')            
        p.textContent = `Ingredients: ${allIngredients.join(", ")}`   

        const br = document.createElement("br")
        
        const br2 = document.createElement("br")

        const br3 = document.createElement("br")             
                
        const instructions = document.createElement("p")
        instructions.textContent = `Instructions: ${fullRecipe.strInstructions}`  
        
        const button = document.createElement("button")
        button.classList.add("newDrink")
        button.id = "newDrink"
        button.textContent = "Select a new drink" 
        button.addEventListener("click",(handleClick))              

        thirdDiv.append(p, br, instructions)                
        secondDiv.append(img, selectedMood, h2, br2, btn)
        mainDiv.append(secondDiv, thirdDiv)
        recipeSection.append(button, br3, mainDiv)
        favorites.hidden = false
    } 
    
  

        //think about how to write these as arrow functions. add prevent default on everything.


        function handleOver(){
            document.getElementById("cardInfo").classList.remove('hide')        
        }   

        function handleLeave(){
            document.getElementById("cardInfo").classList.add('hide')
        
        }


        function handleClick(){
            moodBtn.hidden = false
            spiritBtn.hidden = true

            removeRecipeChildren(recipeSection)

            if (favorites.childNodes.length > 1){
                favorites.hidden = true                
            } else {
                favorites.hidden = false                
            }        
        }

        function removeRecipeChildren(recipe){
            while (recipe.firstChild) {
                recipe.removeChild(recipe.firstChild);
            }
        }


        
    }

})


