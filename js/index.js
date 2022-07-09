 
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
            const randomDrinkKey = Math.floor(Math.random()*ids.length)                   
            const cocktailId = (ids[randomDrinkKey])                          
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
        btn.addEventListener("mouseover",(handleMouseOver))
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
        const br4 = document.createElement("br")                 
                
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
        favoritesDiv.append(mainDiv, br4, deleteBtn)   

        recipeSection.childNodes.length > 0? favorites.append(favoritesDiv): recipeSection.append(button, br3, mainDiv, br4,likeBtn)

        favorites.hidden = false
    } 
        
    
    const generateNewDivId = (function(count) {
        return function() {
          count += 1;
          return count;
        }
      }(0))


    const getNewDrink = () => {
        button.classList.add("newDrink")
        button.id = "newDrink"
        button.textContent = "Select a new drink" 
        button.addEventListener("click",(handleGetNewDrink))     
    }

    const handleGetNewDrink = () => {        
        moodBtn.hidden = false
        spiritBtn.hidden = true        
        favorites.childNodes.length > 3 ? favorites.hidden = false: favorites.hidden = true        
        removeExisitingRecipe(recipeSection)                   
    }

    const removeExisitingRecipe = (recipe)=> {        
        while (recipe.firstChild) {
            recipe.removeChild(recipe.firstChild);
            }
    } 

    const handleMouseOver = (event) => {                      
        const getDivId = event.target.parentElement.parentElement.lastElementChild.id        
        document.getElementById(`${getDivId }`).classList.remove('hide')        
    }   

    const handleMouseLeave = (event) => {                     
        const getDivId = event.target.parentElement.parentElement.lastElementChild.id        
        document.getElementById(`${getDivId}`).classList.add('hide')        
    } 
    
    const handleLikeCocktail = (event) => {
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

    const handleDeleteCocktail = (event) => {
        event.preventDefault()  
        const deleteElement = event.target.parentElement.id        

        fetch(`http://localhost:3000/drinks/${deleteElement}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }             
        })
        .then(() => {
            document.getElementById(`${deleteElement}`).remove()
            favorites.childNodes.length > 3 ? favorites.hidden = false : favorites.hidden = true
        })      
    } 
})


