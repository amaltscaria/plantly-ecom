$(document).ready(async  ()=>{
    const response = await fetch('/getProductSearch');
    if (response.status === 200){
      const  values = await response.json();
      const products = values.products;
        const searchSuggestions = [];
      products.forEach(element => {
        searchSuggestions.push(element.name);
      });
    
    // Initialize the Typeahead plugin on the search input field 
    $('#productSearch').typeahead({ 
        source: searchSuggestions 
})

    }
})
