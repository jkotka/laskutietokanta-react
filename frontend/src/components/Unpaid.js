import {useState, useEffect} from 'react';
import UpdateForm from './UpdateForm';
import {PageRows, Pagination} from './Pagination';

const Unpaid = ({unpaid, unpaidTotal, dbUnpaid, dbCreate, toggle}) => {

    // State
    const [state, setState] = useState({
        date: '',
        sum: '',
        name: '',
        offset: 0,
        limit: 10,
        page: 1
    });

    // UseEffect
    useEffect(() => {
        document.title = 'Laskut';
        dbUnpaid(state.offset, state.limit);
    }, [state.offset, state.limit, toggle, dbUnpaid]);

    // onChange
    const onChange = (event) => {
        setState((state) => {
            return {
                ...state,
                [event.target.name]:event.target.value
            }
        });
    }

    // onSubmit
    const onSubmit = (event) => {
        event.preventDefault();
        dbCreate(state.date, state.sum, state.name);
        setState((state) => {
            return {
                ...state,
                date: '',
                sum: '',
                name: ''
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
    let accountSum = 0;
    unpaidTotal.forEach((bill) => {
        count += bill.count;
        sum += parseFloat(bill.sum);
        if (bill.in_account) {
            accountSum += parseFloat(bill.sum);
        }
    });
    let total = <div className='total'>
                    <span>Laskut: {count} kpl</span>&bull;
                    <span>Yhteensä: {Intl.NumberFormat('fi-FI', {style: 'currency', currency: 'EUR'}).format(sum)}</span>&bull;
                    <span>Tilillä: {Intl.NumberFormat('fi-FI', {style: 'currency', currency: 'EUR'}).format(accountSum)}</span>&bull;
                    <span>Puuttuu: {Intl.NumberFormat('fi-FI', {style: 'currency', currency: 'EUR'}).format(sum-accountSum)}</span>
                </div>;

    // Return
    return (
        <div className='content'>
            {total}
            <h2>Laskut</h2>
            <div className='create'>
                <h3>Uusi lasku</h3>
                <form onSubmit={onSubmit}>
                    <label>
                        Eräpäivä: <input type='date' name='date' value={state.date} onChange={onChange} required />
                    </label>
                    <label>
                        Summa: <input type='number' name='sum' step='0.01' value={state.sum} onChange={onChange} min='0.01' max='999999999' required />
                    </label>
                    <label>
                        Nimi: <input type='text' name='name' placeholder='Laskun nimi' value={state.name} onChange={onChange} minLength='2' maxLength='50' required />
                    </label>
                    <input type='submit' value='Tallenna' />
                </form>
            </div>            
            <PageRows limit={state.limit} pageRows={pageRows} />
            {unpaid.map((bill) => {
                return <UpdateForm key={bill.id} bill={bill} />;
            })}
            <Pagination page={state.page} limit={state.limit} count={count} prevPage={prevPage} nextPage={nextPage} />
        </div>
    );
}

export default Unpaid;