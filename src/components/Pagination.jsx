import React from 'react'

const Pagination = () => {
  return (
    <div className='pagination'>
        <div>Showing <strong>5</strong> out of <strong>25</strong> entires</div>
        <div>
            <button>Previous</button>
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>Next</button>
        </div>
    </div>
  )
}

export default Pagination