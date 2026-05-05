import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
    }`

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
            <span className="font-bold text-xl text-gray-900">CarLoan</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/apply" className={linkClass('/apply')}>
              Apply Now
            </Link>
            <Link
              to="/track"
              className={`text-sm font-medium px-4 py-1.5 rounded-lg transition ${
                location.pathname === '/track'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Track Application
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
