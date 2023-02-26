import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import axios from 'axios'
import {AiOutlineHeart} from 'react-icons/ai'
import {AiFillHeart} from 'react-icons/ai'
import {userData} from './storage/userData'
import {getPost,getLikes,getComments} from './connections/apiConnection'
import Alert from 'react-bootstrap/Alert'
import {useTranslation} from 'react-i18next'
import {languageData} from './storage/userData'

const Post = () => {

    const language = languageData((state)=>state.language)
    const params = useParams();
    const[post, setPost] = useState([]);
    const[likes, setLikes] = useState([])
    const[like, setLike] = useState(true);
    const[comments, setComments] = useState([]);
    const loginData = userData((state) => state.user)
    const[alert, setAlert] = useState('');
    const[t, i18n] = useTranslation('global');
    
    const handleLike = async(postId) =>{
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

    const handleComment = async(postId) => {
        if(loginData.length >0){
            const comment = document.getElementById('comment').value;
            if(!comment.trim()){
                setAlert('errorEmpty')
                setTimeout(() => {
                    setAlert('');
                }, 1500);
            }else{
                await axios.post('https://react-wegram.vercel.app/postComment',{
                    userId: loginData[0].id, postId: postId, comment: comment
                })
                console.log(comment+" "+postId )
            }
        }else{
            window.scroll({top: 0})
            setAlert('errorLogin');
            setTimeout(() => {
                setAlert('');
            }, 1500);
        }
    }

    const reload = () =>{
        const comment = document.getElementById('comment').value;
        if(loginData.length >0 && comment.trim()){
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } 
    }

    useEffect(()=>{
        getPost(params.id, setPost);
        getLikes(loginData, setLikes);
    },[like])

    useEffect(()=>{
        i18n.changeLanguage(language)
        getComments(params.id, setComments);
    },[])

  return (
    <Container>
        {
            alert === 'errorLogin'
            ?
            <Alert variant='danger' className='mx-auto text-center' style={{position: 'absolute', left: 0, right: 0, width: '50%', marginTop: '-5rem'}}>{t("alert.errorLogin")}</Alert>
            : alert === 'errorEmpty'
            ?
            <Alert variant='danger' className='mx-auto text-center' style={{position: 'absolute', left: 0, right: 0, width: '50%', marginTop: '-5rem'}}>{t("alert.sent")}</Alert>
            :''
        }
        {
            post !== null
            ?
             <Container>
                <Row className='w-100'>
                    <Col md={6} className='text-center mb-4  ms-2'>
                        <Image src={post.urlImage} fluid style={{borderRadius: '5px', height: '25rem'}}/>
                    </Col>
                    <Col className='text-center mt-2' md={4}>
                        <p className='d-inline'><button style={{borderStyle: 'none', backgroundColor: 'white'}} onClick={() => handleLike(post._id)}>
                        {
                            likes.length > 0
                            ?
                            likes.map((l,i)=>{
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

                                if(!nullLikes){
                                return <AiOutlineHeart key={i} style={{fontSize: '1.5rem', color: '#0B59C8'}}/>
                                }
                            })
                            : <AiOutlineHeart key={3}style={{fontSize: '1.5rem', color: '#0B59C8'}}/>
                        }
                        </button> {post.likes}</p>
                        <h4 className='mt-4 mb-4'><a href={`/${post.userId}`} style={{textDecoration: 'none'}}>{post.username}</a> {post.description}</h4>
                        <h6 className='mt-5 mb-3' style={{fontWeight: 'bold'}}>{t("post.comment")}:</h6>
                        <Container style={{borderStyle: 'solid', borderRadius: '5px', borderWidth: '1px',borderColor: '#CFD4DA', height: '10rem', overflowY: 'scroll', minWidth: '20rem', maxWidth: '20rem'}}>
                            {
                                comments !== null
                                ?
                                comments.map((comment,i)=>{
                                    return <p key={i} style={{textAlign: 'left'}}><a href={`/${comment.userId}`} style={{fontWeight: 'bold', textDecoration: 'none'}}>{comment.username}</a> {comment.comment}</p>
                                })
                                :''
                            }
                        </Container>
                        <Container  style={{width: '20rem'}}>
                            <Row className='gap-1'>
                                <Col xs={10} style={{marginLeft: '-0.75rem'}}>
                                    <Form.Control id='comment'/>
                                </Col>
                                <Col xs={2} style={{marginLeft: '-2rem'}}>
                                    <Button onClick={()=>{handleComment(post._id); reload()}}>{t("post.buttonPost")}</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
            :
            ''
        }
    </Container>
  )
}

export default Post