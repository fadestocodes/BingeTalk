import debounce from "lodash.debounce"


export const autocompleteLocationSearch =  async (query) => {
    if (!query) return []
    try {

        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=e12eb7a62a8f41c2ad8b859b995cd614`)
        if (!res.ok) throw new Error ("Couldn't search locations")
        const searchResults = await res.json()
        return searchResults.features || []

    } catch (err){
        console.error(err)
        return []
    }
}