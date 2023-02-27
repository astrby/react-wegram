import React from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import { useEffect, useState } from 'react'
import {userData} from '../components/storage/userData'
import {useTranslation} from 'react-i18next'
import { languageData } from '../components/storage/userData'
import {AiFillHeart} from 'react-icons/ai'
import {getIdPosts, getLikes, postLike} from './connections/apiConnection'
import {AiOutlineHeart} from 'react-icons/ai'
import {BiComment} from 'react-icons/bi'

const MyPosts = () => {
    
    const language = languageData(state=> state.language);
    const loginData = userData((state)=> state.user);
    const[posts, setPosts] = useState([]) ;
    const[t, i18n] = useTranslation("global");
    const[likes, setLikes] = useState([])
    const[like, setLike] = useState('');

    const handleLikes = (postId) =>{
        if(loginData.length >0){
          postLike(loginData[0].id, postId);
        setTimeout(() => {
          if(like === true){
            setLike(false);
          }else{
            setLike(true)
          }
        }, 250);
        }
        if(like === true){
          setLike(false);
        }else{
          setLike(true)
        }
      }
    
      useEffect(()=>{
        i18n.changeLanguage(language)
        getLikes(loginData, setLikes);
        getIdPosts(loginData[0].id, setPosts);
      },[like])

    return (
        <Container fluid='md' className='text-center w-100'>
            <h3 className='text-center'>{t("myposts.myposts")}</h3>
            <CardGroup className='ms-5'>
            {
                posts.length !== 0
                ?
                posts.map((post,i)=>{
                  var repetido = false;
                  return <Card key={i} className='text-center' style={{maxWidth: '18rem',minWidth:'18rem', marginRight:'1rem', marginTop:'1rem', maxHeight:'22rem', minHeight:'22rem'}}>
                      <Card.Img src={post.urlImage} style={{width: '15rem', height: '17rem', marginLeft:'-0.8rem', width:'110%', borderBottomLeftRadius:'0', borderBottomRightRadius: '0'}}/>
                      <Card.Body className='mt-2'>
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
                    
                })
                : <h4 style={{ marginTop: '2rem'}}>No hay publicaciones.</h4>
            }
            </CardGroup>
        </Container>
    )
}

export default MyPosts