import React from 'react'

const Pagination = ({totalPages, currentPage, setCurrentPage, totalL, currentL}) => {

  const windowWidth = window.innerWidth
  const isSmallScreen = windowWidth < 480
  
  const pageRange = isSmallScreen? 2 : 5
  const getVisiblePages = () => {
    const pages = [];

    const half = Math.floor(pageRange / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, pageRange);
    } else if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - pageRange + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();


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

            {visiblePages[0] > 1 && <span style={{ margin: '0 5px', fontSize: '18px' }}>...</span>}

            {visiblePages.map(pageNumber => (
              <button 
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={currentPage === pageNumber ? 'active':''}
              >
                {pageNumber}
              </button>
            ))

            }

            {visiblePages[visiblePages.length-1] < totalPages && <span style={{ margin: '0 5px', fontSize: '18px' }}>...</span>}
            
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