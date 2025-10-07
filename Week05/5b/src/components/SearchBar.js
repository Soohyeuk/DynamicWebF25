import {useEffect} from 'react'

const SearchBar = (props) => {
    const {onSubmit} = props 
    const handleFormSubmit = (event) => {
        event.preventDefault()
        onSubmit()
    }

    const handleChange = () => {

    }

    return (
        <div>
        <form obSubmit={handleFormSubmit}>
            <input type="text" onChange={handleChange} value={term}>

            </input>
        </form>
        </div>
    )
}

export default SearchBar
