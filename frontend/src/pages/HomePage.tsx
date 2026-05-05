import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          Fast approvals · Competitive rates
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Drive Your Dreams<br />
          <span className="text-blue-600">With Ease</span>
        </h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
          Apply for a car loan in minutes. Get a decision fast and track your application in real time.
        </p>

        {/* Action Cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link
            to="/apply"
            className="group card hover:border-blue-300 hover:shadow-lg transition-all p-8 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-200 transition">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Apply for a Loan</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Complete our simple 3-step form and get a decision within 24–48 hours.
            </p>
            <span className="mt-5 text-blue-600 font-semibold text-sm group-hover:text-blue-700">
              Start application →
            </span>
          </Link>

          <Link
            to="/track"
            className="group card hover:border-green-300 hover:shadow-lg transition-all p-8 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-green-200 transition">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Track Your Application</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Already applied? Enter your tracking ID to see where things stand.
            </p>
            <span className="mt-5 text-green-600 font-semibold text-sm group-hover:text-green-700">
              Check status →
            </span>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 grid sm:grid-cols-3 gap-8 border-t border-gray-200">
        {[
          { icon: '⚡', title: 'Fast Decision', desc: 'Get a loan decision within 24–48 hours of submitting your application.' },
          { icon: '🔒', title: 'Secure & Private', desc: 'Your personal and financial data is protected with industry-standard security.' },
          { icon: '💰', title: 'Competitive Rates', desc: 'Rates tailored to your credit profile, with flexible terms from 12 to 84 months.' },
        ].map(f => (
          <div key={f.title} className="text-center px-4">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
