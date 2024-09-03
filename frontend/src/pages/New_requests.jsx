import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { CiViewList } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import '../styles/Personal_account.css';
import '../styles/DataTable.css';
import Menu from '../comps/Menu';
import axios from 'axios';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';

function PersonalAccount() {
    const [searchValue, setSearchValue] = useState("");
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const [iconActive, setIconActive] = useState(false);

    useEffect(() => {
        axios.all([
            axios.get('http://localhost:8000/Feedback/status/NEW/'),
        ])
            .then(axios.spread((feedbackRes, responseRes) => {
                const feedbackData = feedbackRes.data;
                const data = feedbackData.map(feedback => {
                    return {
                        id: feedback.id,
                        date: feedback.Feedback_date,
                        name: feedback.Feedback_name,
                        action: 'Просмотр'
                    };
                });

                setRecords(data);  // Устанавливаем records здесь
            }))
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    const placeholder = searchValue.length === 0 ? "Найти обращение..." : "";

    const columns = [
        {
            name: <span className="custom-table-header">Дата обращения</span>,
            selector: 'date',
            cell: row => <span className="custom-date-cell">{row.date}</span>
        },
        {
            name: <span className="custom-table-header">Отправитель</span>,
            selector: 'name',
            cell: row => <span className="custom-name-cell">{row.name}</span>
        },
        {
            name: <span className="custom-table-header">Действие</span>,
            cell: row => (
                <Link to={`/ReadRequest/${row.id}`}>
                    <Button variant="primary" className="custom-action-button">Просмотр</Button>
                </Link>
            )
        }
    ];

    function handleFilter(event) {
        const value = event.target.value.toLowerCase();
        const newData = records.filter(row =>
            row.date.toLowerCase().includes(value) ||
            row.name.toLowerCase().includes(value)
        );
        setRecords(newData);
        setCurrentPage(1); // Сброс текущей страницы на первую после фильтрации
    }

    const handleIconClick = () => {
        console.log('Иконка была нажата');
        setIconActive(!iconActive);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const indexOfLastRecord = currentPage * recordsPerPage; // индекс последней записи
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage; // индекс первой записи
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(records.length / recordsPerPage); // общее количество страниц

    return (
        <div className="personal-account-container">
            <Menu />
            <div className="content-p">
                <div className='container mt-5'>
                    <div className="header">
                        <div className="left"></div>
                        <div className="right">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="custom-search-input"
                                placeholder={placeholder}
                            />

                            <button className="custom-search-button" onClick={handleFilter}>
                                Поиск
                            </button>

                        </div>
                    </div>
                    <div className="data-section">
                        <div className="custom-table-name">
                            Новые обращения
                            <button className="custom-icon-button" onClick={handleIconClick}>
                                <CiViewList size={30} className="icon" />
                            </button>
                            <Link to={'/SearchSameNew'} className="custom-search-icon-link">
                                <button className="custom-search-icon"> <IoIosSearch size={30} className="icon" /> </button>
                            </Link>
                        </div>
                        <DataTable
                            columns={columns}
                            data={currentRecords}
                            fixedHeader
                            className="custom-data-table"
                            noPagination
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalAccount;
