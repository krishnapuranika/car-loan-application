import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ApplyPage from './pages/ApplyPage'
import TrackPage from './pages/TrackPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/track" element={<TrackPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
