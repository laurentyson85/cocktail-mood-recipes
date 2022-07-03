 
document.addEventListener("DOMContentLoaded", () => {      
     let moodBtn = document.querySelector(".moodDropDownBtn")
     let spiritBtn = document.querySelector(".spiritDropDownBtn")
     let recipeSection = document.querySelector("#cocktail-recipe")
     let favorites = document.querySelector("#favorites")
     let button = document.createElement("button")
     let mood   
     let fullRecipe     
     let allIngredients = []   
    

    document.addEventListener('click', (handleDropdowns))

    function handleDropdowns(event) {
        event.preventDefault()                
    if (event.target.matches('.moodDropBtn')) {            
        mood = event.target.textContent     
        moodBtn.hidden = true
        spiritBtn.hidden = false              
        }

    if (event.target.matches('.spiritDropBtn')) {            
        let spirit = event.target.textContent          
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${spirit}`)
        .then(response => response.json())
        .then(data => {                
            let ids = data.drinks.map(element => element.idDrink)
            let randomDrinkId = Math.floor(Math.random()*ids.length)
            let cocktailId = (ids[randomDrinkId]) //be able to explain this better                    
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
        let ingredients = Object.entries(fullRecipe).slice(17,31).map(entry => entry[1]).filter(element => element !== null)                  
        let measurements = Object.entries(fullRecipe).slice(32,46).map(entry => entry[1]).filter(element => element !== null)
        
        allIngredients = measurements.map((measurement, i) => `${measurement} ${ingredients[i]}`)                                                 
        }   
                    
            
    function renderCocktail(){
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
        thirdDiv.id = incrementNewId()            

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
        likeBtn.addEventListener("click", (handleLike))
                         
        thirdDiv.append(p, br, instructions)                
        secondDiv.append(img, selectedMood, drink, br2, btn)
        mainDiv.append(secondDiv, thirdDiv)       

        recipeSection.childNodes.length > 0? favorites.append(mainDiv) : recipeSection.append(button, br3, mainDiv, likeBtn)

        favorites.hidden = false
    } 
        
    
    let incrementNewId = (function(count) {
        return function() {
          count += 1;
          return count;
        }
      }(0)) //be able to explain this closure better


    let getNewDrink = () => {
        button.classList.add("newDrink")
        button.id = "newDrink"
        button.textContent = "Select a new drink" 
        button.addEventListener("click",(handleClick))     
    }

    let handleMouseEnter = (event) => {    
        event.preventDefault()         
        let overId = event.target.parentElement.parentElement.lastElementChild.id
        document.getElementById(`${overId}`).classList.remove('hide')        
    }   

    let handleMouseLeave = (event) => {  
        event.preventDefault()        
        let leaveId = event.target.parentElement.parentElement.lastElementChild.id
        document.getElementById(`${leaveId}`).classList.add('hide')        
    }

    function handleClick(event){
        event.preventDefault()  
        moodBtn.hidden = false
        spiritBtn.hidden = true

        removeRecipeChildren(recipeSection)

        if (favorites.childNodes.length > 5){
            favorites.hidden = false                
        } else {
            favorites.hidden = true                
        }             
    }

    function removeRecipeChildren(recipe){
        while (recipe.firstChild) {
            recipe.removeChild(recipe.firstChild);
            }
    } 
    
    function handleLike(event){
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
            renderCocktail(data)            
        })        
    }
})


