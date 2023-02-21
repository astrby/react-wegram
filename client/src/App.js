import {BrowserRouter, Routes, Route} from 'react-router-dom'
import NB from './components/NB'
import Index from './components/Index'
import Registration from './components/Registration';
import Login from './components/Login'
import CreatePost from './components/CreatePost'
import MyPosts from './components/MyPosts'
import MyProfile from './components/MyProfile'
import Profile from './components/Profile'
import Contact from './components/Contact'
import Post from './components/Post'
import Footer from './components/Footer'
import './components/cssFiles/App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={'/'}>
      <NB/>
        <div className='wrap-container'>
          <div className='body'>
            <Routes>
              <Route path='/' element={<Index></Index>}/>
              <Route path='/registration' element={<Registration></Registration>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/createPost' element={<CreatePost></CreatePost>}/>
              <Route path='/myPosts' element={<MyPosts></MyPosts>}/>
              <Route path='/myProfile' element={<MyProfile/>}/>
              <Route path='/contact' element={<Contact/>}/>
              <Route path='/post/:id' element={<Post/>}/>
              <Route path='/:userId' element={<Profile/>}/>
            </Routes>
          </div>
          <Footer className='footer'/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
