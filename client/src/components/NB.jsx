import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import {userData, languageData} from './storage/userData'
import { useEffect } from 'react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Logo from '../assets/logo.jpg'
import {storage} from './storage/FireBase'
import {ref, getDownloadURL} from 'firebase/storage'
import {useTranslation} from 'react-i18next'

const NB = () => {

  const loginData = userData((state)=>state.user);
  const language = languageData((state)=>state.language)
  const setLanguage = languageData((state)=>state.setLanguage)
  const logout = userData((state)=>state.logout);
  const[username, setUsername]= useState('');
  const navigate = useNavigate();
  const[urlImg, setUrlImg] = useState('');
  const[t, i18n] = useTranslation("global");

  const clickLogout = ()=>{
    logout();
    navigate('/login')
    window.location.reload()
  }

  const handleEs = () =>{
    setLanguage("es")
    window.location.reload();
  }

  const handleEn = () =>{
    setLanguage("en")
    window.location.reload();
  }

  useEffect(()=>{
    i18n.changeLanguage(language)
    if(loginData.length > 0){
      setUsername(loginData[0].username)
      const storageRef = ref(storage, `wegram/users/${loginData[0].id}/profilePic/profilePic.jpg`)

        getDownloadURL(storageRef).then((url)=>{
          setUrlImg(url)
        }).catch(()=>{
          setUrlImg('')
        })
    }
  }, [loginData])

  return (
    <Navbar variant='light' expand='sm' className='position-absolute w-100'>
        <Container>
            <Navbar.Brand href='/'><img style={{width: '3rem', marginRight:'0.5rem'}} src={Logo}/>Wegram</Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse  id='basic-navbar-nav'>
                <Nav className='ms-auto' style={{marginRight:'1rem'}}>
                  {
                    username !== ''
                    ?
                      [
                        <div key={0}>
                          {
                            urlImg.length !== 0
                            ?
                            <img src={urlImg} style={{width: '2rem', height: '2rem', borderRadius: '50%'}} className='mt-1'/>
                            : ''
                          }
                        </div>,
                        <NavDropdown key={1}title={username}>
                        <NavDropdown.Item href='/createPost'>{t("nb.createpost")}</NavDropdown.Item>
                        <NavDropdown.Item href='myPosts'>{t("nb.myposts")}</NavDropdown.Item>
                        <NavDropdown.Item href='myProfile'>{t("nb.profile")}</NavDropdown.Item>
                      </NavDropdown>,
                      <Nav.Link key={3} onClick={clickLogout}>{t("nb.logout")}</Nav.Link>]
                    :
                      [<Nav.Link key={4} href='/login'>{t("nb.login")}</Nav.Link>,
                      <Nav.Link key={5} href='/registration'>{t("nb.signup")}</Nav.Link>
                    ]
                  }
                  <Nav.Link key={6} href='/contact'>{t("nb.contact")}</Nav.Link>
                </Nav>
                <div>
                  <button onClick={handleEs} style={{borderStyle: 'none', backgroundColor: 'white'}}>ES</button>
                  <button onClick={handleEn} style={{borderStyle: 'none', backgroundColor: 'white'}}>EN</button>
                </div>
            </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}

export default NB