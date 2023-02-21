import axios from 'axios'

export const getPosts = async(setPosts) =>{
  const peticion = await axios.get('http://localhost:3001/getPosts');
  setPosts(peticion.data);
}

export const getIdPosts = async(userId, setPosts) =>{
  const peticion = await axios.post('http://localhost:3001/getIdPosts', {userId: userId});
  setPosts(peticion.data);
}

export const getPost = async(id,setPost) =>{
  const peticion = await axios.post('http://localhost:3001/getPost', {id: id})
  setPost(peticion.data);
};

export const getLikes = async(loginData, setLikes) =>{
  if(loginData.length >0){
    const peticion = await axios.post('http://localhost:3001/getLikes',{userId: loginData[0].id});
    setLikes(peticion.data);
  }
}

export const getComments = async(postId, setComments)=>{
  const peticion = await axios.post('http://localhost:3001/getComments',{
    postId: postId
  })
  setComments(peticion.data)
}

