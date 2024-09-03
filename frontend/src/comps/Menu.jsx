import book from '../images/book.png';
import { SidebarData } from "../pages/SidebarData";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const response = await fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            // Удалите токен из localStorage
            localStorage.removeItem('token');

            // Перенаправьте пользователя на страницу входа
            navigate('/login');
        } else {
            // Обработайте ошибку здесь
            console.error('Ошибка выхода из системы');
        }
    };

    return (
        <nav className="nav-menu">
                <div className="logo-container">
                    <h1 className="logo">SecretVoice</h1>
                </div>
                <ul className="nav-menu-items">
                    {SidebarData.map((item, index) => (
                        <li key={index} className={item.cName} style={{ marginTop: item.marginTop || 0 }}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                    <li className="nav-text" style={{ marginTop: '50px' }}>
                    <Link to="/login" onClick={handleLogout}>
                            <IoIosLogOut size={30} />
                            <span>Выйти</span>
                        </Link>
                    </li>
                    <li className="nav-image">
                        <img src={book} alt="book" />
                    </li>
                </ul>
            </nav>
    )
}
export default Menu