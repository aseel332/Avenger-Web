import Sidebar from './Sidebar';
export default function posts()
{
    const header = (<header className="title-container">
    <p className="red-title">Posts</p>
    <hr className="red-line" />
  </header>);
    return(
        <>
            {header}
            Post likh dijiye
        </>
    )

}