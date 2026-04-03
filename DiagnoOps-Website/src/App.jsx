import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './Home'
import JoinPlatform from './pages/JoinPlatform'
import Platform from './Platform'
import Support from './Support'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'


function App() {

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

              <Route path="/join-platform" element={<JoinPlatform />} />
              <Route path="/platform" element={<Platform/>}/>
              <Route path="/support" element={<Support/>}/>

              {/* User Login/register */}

              <Route path="/join-patient" element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
