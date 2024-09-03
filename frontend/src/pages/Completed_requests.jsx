import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import '../styles/Personal_account.css';
import '../styles/DataTable.css';
import '../styles/Completed_requests.css';
import Menu from "../comps/Menu.jsx";
import Pagination from "../pages/Pagination.jsx";
import axios from 'axios';
import { Link } from 'react-router-dom';

function PersonalAccount() {
    const predefinedCategories = [
        'Без категории',
        'Кадровые вопросы',
        'Техническая поддержка',
        'Организация работы',
        'Административные вопросы',
        'Финансовые вопросы'
    ];

    const [searchValue, setSearchValue] = useState("");
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const [iconActive, setIconActive] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Все категории");

    const placeholder = searchValue.length === 0 ? "Найти обращение..." : "";

    const columns = [
        { name: <span className="custom-table-header">Дата обращения</span>, selector: 'date', cell: row => <span className="custom-date-cell">{row.date}</span> },
        { name: <span className="custom-table-header">Отправитель</span>, selector: 'name', cell: row => <span className="custom-name-cell">{row.name}</span> },
        { name: <span className="custom-table-header">Тема</span>, selector: 'topic', cell: row => <span className="custom-name-cell">{row.topic}</span> },
        { name: <span className="custom-table-header">Категория</span>, selector: 'category', cell: row => <span className="custom-name-cell">{row.category || 'Без категории'}</span> },
        {
            name: <span className="custom-table-header">Действие</span>, cell: row => (
                <Link to={`/CheckCompleted/${row.id}`}>
                    <Button variant="primary" className="custom-action-button">Просмотр</Button>
                </Link>
            ) }
    ];

    useEffect(() => {
        axios.all([
            axios.get('http://localhost:8000/'),
            axios.get('http://localhost:8000/FeedbackResponse/')
        ])
            .then(axios.spread((feedbackRes, responseRes) => {
                const feedbackData = feedbackRes.data.filter(feedback => feedback.status === 'COMPLETED');
                const responseData = responseRes.data;

                const data = feedbackData.map(feedback => {
                    const response = responseData.find(res => res.feedback === feedback.id);
                    const topic = response ? response.Response_theme : 'None';
                    const category = response ? response.Category : 'Без категории';

                    return {
                        id: feedback.id,
                        topic: topic,
                        date: feedback.Feedback_date,
                        name: feedback.Feedback_name,
                        category: category,
                        action: 'Просмотр'
                    };
                });

                setRecords(data);  // Устанавливаем records здесь
            }))
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);


    useEffect(() => {
        let filteredRecords = records;
        if (selectedCategory !== "Все категории") {
            filteredRecords = records.filter(record => record.category === selectedCategory);
        }

        const pages = [];
        for (let i = 0; i < filteredRecords.length; i += recordsPerPage) {
            pages.push({
                category: selectedCategory,
                records: filteredRecords.slice(i, i + recordsPerPage)
            });
        }

        setPages(pages);
        setTotalPages(pages.length);
        setCurrentPage(1); // Переключение на первую страницу после изменения категории
    }, [records, recordsPerPage, selectedCategory]);


    function handleFilter(event) {
        const value = event.target.value.toLowerCase();
        const newData = records.filter(row =>
            row.date.toLowerCase().includes(value) ||
            row.name.toLowerCase().includes(value) ||
            (row.topic && row.topic.toLowerCase().includes(value)) ||
            (row.category && row.category.toLowerCase().includes(value))
        );
        setRecords(newData);
        setCurrentPage(1); // Сброс текущей страницы на первую после фильтрации
    }

    const handleIconClick = () => {
        setIconActive(!iconActive);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === "Все категории") {
            setCurrentPage(1);
        } else {
            const pageIndex = pages.findIndex(page => page.category === category);
            if (pageIndex !== -1) {
                setCurrentPage(pageIndex + 1); // Переключение на соответствующую страницу категории
            }
        }
    };

    const [pages, setPages] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const currentPageData = pages[currentPage - 1] || { category: 'Без категории', records: [] };
    const currentRecords = currentPageData.records;
    const currentCategory = currentPageData.category;

    return (
        <div className="personal-account-container">
            <Menu />
            <div className="content-p">
                <div className='container mt-5'>
                    <div className="header">
                        <div className="left"></div>
                        <div className="right">
                            <input type="text" onChange={handleFilter} className="custom-search-input" placeholder={placeholder} />
                            <button className="custom-search-button" onClick={handleFilter}>
                                Поиск
                            </button>
                        </div>
                    </div>
                    <div className="data-section">
                        <div className="custom-table-name">
                            {currentCategory}
                        </div>
                        <DataTable
                            columns={columns}
                            data={currentRecords}
                            fixedHeader
                            className="custom-data-table"
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                        />
                        <div className="category-links">
                            {predefinedCategories.map(category => (
                                <a
                                    key={category}
                                    href="#"
                                    className={selectedCategory === category ? 'active-category' : ''}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalAccount;