import {useContext, useState} from 'react';
import {differenceInCalendarDays, parseISO} from 'date-fns';
import {UpdateFormContext} from '../App';

const UpdateForm = (props) => {

    // Context
    const context = useContext(UpdateFormContext);

    // State
    const [state, setState] = useState({
        date: props.bill.date,
        sum: props.bill.sum,
        name: props.bill.name,
        in_account: props.bill.in_account,
        in_payment: props.bill.in_payment,
        paid: props.bill.paid
    });

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

    // onSubmit
    const onSubmit = (event, state, id) => {
        event.preventDefault();
        context.dbUpdate(state, id);
    }

    // deleteBill
    const deleteBill = (event, id, name) => {
        event.preventDefault();
        context.dbDelete(id, name);
    }

    // dateReminder
    let dateDiff = differenceInCalendarDays(parseISO(props.bill.date), new Date());
    let dateReminder = dateDiff + ' pv eräpäivään';
    let className = '';
    if (dateDiff < 0) {
        dateReminder = 'Eräpäivä ' + Math.abs(dateDiff) + ' pv sitten';
        className = 'header-red';
    }
    if (dateDiff === 0) {
        dateReminder = 'Eräpäivä tänään';
        className = 'header-yellow';
    }
    if (props.bill.in_payment && props.bill.in_account) {
        className = 'header-green';
    }
    if (props.bill.paid) {
        dateReminder = 'Maksettu';
        className = 'header-green';
    }

    // markChanges
    let markChanges = '';
    if (parseFloat(props.bill.sum) !== parseFloat(state.sum) ||
            props.bill.name !== state.name || props.bill.date !== state.date ||
            Boolean(props.bill.in_account) !== Boolean(state.in_account) ||
            Boolean(props.bill.in_payment) !== Boolean(state.in_payment) ||
            Boolean(props.bill.paid) !== Boolean(state.paid)) {
        markChanges = '*';
    }

    // Return
    return (
        <div className='update'>
            <h3 className={className}>{props.bill.name} &bull; {dateReminder} {markChanges}</h3>
            <form onSubmit={(event) => onSubmit(event, state, props.bill.id)}>
                <label>
                    Eräpäivä: <input type='date' name='date' value={state.date} onChange={onChange} required />
                </label>
                <label>
                    Summa: <input type='number' name='sum' step='0.01' value={state.sum} onChange={onChange} min='0.01' max='999999999' required />
                </label>
                <label>
                    Nimi: <input type='text' name='name' value={state.name} onChange={onChange} minLength='2' maxLength='50' required />
                </label>
                <label>
                    Tilillä <input type='checkbox' name='in_account' checked={state.in_account} onChange={onChange} />
                </label>
                <label>
                    Maksussa <input type='checkbox' name='in_payment' checked={state.in_payment} onChange={onChange} />
                </label>
                <label>
                    Maksettu <input type='checkbox' name='paid' checked={state.paid} onChange={onChange} />
                </label>
                <hr />
                <button className='btn-red' onClick={(event) => deleteBill(event, props.bill.id, props.bill.name)}>Poista</button>
                <input type='submit' value='Tallenna' />
            </form>
        </div>
    );
}

export default UpdateForm;