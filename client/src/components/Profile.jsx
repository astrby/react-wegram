import React, { useEffect,useState } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {languageData} from './storage/userData'
import {useTranslation} from 'react-i18next'
import {AiOutlineHeart} from 'react-icons/ai'
import {BiComment} from 'react-icons/bi'
import {userData} from './storage/userData'
import {AiFillHeart} from 'react-icons/ai'
import {getIdPosts, getLikes, postLike} from './connections/apiConnection'
import {ref, getDownloadURL} from 'firebase/storage'
import {storage} from './storage/FireBase'
import Alert from 'react-bootstrap/Alert'

const Profile = () => {

  const language = languageData((state)=>state.language)
  const[posts, setPosts] = useState([])
  const[t, i18n] = useTranslation("global");
  const loginData = userData((state)=>state.user)
  const[likes, setLikes] = useState(true)
  const[like, setLike] = useState('');
  const params = useParams();
  const[urlImg, setUrlImg] = useState('');
  const[alert, setAlert] = useState('');

  const handleLikes = async(postId) =>{
    if(loginData.length >0){
      postLike(loginData[0].id, postId);
        setTimeout(() => {
          if(like === true){
            setLike(false);
          }else{
            setLike(true)
          }
          console.log(like)
        }, 250);
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
    
    if(posts.length >0){
      const storageRef = ref(storage, `wegram/users/${posts[0].userId}/profilePic/profilePic.jpg`);
      getDownloadURL(storageRef).then((url)=>{
        setUrlImg(url)
      }).catch(()=>{
        setUrlImg('')
      })
    }
  },[posts])

  useEffect(()=>{
    getIdPosts(params.userId, setPosts);
    getLikes(loginData, setLikes);
  },[like])

  return (
    <Container fluid='md' className='text-center w-100'>
        {
          alert === 'errorLogin'
          ?
          <Alert variant='danger' className='mx-auto text-center' style={{position: 'absolute', left: 0, right: 0, width: '40%', marginTop: '-5rem'}}>{t("alert.errorLogin")}</Alert>
          :''
        }
        <Row className='justify-content-center' style={{gridTemplateColumns: 'repeat(auto-fit, minmax(210px, max-content))'}}>
          {
            posts.length > 0
            ?
              ([
                <div key={5}>
                  {
                      urlImg.length !== 0
                      ?
                      <img src={urlImg} style={{width: '5rem', height: '5rem', borderRadius: '50%'}} className='mt-1'/>
                      : ''
                    }
                </div>,

                <h3 key={4} className='text-center pb-5 mt-4'>{posts[0].username}</h3>,
                
                posts[0]._id !== 0

                ?
                posts.map((post, i)=>{
                  var repetido = false;
                  return <Card key={i} className='text-center ms-1 mb-1' style={{maxWidth: '18rem',minWidth:'18rem', marginRight:'1rem', marginTop:'1rem', maxHeight:'25rem', minHeight:'25rem'}}>
                    <Card.Img src={post.urlImage} style={{width: '15rem', height: '17rem', marginLeft:'-0.8rem', width:'110%', borderBottomLeftRadius:'0', borderBottomRightRadius: '0'}}/>
                    <Card.Body className='mt-3'>
                      <Card.Text>{post.description}</Card.Text>
                      <Container className='text-center'>
                        <p className='d-inline'><button style={{borderStyle: 'none', backgroundColor: 'white'}} onClick={() => handleLikes(post._id)}>
                        {
                          likes.length > 0
                          ?
                          likes.map((like,i)=>{
                            if(loginData[0].id === like.userId && post._id === like.postId){
                              return <AiFillHeart key={i} style={{fontSize: '1.5rem', color: '#126BF9'}}/>
                            }else{
                              const nullLikes = likes.find((p)=>{
                                return p.postId === post._id;
                              })
  
                              if(!nullLikes && repetido===false){
                                repetido = true;
                                return <AiOutlineHeart key={i} style={{fontSize: '1.5rem', color: '#0B59C8'}}/>
                              }
                            }
                          })
                          : <AiOutlineHeart style={{fontSize: '1.5rem', color: '#126BF9'}}/>
                        }
                          </button> {post.likes}</p>
                        <p className='d-inline'><a href={`/post/${post._id}`}className='ms-3'><BiComment  style={{fontSize: '1.5rem'}}/></a> {post.comments}</p>
                      </Container>
                    </Card.Body>
                  </Card>
                }): <h4 style={{marginTop: '2rem'}} key={10}>{t("index.noposts")}</h4>
              ])
            : 
              <h4 style={{marginTop: '2rem'}}>{t("index.noposts")}</h4>
          }
        </Row>
    </Container>
  )
}

export default Profile