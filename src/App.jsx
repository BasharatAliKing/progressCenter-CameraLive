import React from 'react'
import MapView from './pages/MapView'
import Home from './pages/Home'
import { BrowserRouter as Router ,Routes ,Route } from 'react-router-dom'
import MainOutlet from './pages/MainOutlet'
import ProjectView from './pages/ProjectView'
import "./App.css";
import Login from './pages/Login'
import Camera from './pages/Camera'
import LiveView from './pages/LiveView'
import AiPeopleFlow from './pages/AIPeopleFlow'
const App = () => {
  return (
     <Router>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<MainOutlet/>} >
          <Route path='' element={<Home/>} />
          <Route path='/dashboard' element={<Home/>} />
          <Route path='map' element={<MapView/>} />
          <Route path='project-view' element={<ProjectView/>} />
          <Route path='camera/:id' element={<Camera/>} />
          <Route path='live-view/:id' element={<LiveView/>} />
          <Route path='ai-peopleflow' element={<AiPeopleFlow/>} />
        </Route>
      </Routes>
     </Router>
  )
}

export default App
