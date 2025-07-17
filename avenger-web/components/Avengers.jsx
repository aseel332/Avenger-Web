import Sidebar from './Sidebar';

export default function Avengers()
{
    const header=(
        <header className="title-container">
        <p className="red-title">Avengers Database</p>
        <hr className="red-line" />
        </header>
    );
    return(
        <>
            {header}
            Avengers ka data
        </>
    )
}