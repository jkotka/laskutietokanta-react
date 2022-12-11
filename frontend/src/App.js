import './App.css';
import axios from './axios.js';
import React, {useState, useEffect, useCallback} from 'react';
import {Route, Routes, NavLink, Navigate} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Unpaid from './components/Unpaid';
import Paid from './components/Paid';
export const UpdateFormContext = React.createContext({});

function App() {

    // State
    const [toggle, setToggle] = useState(false);
    const [state, setState] = useState({
        loading: false,
        message: ''
	});

    // UseEffect
    useEffect(() => {
        setTimeout(() => {
            setMessage();
        }, 5000);
    }, [toggle]);

    // SetLoading
    const setLoading = (loading) => {
        document.body.style.overflowY = loading ? 'hidden' : '';
        setState((state) => {
            return {
                ...state,
                loading: loading,
            }
        });
    }

    // SetMessage
    const setMessage = (message) => {
        setState((state) => {
            return {
                ...state,
                message: message
            }
        });
    }

    // Unpaid
    const [unpaidTotal, setUnpaidTotal] = useState([]);
    const [unpaid, setUnpaid] = useState([]);
    const dbUnpaid = useCallback((offset, limit) => {
        const p1 = axios.get('/read', {
            params: {
                paid: 0
            }
        });
        const p2 = axios.get('/read', {
            params: {
                paid: 0,
                offset: offset,
                limit: limit
            }
        });
        setLoading(true);
        Promise.all([p1, p2])
        .then(([{data: total}, {data: unpaid}]) => {
            setUnpaidTotal(total);
            setUnpaid(unpaid);
        }).catch(error => {
            setMessage('Laskujen haku epäonnistui: ' + error.code);
        }).finally(() => {
            setLoading(false);
        })}, []);

    // Paid
    const [paidTotal, setPaidTotal] = useState([]);
    const [paid, setPaid] = useState([]);
    const dbPaid = useCallback((state) => {
        const p1 = axios.get('/read', {
            params: {
                paid: 1,
                from: state.from,
                to: state.to,
                name: state.name,
            }
        });
        const p2 = axios.get('/read', {
            params: {
                paid: 1,
                from: state.from,
                to: state.to,
                name: state.name,
                offset: state.offset,
                limit: state.limit
            }
        });
        setLoading(true);
        Promise.all([p1, p2])
        .then(([{data: total}, {data: paid}]) => {
            setPaidTotal(total);
            setPaid(paid);
        }).catch(error => {
            setMessage('Laskujen haku epäonnistui: ' + error.code);
        }).finally(() => {
            setLoading(false);
        })}, []);

    // Create
    const dbCreate = (date, sum, name) => {
        setLoading(true);
        axios.post('/create', {
            date: date,
            sum: sum,
            name: name
        }).then(() => {
            setMessage('Laskun luonti onnistui');
            setToggle(prevState => !prevState);
        }).catch(error => {
            setMessage('Laskun luonti epäonnistui: ' + error.code);
        }).finally(() => {
            setLoading(false);
        });
    }

    // Update
    const dbUpdate = (state, id) => {
        setLoading(true);
        axios.put('/update', {
            date: state.date,
            sum: state.sum,
            name: state.name,
            in_account: state.in_account,
            in_payment: state.in_payment,
            paid: state.paid,
            id: id
        }).then(() => {
            setMessage('Laskun päivitys onnistui');
            setToggle(prevState => !prevState);
        }).catch(error => {
            setMessage('Laskun päivitys epäonnistui: ' + error.code);
        }).finally(() => {
            setLoading(false);
        });
    }

    // Delete
    const dbDelete = (id, name) => {
        name = name.length > 20 ? name.substring(0, 20) + '...' : name;
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className='confirm-dialog'>
                        <h3>Poista lasku</h3>
                        <div>Haluatko varmasti poistaa laskun "{name}"?</div>
                        <hr />
                        <button className='btn-red' onClick={() => {
                            setLoading(true);
                            axios.delete(`/delete/${id}`)
                            .then(() => {
                                setMessage('Laskun poisto onnistui');
                                setToggle(prevState => !prevState);
                            }).catch(error => {
                                setMessage('Laskun poisto epäonnistui: ' + error.code);
                            }).finally(() => {
                                setLoading(false);
                            });
                            onClose();
                        }}>Poista</button>
                        <button onClick={onClose}>Peruuta</button>
                    </div>
                );
            },
            overlayClassName: 'confirm-overlay',
        });
    }

    // Loading & message
    let loading = state.loading ? <div className='overlay'><span className='spin'></span></div> : '';
    let message = state.message ? <div className='message'>{state.message}</div> : '';

    // Return
    return (
        <div className='App'>
            <nav>
                <NavLink to='/'>Laskut</NavLink>|
                <NavLink to='/maksetut'>Maksetut</NavLink>
            </nav>
            {message}
            {loading}
            <Routes>
                <Route exact path='/' element={
                    <UpdateFormContext.Provider value={{dbUpdate, dbDelete}}>
                        <Unpaid unpaid={unpaid} unpaidTotal={unpaidTotal} dbUnpaid={dbUnpaid} dbCreate={dbCreate} toggle={toggle} />
                    </UpdateFormContext.Provider>
                } />
                <Route path='/maksetut' element={
                    <UpdateFormContext.Provider value={{dbUpdate, dbDelete}}>
                        <Paid paid={paid} paidTotal={paidTotal} dbPaid={dbPaid} toggle={toggle} />
                    </UpdateFormContext.Provider>
                } />
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </div>
    );
}

export default App;