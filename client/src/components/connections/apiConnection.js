import axios from 'axios'

export const getPosts = async(setPosts) =>{
  const peticion = await axios.get('https://react-wegram.vercel.app/getPosts');
  setPosts(peticion.data);
}

export const getIdPosts = async(userId, setPosts) =>{
  const peticion = await axios.post('https://react-wegram.vercel.app/getIdPosts', {userId: userId});
  setPosts(peticion.data);
}

export const getPost = async(id,setPost) =>{
  const peticion = await axios.post('https://react-wegram.vercel.app/getPost', {id: id})
  setPost(peticion.data);
};

export const getLikes = async(loginData, setLikes) =>{
  if(loginData.length >0){
    const peticion = await axios.post('https://react-wegram.vercel.app/getLikes',{userId: loginData[0].id});
    setLikes(peticion.data);
  }
}

export const getComments = async(postId, setComments)=>{
  const peticion = await axios.post('https://react-wegram.vercel.app/getComments',{
    postId: postId
  })
  setComments(peticion.data)
}

export const postLike = async(userId, postId)=>{
  await axios.post('https://react-wegram.vercel.app/postLike',{
    userId: userId, postId: postId
  })
}

