import React from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import {languageData} from './storage/userData'
import {useTranslation} from 'react-i18next'
import {AiOutlineHeart} from 'react-icons/ai'
import {BiComment} from 'react-icons/bi'
import {userData} from './storage/userData'
import {AiFillHeart} from 'react-icons/ai'
import {getPosts, getLikes} from './connections/apiConnection'
import Alert from 'react-bootstrap/Alert'

const Index = () => {

  const language = languageData((state)=>state.language)
  const[posts, setPosts] = useState([])
  const[t, i18n] = useTranslation("global");
  const loginData = userData((state)=>state.user)
  const[likes, setLikes] = useState([])
  const[like, setLike] = useState('');
  const[alert, setAlert] = useState('');

  const handleLikes = async(postId) =>{
    if(loginData.length >0){
      await axios.post('https://react-wegram.vercel.app/postLike',{
      userId: loginData[0].id, postId: postId
      })
      if(like === true){
        setLike(false);
      }else{
        setLike(true)
      }
    }else{
      window.scroll({top: 0})
      setAlert('errorLogin');
      setTimeout(() => {
        setAlert('');
      }, 1500);
    }
  }

  useEffect(()=>{
    i18n.changeLanguage(language)
    getPosts(setPosts);
    getLikes(loginData, setLikes);
  },[like])

  return (
    <Container fluid='md' className='text-center w-100'>
      {
        alert === 'errorLogin'
        ?
        <Alert variant='danger' className='mx-auto text-center' style={{position: 'absolute', left: 0, right: 0, width: '40%', marginTop: '-5rem'}}>{t("alert.errorLogin")}</Alert>
        : ''
      }
      <h3 className='text-center pb-5 mt-5'>{t("index.posts")}</h3>
        <Row className='justify-content-start'>
          {
            posts.length !== 0
            ?
              posts.map((post, i)=>{
                var repetido = false;
                return <Card key={i} className='text-center ms-1 mb-1' style={{maxWidth: '18rem',minWidth:'18rem', marginRight:'1rem', marginTop:'1rem', maxHeight:'25rem', minHeight:'25rem'}}>
                  <Card.Img src={post.urlImage} style={{width: '15rem', height: '17rem', marginLeft:'-0.8rem', width:'110%', borderBottomLeftRadius:'0', borderBottomRightRadius: '0'}}/>
                  <Card.Body className='mt-3'>
                    <Card.Text><a href={`/${post.userId}`} style={{textDecoration: 'none', fontWeight: 'bold'}}>{post.username}</a> {post.description}</Card.Text>
                    <Container className='text-center'>
                      <p className='d-inline'><button style={{borderStyle: 'none', backgroundColor: 'white'}} onClick={() => handleLikes(post._id)}>
                        {
                          likes.length > 0
                          ?
                          likes.map((l)=>{
                            if(l.postId === post._id){
                              
                              if(l.like === false){
                                return <AiOutlineHeart key={0}style={{fontSize: '1.5rem', color: '#0B59C8'}}/>
                              }
                              if(l.like === true){
                                return <AiFillHeart key={1} style={{fontSize: '1.5rem', color: '#0B59C8'}}/>
                              }
                            }

                            const nullLikes = likes.find((p)=>{
                              return p.postId === post._id;
                            })

                            if(!nullLikes && repetido === false){
                              repetido = true;
                              return <AiOutlineHeart key={2}style={{fontSize: '1.5rem', color: '#0B59C8'}}/>
                            }
                          })
                          : <AiOutlineHeart key={3}style={{fontSize: '1.5rem', color: '#0B59C8'}}/>
                        }
                        </button> {post.likes}</p>
                      <p className='d-inline'><a href={`/post/${post._id}`}className='ms-3'><BiComment  style={{fontSize: '1.5rem'}}/></a> {post.comments}</p>
                    </Container>
                  </Card.Body>
                </Card>
              })
            : 
              <h4 style={{marginTop: '2rem'}}>{t("index.noposts")}</h4>
          }
        </Row>
    </Container>
  )
}

export default Index