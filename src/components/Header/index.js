import {Link, withRouter} from 'react-router-dom'
import {MdHome} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Cookies from 'js-cookie'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className='nav-header'>
      <ul>
        <Link to='/'>
          <li>
            <img
              src='https://assets.ccbp.in/frontend/react-js/logo-img.png'
              alt='website logo'
            />
          </li>
        </Link>
        <Link to='/' className='nav-link'>
          <li>
            <h1>Home</h1>
            <MdHome />
          </li>
        </Link>
        <Link to='/jobs' className='nav-link'>
          <li>
            <BsFillBriefcaseFill />
            <h1>Jobs</h1>
          </li>
        </Link>
        <li>
          <button
            type='button'
            className='logout-desktop-btn'
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
