 
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
     let button = document.createElement("button")

    
        

    document.addEventListener('click', (handleDropdowns))

    function handleDropdowns(event) {                
    if (event.target.matches('.moodDropBtn')) {            
        mood = event.target.textContent     
        moodBtn.hidden = true
        spiritBtn.hidden = false              
        }

    if (event.target.matches('.spiritDropBtn')) {            
        spirit = event.target.textContent          
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
                buildIngredients() 
                getNewDrink()                     
                renderCocktail()
                }) 
            })  
        }
    }

    function buildIngredients(){             
        ingredients = Object.entries(fullRecipe).slice(17,31).map(entry => entry[1]).filter(element => element !== null)                  
        measurements = Object.entries(fullRecipe).slice(32,46).map(entry => entry[1]).filter(element => element !== null)             
                                                      
        for (let i=0; i< measurements.length; i++){
            let ingredientRow = `${measurements[i]} ${ingredients[i]}`                     
            allIngredients.push(ingredientRow)          
            }
        }   
                    
            
    function renderCocktail(){
        const mainDiv = document.createElement("div")
        mainDiv.classList.add("card")        

        const secondDiv = document.createElement("div")
        secondDiv.classList.add("container")        

        const btn = document.createElement("button")
        btn.classList.add("expand")          
        btn.textContent = "Expand for details"   
        
        btn.addEventListener("mouseenter",(handleOver))
        btn.addEventListener("mouseleave", (handleLeave))        
        
        const img = document.createElement("img")
        img.src = fullRecipe.strDrinkThumb        
        img.classList.add("thumbnail")

        const h2 = document.createElement("h2")
        h2.textContent = `you should have a "${fullRecipe.strDrink}"`

        const selectedMood= document.createElement("p")
        selectedMood.textContent = `Since you feel ${mood.toLowerCase()},` 

        const thirdDiv = document.createElement("div")        
        thirdDiv.classList.add("cardInfo", "hide") 
        thirdDiv.id = incrementBtnId()            

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
        secondDiv.append(img, selectedMood, h2, br2, btn)
        mainDiv.append(secondDiv, thirdDiv)       

        recipeSection.childNodes.length > 0? favorites.append(mainDiv) : recipeSection.append(button, br3, mainDiv, likeBtn)

        favorites.hidden = false
    } 
        
    

    //think about how to write these as arrow functions. add prevent default on everything.


    
    let incrementBtnId = (function(count) {
        return function() {
          count += 1;
          return count;
        }
      }(0))


    function getNewDrink(){
        button.classList.add("newDrink")
        button.id = "newDrink"
        button.textContent = "Select a new drink" 
        button.addEventListener("click",(handleClick))     
    }

    function handleOver(event){
        console.log(event)
        console.log(event.path[2].childNodes[1].id)
        let overId = event.path[2].childNodes[1].id
        document.getElementById(`${overId}`).classList.remove('hide')        
    }   

    function handleLeave(event){
        console.log(event)
        console.log(event.path[2].childNodes[1].id)
        let leaveId = event.path[2].childNodes[1].id
        document.getElementById(`${leaveId}`).classList.add('hide')        
    }

    function handleClick(){
        moodBtn.hidden = false
        spiritBtn.hidden = true

        removeRecipeChildren(recipeSection)

        if (favorites.childNodes.length > 1){
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
        console.log(event)
        console.log(fullRecipe)     


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
            buildIngredients(data)
            renderCocktail(data)            
        })        
    }
})


