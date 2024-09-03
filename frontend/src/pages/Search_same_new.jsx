import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Menu from "../comps/Menu";
import DataTable from 'react-data-table-component';
import { CiViewList } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { LiaExclamationSolid } from "react-icons/lia";
import '../styles/Personal_account.css';
import '../styles/Table_same.css';

function SearchSameNew() {
    const [searchValue, setSearchValue] = useState("");
    const [records, setRecords] = useState([]);
    const [iconActive, setIconActive] = useState(false);
    const [commonWords, setCommonWords] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [topicsArray, setTopicsArray] = useState([]);
    const [managerID, setManagerID] = useState();
    const navigate = useNavigate();

    const placeholder = searchValue.length === 0 ? "Найти обращение..." : "";

    const columns = [
        {
            name: '',
            selector: '',
            cell: row => (
                <div className="custom-checkbox-container">
                    <input type="checkbox" checked={row.selected || false} onChange={() => handleRowSelected(row)} />
                </div>
            ),
            width: '100px'
        },
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

    const cluster_feedbacks = () => {
        fetch('http://localhost:8000/Feedback/cluster/')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.records.map(feedback => ({
                    id: feedback.id,
                    date: feedback.Feedback_date,
                    name: feedback.Feedback_name,
                    action: 'Просмотр'
                }));
                setRecords(formattedData);
                setCommonWords(data.keywords);
            });
    };

    useEffect(() => {
        cluster_feedbacks();
    }, []);

    const fetchManagerID = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/get_manager_id/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            setManagerID(response.data.managerID);
        } catch (error) {
            console.error('Error fetching manager ID: ', error);
        }
    };

    useEffect(() => {
        fetchManagerID();
    }, []);

    const handleFilter = (event) => {
        const value = event.target.value.toLowerCase();
        const newData = records.filter(row =>
            row.date.toLowerCase().includes(value) ||
            row.name.toLowerCase().includes(value)
        );
        setRecords(newData);
    };

    const handleIconClick = () => {
        setIconActive(!iconActive);
    };

    const handleRowSelected = (row) => {
        const updatedRows = records.map(r =>
            r.id === row.id ? { ...r, selected: !r.selected } : r
        );
        setRecords(updatedRows);

        const selected = updatedRows.filter(r => r.selected);
        setSelectedRows(selected);
    };

    const handleAnswer = () => {
        if (selectedRows.length > 0) {
            const selectedIds = selectedRows.map(row => row.id);

            selectedIds.forEach(id => {
                axios.get(`http://localhost:8000/FeedbackResponse/${id}/`)
                    .then(response => {
                        console.log(`Ответ на обратную связь для ID ${id} уже существует`);
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 404) {
                            // Ответа на обратную связь не существует, создаем новый
                            axios.post('http://localhost:8000/FeedbackResponse/create/', {
                                Response_theme: 'Новая тема',  // Замените на нужные значения
                                Response_txt: 'Новый текст ответа',  // Замените на нужные значения
                                feedback: id,
                                manager: managerID,
                                Edited: true
                            })
                                .then(response => {
                                    console.log(`Создан новый ответ для ID ${id}:`, response.data);
                                    // Обновление статуса обращения
                                    axios.post(`http://localhost:8000/Feedback/IN_PROGRESS/${id}/`)
                                        .then(response => {
                                            console.log(`Статус обновлен для ID ${id}:`, response.data);
                                        })
                                        .catch(error => {
                                            console.error(`Ошибка при обновлении статуса для ID ${id}:`, error);
                                        });
                                })
                                .catch(error => {
                                    console.error(`Ошибка при создании нового ответа для ID ${id}:`, error);
                                });
                        } else {
                            console.error(`Ошибка при проверке существования ответа для ID ${id}:`, error);
                        }
                    });
            });

            navigate('/AnswerMult', { state: { selectedIds } });
        } else {
            console.log('No rows selected');
        }
    };

    const updateTopicsArray = (data) => {
        const groupedData = data.reduce((acc, record) => {
            const key = record.keywords ? record.keywords.join(" ") : '';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(record);
            return acc;
        }, {});

        const newTopicsArray = Object.keys(groupedData).map(topic => ({
            topic,
            records: groupedData[topic]
        }));

        setTopicsArray(newTopicsArray);
    };

    useEffect(() => {
        updateTopicsArray(records);
    }, [records]);

    const totalPages = topicsArray.length;
    const currentTopicData = topicsArray[currentPage - 1];

    return (
        <div className="personal-account-container">
            <Menu />
            <div className='container-search_same'>
                <div className="header">
                    <div className="left"></div>
                    <div className="right">
                        <input type="text" onChange={handleFilter} className="custom-search-input" placeholder={placeholder} />
                        <button className="custom-search-button1">Поиск</button>
                    </div>
                </div>
                <div className="data-section1">
                    <button className={`custom-third-button ${iconActive ? 'active' : ''}`} onClick={handleAnswer}>
                        Ответить
                    </button>
                    <h1 className="custom-table-name">
                        Новые обращения
                        <button
                            className={`custom-icon-button ${iconActive ? 'active' : ''}`}
                            onClick={handleIconClick}
                            title="Показать все обращения"
                        >
                            <CiViewList size={30} className="icon" />
                        </button>
                        <button
                            className={`custom-search-icon ${iconActive ? 'active' : ''}`}
                            onClick={handleIconClick}
                            title="Найти одинаковые обращения"
                        >
                            <IoIosSearch size={30} className="icon" />
                        </button>
                    </h1>
                    <div className="common-words-container">
                        <div className="icon-left">
                            <LiaExclamationSolid size={80} style={{ color: '#F49981' }} />
                        </div>
                        <div className="common-words-content">
                            <h2>Ключевые слова:</h2>
                            <p>{commonWords.join(", ")}</p>
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={currentTopicData?.records || []}
                        fixedHeader
                        className="custom-data-table"
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchSameNew;