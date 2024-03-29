import { FormEvent, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, checkLocalStorage } from "../assets/constants";
import ChatLoader from "./loaders/ChatLoader";

interface Login_type {
    setIsLogin: React.Dispatch<SetStateAction<boolean>>,
    setValidationErrors: React.Dispatch<SetStateAction<validationError_type[]>>,
}

interface validationError_type {
    msg: string;
}

const Login = ({ setIsLogin, setValidationErrors }: Login_type) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!checkLocalStorage()) {
            setIsLoading(false);
            return;
        }

        const token = JSON.parse(localStorage.getItem('token') || "");
        const id = JSON.parse(localStorage.getItem('idWeText') || "");
        fetch(`${API}/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => response.json())
            .then(user => {
                if (user) {
                    navigate('/chats')
                    return undefined;
                }
                setIsLoading(false);
            })
    }, []);

    const login = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !pwd) return undefined;
        const response = await fetch(`${API}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pwd, email: email.trim() })
        })
        const data = await response.json();
        if (Array.isArray(data)) {
            setValidationErrors(data);
        } else {
            const { token, id } = data;
            localStorage.setItem('token', JSON.stringify(token));
            localStorage.setItem('idWeText', JSON.stringify(id));
            setEmail('');
            setPwd('');
            setValidationErrors([]);
            navigate('/chats');
        }
    }

    const handleSwap = () => {
        setIsLogin(false);
        setValidationErrors([]);
    }

    const demoUser = async (e: FormEvent) => {
        e.preventDefault();
        const pwd = 'PruebaDemo1';
        const email = 'prueba@email.com';
        const response = await fetch(`${API}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pwd, email })
        })
        const data = await response.json();
        if (Array.isArray(data)) {
            setValidationErrors(data);
        } else {
            const { token, id } = data;
            localStorage.setItem('token', JSON.stringify(token));
            localStorage.setItem('IdWeText', JSON.stringify(id));
            setEmail('');
            setPwd('');
            setValidationErrors([]);
            navigate('/chats');
        }
    }

    return (
        <>
            {isLoading
                ? <ChatLoader />
                :
                <form className="authentication__form" onSubmit={(e) => login(e)}>
                    <div className="email__container form__section-container">
                        <label htmlFor="email" className="authentication__label">Email</label>
                        <div className="form__section-container">
                            <input id="email" type="text" name="email" onChange={(e) => setEmail(e.target.value)} />
                            <div className="topline"></div>
                            <div className="underline"></div>
                        </div>
                    </div>
                    <div className="password__container">
                        <label htmlFor="pwd" className="authentication__label">Contraseña</label>
                        <div className="form__section-container">
                            <input id="pwd" type="password" name="pwd" onChange={(e) => setPwd(e.target.value)} />
                            <div className="topline"></div>
                            <div className="underline"></div>
                        </div>
                    </div>
                    <button className="authentication__submit">
                        <span className="circle1"></span>
                        <span className="cirlce2"></span>
                        <span className="cirlce3"></span>
                        <span className="cirlce4"></span>
                        <span className="cirlce5"></span>
                        <span className="text">Iniciar sesión</span>
                    </button>
                    <button className="authentication__submit demo-user__button" onClick={demoUser}>
                        <span className="circle1"></span>
                        <span className="cirlce2"></span>
                        <span className="cirlce3"></span>
                        <span className="cirlce4"></span>
                        <span className="cirlce5"></span>
                        <span className="text">Entrar como invitado</span>
                    </button>
                    <div className="create__account-btn">
                        <span>¿No tenés cuenta?</span>
                        <button className="authentication__swap" onClick={() => handleSwap()}>Registrate</button>
                    </div>
                </form>}
        </>
    );
}

export default Login;