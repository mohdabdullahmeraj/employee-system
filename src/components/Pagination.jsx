import React from 'react'

const Pagination = ({totalPages, currentPage, setCurrentPage, totalL, currentL}) => {
  
  const pages = Array.from({length: totalPages}, (_, i) => i+1)

  return (
    <div className='pagination'>
        <div>Showing <strong>{currentL}</strong> out of <strong>{totalL}</strong> entires</div>
        <div>
            <button 
              onClick={() => {
                if (currentPage !== 1){
                  setCurrentPage(currentPage-1)
                }
              }}
              disabled={currentPage === 1}

            >
              Previous 
            </button>
            {pages.map(pageNumber => (
              <button 
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={currentPage === pageNumber ? 'active':''}
              >
                {pageNumber}
              </button>
            ))

            }
            <button
              onClick={() => {
                if(currentPage !== totalPages){
                  setCurrentPage(currentPage+1)
                }
              }}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
        </div>
    </div>
  )
}

export default Pagination