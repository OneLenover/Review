import React from 'react';
import '../styles/Pagination.css';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <ul className="pagination">
            <li
                className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} // кнопка назад ("<")
            >
                &lt;
            </li>
            {pageNumbers.map(number => (
                <li
                    key={number}
                    className={`page-item ${currentPage === number ? 'active' : ''}`}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </li>
            ))}
            <li
                className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} // кнопка вперед (">")
            >
                &gt;
            </li>
        </ul>
    );
};

export default Pagination;