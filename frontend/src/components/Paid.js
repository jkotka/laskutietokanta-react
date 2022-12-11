import {useState, useEffect} from 'react';
import UpdateForm from './UpdateForm';
import {PageRows, Pagination} from './Pagination';

const Paid = ({dbPaid, paid, paidTotal, toggle}) => {

    // State
    const [state, setState] = useState({
        from: '',
        to: '',
        name: '',
        offset: 0,
        limit: 10,
        page: 1
    });

    // UseEffect
    useEffect(() => {
        document.title = 'Maksetut';
        dbPaid(state);
    }, [state, toggle, dbPaid]);

    // onChange
    const onChange = (event) => {
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setState((state) => {
            return {
                ...state,
                [event.target.name]:value
            }
        });
    }

    // resetForm
    const resetForm = (event) => {
        event.preventDefault();
        setState((state) => {
            return {
                ...state,
                from: '',
                to: '',
                name: '',
                offset: 0,
                page: 1
            }
        });
    }

    // pageRows
    const pageRows = (event) => {
        setState((state) => {
            return {
                ...state,
                offset: 0,
                limit: event.target.value,
                page: 1
            }
        });
    }

    // prevPage
    const prevPage = () => {
        window.scrollTo(0, 0);
        setState((state) => {
            return {
                ...state,
                offset: state.offset - state.limit,
                page: state.page - 1
            }
        });
    }

    // nextPage
    const nextPage = () => {
        window.scrollTo(0, 0);
        setState((state) => {
            return {
                ...state,
                offset: state.offset + state.limit,
                page: state.page + 1
            }
        });
    }

    // Total
    let count = 0;
    let sum = 0;
    paidTotal.forEach((bill) => {
        count += bill.count;
        sum += parseFloat(bill.sum);
    });
    let total = <div className='total'>
                    <span>Maksetut: {count} kpl</span>&bull;
                    <span>Yhteensä: {Intl.NumberFormat('fi-FI', {style: 'currency', currency: 'EUR'}).format(sum)}</span>
                </div>;

    // Return
    return (
        <div className='content'>
            {total}
            <h2>Maksetut</h2>
            <div className='search'>
                <h3>Hae maksetuista</h3>
                <form>
                    <label>
                        Alkupvm: <input type='date' name='from' value={state.from} onChange={onChange} />
                    </label>
                    <label>
                        Loppupvm: <input type='date' name='to' value={state.to} min={state.from} onChange={onChange} />
                    </label>
                    <label>
                        Nimi: <input type='text' name='name' placeholder='Laskun nimi' value={state.name} onChange={onChange} maxLength='50' />
                    </label>
                    <button className='btn-blue' onClick={resetForm}>Tyhjennä</button>
                </form>
            </div>
            <PageRows limit={state.limit} pageRows={pageRows} />
            {paid.map((bill) => {
                return <UpdateForm key={bill.id} bill={bill} />;
            })}
            <Pagination page={state.page} limit={state.limit} count={count} prevPage={prevPage} nextPage={nextPage} />
        </div>
    );
}

export default Paid;