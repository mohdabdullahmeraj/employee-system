import React from 'react'

const SearchBar = ({searchQuery, setSearchQuery, onClear}) => {
  return (
    <div className='search-bar'>
        <input type="text" placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        <button onClick={onClear}>❌</button>
    </div>
  )
}

export default SearchBar