import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './Home'
import JoinPlatform from './pages/JoinPlatform'


function App() {

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

              <Route path="/join-platform" element={<JoinPlatform />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
