export const PageRows = (props) => {
    return (
        <div className='pagerows'>
            <select name='limit' onChange={props.pageRows}>
                <option value='' hidden>Näytä: {props.limit}</option>
                <option value='5'>Näytä: 5</option>
                <option value='10'>Näytä: 10</option>
                <option value='20'>Näytä: 20</option>
            </select>
        </div>
    );
}

export const Pagination = (props) => {
    let prev = props.page > 1 && props.count > 1 ? <button className='btn-blue' onClick={props.prevPage}>&nbsp;&lt;&nbsp;</button> : '';
    let page = props.limit < props.count ? <span>{props.page}</span> : '';
    let next = props.page * props.limit < props.count ? <button className='btn-blue' onClick={props.nextPage}>&nbsp;&gt;&nbsp;</button> : '';
    return <div className='pagination'>{prev}{page}{next}</div>;
}