 
document.addEventListener("DOMContentLoaded", () => {      
     const moodBtn = document.querySelector(".moodDropDownBtn")
     const spiritBtn = document.querySelector(".spiritDropDownBtn")
     const recipeSection = document.querySelector("#cocktail-recipe")
     const favorites = document.querySelector("#favorites")
     const button = document.createElement("button")
     let mood   
     let fullRecipe     
     let allIngredients = [] 
     let favoritesId  
    

    document.addEventListener('click', (handleDropdowns))

    function handleDropdowns(event) {
        event.preventDefault()                
    if (event.target.matches('.moodDropBtn')) {            
        mood = event.target.textContent     
        moodBtn.hidden = true
        spiritBtn.hidden = false              
        }
    if (event.target.matches('.spiritDropBtn')) {            
        const spirit = event.target.textContent          
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${spirit}`)
        .then(response => response.json())
        .then(data => {                
            const ids = data.drinks.map(element => element.idDrink)
            const randomDrinkId = Math.floor(Math.random()*ids.length)
            const cocktailId = (ids[randomDrinkId]) //be able to explain this better                    
            spiritBtn.hidden = true
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`)
            .then(response => response.json())
            .then(data => {
                fullRecipe = data.drinks[0]  
                buildIngredients() 
                getNewDrink()                     
                renderCocktail()
                })                 
            })
        }
    }

    function buildIngredients(){             
        const ingredients = Object.entries(fullRecipe).slice(17,31).map(entry => entry[1]).filter(element => element !== null)                  
        const measurements = Object.entries(fullRecipe).slice(32,46).map(entry => entry[1]).filter(element => element !== null)
        
        allIngredients = measurements.map((measurement, i) => `${measurement} ${ingredients[i]}`)                                                 
        }   
                    
            
    function renderCocktail(){
        const favoritesDiv = document.createElement("div")
        favoritesDiv.id = favoritesId
        favoritesDiv.classList.add("favorite")

        const mainDiv = document.createElement("div")
        mainDiv.classList.add("card")        

        const secondDiv = document.createElement("div")
        secondDiv.classList.add("container")        

        const btn = document.createElement("button")
        btn.classList.add("expand")          
        btn.textContent = "Expand for details"        
        btn.addEventListener("mouseenter",(handleMouseEnter))
        btn.addEventListener("mouseleave", (handleMouseLeave))        
        
        const img = document.createElement("img")
        img.src = fullRecipe.strDrinkThumb        
        img.classList.add("thumbnail")

        const drink = document.createElement("p")
        drink.textContent = `you should have a "${fullRecipe.strDrink}"`

        const selectedMood= document.createElement("p")
        selectedMood.textContent = `Since you feel ${mood.toLowerCase()},` 

        const thirdDiv = document.createElement("div")        
        thirdDiv.classList.add("cardInfo", "hide") 
        thirdDiv.id = generateNewDivId()            

        const p = document.createElement('p')            
        p.textContent = `Ingredients: ${allIngredients.join(", ")}`   

        const br = document.createElement("br")     
        const br2 = document.createElement("br")
        const br3 = document.createElement("br")             
                
        const instructions = document.createElement("p")
        instructions.textContent = `Instructions: ${fullRecipe.strInstructions}`  
        
        const likeBtn = document.createElement("button")
        likeBtn.classList.add("like-button")        
        likeBtn.textContent = "Like ❤️"
        likeBtn.addEventListener("click", (handleLikeCocktail))

        const deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete-button")        
        deleteBtn.textContent = "Delete ❌"
        deleteBtn.addEventListener("click", (handleDeleteCocktail))
                         
        thirdDiv.append(p, br, instructions)                
        secondDiv.append(img, selectedMood, drink, br2, btn)
        mainDiv.append(secondDiv, thirdDiv)  
        favoritesDiv.append(mainDiv, deleteBtn)   

        recipeSection.childNodes.length > 0? favorites.append(favoritesDiv): recipeSection.append(button, br3, mainDiv, likeBtn)

        favorites.hidden = false
    } 
        
    
    let generateNewDivId = (function(count) {
        return function() {
          count += 1;
          return count;
        }
      }(0)) //be able to explain this closure better


    let getNewDrink = () => {
        button.classList.add("newDrink")
        button.id = "newDrink"
        button.textContent = "Select a new drink" 
        button.addEventListener("click",(handleGetNewDrink))     
    }

    let handleGetNewDrink = (event) => {
        event.preventDefault()  
        moodBtn.hidden = false
        spiritBtn.hidden = true        
        favorites.childNodes.length > 5 ? favorites.hidden = false: favorites.hidden = true
        removeExisitingRecipe(recipeSection)                   
    }

    let removeExisitingRecipe = (recipe)=> {        
        while (recipe.firstChild) {
            recipe.removeChild(recipe.firstChild);
            }
    } 

    let handleMouseEnter = (event) => {    
        event.preventDefault()            
        let generatedDivId = event.target.parentElement.parentElement.lastElementChild.id        
        document.getElementById(`${generatedDivId}`).classList.remove('hide')        
    }   

    let handleMouseLeave = (event) => {  
        event.preventDefault()              
        let generatedDivId = event.target.parentElement.parentElement.lastElementChild.id        
        document.getElementById(`${generatedDivId}`).classList.add('hide')        
    } 
    
    let handleLikeCocktail = (event) => {
        event.preventDefault()  
        fetch("http://localhost:3000/drinks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                drinkRecipe: fullRecipe
            })  
        })
        .then(response => response.json())
        .then(data => {
            favoritesId = data.id              
            renderCocktail(data)                     
        })           
    }

    let handleDeleteCocktail = (event) => {
        event.preventDefault()  
        let deleteElement = event.target.parentElement.id
        document.getElementById(`${deleteElement}`).remove()

        fetch(`http://localhost:3000/drinks/${deleteElement}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }             
        })
        .then(response => response.json())
        .then(data => console.log(data))        
    }

})


