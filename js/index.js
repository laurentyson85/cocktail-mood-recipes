 
document.addEventListener("DOMContentLoaded", () => {      
     const moodBtn = document.querySelector(".moodDropDownBtn")
     const spiritBtn = document.querySelector(".spiritDropDownBtn")
     const recipeSection = document.querySelector("#cocktail-recipe")
     const favorites = document.querySelector("#favorites")
     const newDrinkButton = document.createElement("button")
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
        .then(data => fetchCocktail(data))
        }
    }

    const fetchCocktail = (data) => {                
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
        }

    const buildIngredients = () => {              
        const ingredients = Object.entries(fullRecipe).slice(17,31).map(entry => entry[1]).filter(element => element !== null)                  
        const measurements = Object.entries(fullRecipe).slice(32,46).map(entry => entry[1]).filter(element => element !== null)
        
        allIngredients = measurements.map((measurement, i) => `${measurement} ${ingredients[i]}`)                                                 
        }   
                    
            
    const renderCocktail = () => {
        const favoritesDiv = document.createElement("div")
        favoritesDiv.id = favoritesId
        favoritesDiv.classList.add("favorite")        

        const recipeCardDiv = document.createElement("div")
        recipeCardDiv.classList.add("card")        

        const containerDiv = document.createElement("div")
        containerDiv.classList.add("container")        

        const expandBtn = document.createElement("button")
        expandBtn.classList.add("expand")          
        expandBtn.textContent = "Expand for details"        
        expandBtn.addEventListener("mouseover",(handleMouseOver))
        expandBtn.addEventListener("mouseleave", (handleMouseLeave))        
        
        const img = document.createElement("img")
        img.src = fullRecipe.strDrinkThumb        
        img.classList.add("thumbnail")

        const drink = document.createElement("p")
        drink.textContent = `you should have a "${fullRecipe.strDrink}"`

        const selectedMood= document.createElement("p")
        selectedMood.textContent = `Since you feel ${mood.toLowerCase()},` 

        const cardInfoDiv = document.createElement("div")        
        cardInfoDiv.classList.add("cardInfo", "hide") 
        cardInfoDiv.id = generateNewDivId()            

        const ingredientsList = document.createElement('p')            
        ingredientsList.textContent = `Ingredients: ${allIngredients.join(", ")}`   

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
                         
        cardInfoDiv.append(ingredientsList, br, instructions)                
        containerDiv.append(img, selectedMood, drink, br2, expandBtn)
        recipeCardDiv.append(containerDiv, cardInfoDiv)  
        favoritesDiv.append(recipeCardDiv, br4, deleteBtn)   

        recipeSection.childNodes.length > 0? myFavorites.append(favoritesDiv): recipeSection.append(newDrinkButton, br3, recipeCardDiv, br4,likeBtn)

        favorites.hidden = false
    }  

    const myFavorites = document.createElement("div")
    myFavorites.classList.add("section")
    myFavorites.id = "myFaves"

    favorites.append(myFavorites)
        
    
    const generateNewDivId = (function(count) {
        return function() {
          count += 1;
          return `Drink ${count}`;
        }
      }(0))


    const getNewDrink = () => {
        newDrinkButton.classList.add("newDrink")
        newDrinkButton.id = "newDrink"
        newDrinkButton.textContent = "Select a new drink" 
        newDrinkButton.addEventListener("click",(handleGetNewDrink))     
    }

    const handleGetNewDrink = () => {        
        moodBtn.hidden = false
        spiritBtn.hidden = true        
        myFavorites.childNodes.length > 0 ? favorites.hidden = false: favorites.hidden = true        
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
            myFavorites.childNodes.length > 0 ? favorites.hidden = false : favorites.hidden = true
        })      
    } 
})


