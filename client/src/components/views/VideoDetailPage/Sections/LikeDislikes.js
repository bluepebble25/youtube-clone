import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

function LikeDislikes(props) {
  const user = useSelector(state => state.user);

  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variable = {};

  if(props.videoId) {
    variable = { videoId: props.videoId, userId: props.userId }
  } else {
    variable = { commentId: props.commentId , userId: props.userId }
  }

  useEffect(() => {
    axios.post('/api/like/getLikes', variable)
      .then(response => {
        if(response.data.success) {
          setLikes(response.data.likes.length);

          response.data.likes.map(like => {
            if(like.userId === props.userId) {
              setLikeAction(true);
            }
          })
        } else {
          alert('Likes 정보를 가져오는데 실패했습니다.')
        }
      });

      axios.post('/api/like/getDislikes', variable)
      .then(response => {
        if(response.data.success) {
          setDislikes(response.data.dislikes.length);

          response.data.dislikes.map(like => {
            if(like.userId === props.userId) {
              setDislikeAction(true);
            }
          })
        } else {
          alert('Dislikes 정보를 가져오는데 실패했습니다.')
        }
      });

  }, [])
  
  const onLike = () => {

    if(user.userData && !user.userData.isAuth) {
      return alert('로그인을 해주세요');
    }

    if(LikeAction === null) {
      axios.post('/api/like/upLike', variable)
        .then(response => {
          if(response.data.success) {
            setLikes(Likes + 1);
            setLikeAction(true);

            // like가 null이어도 dislike가 이미 눌려있어서 그럴 수도 있기 때문에 dislike 여부도 확인한다.
            if(DislikeAction !== null) {
              setDislikeAction(null);
              setDislikes(Dislikes - 1);
            }

          } else {
            alert('Like를 올리는데 실패했습니다.');
          }
        });

    } else {
      axios.post('/api/like/unLike', variable)
        .then(response => {
          if(response.data.success) {
            setLikes(Likes - 1);
            setLikeAction(null);
          } else {
            alert('Like를 취소하는데 실패했습니다.');
          }
        });
    }
  };

  const onDislike = () => {
    
    if(user.userData && !user.userData.isAuth) {
      return alert('로그인을 해주세요');
    }
    
    if(DislikeAction === null) {
      axios.post('/api/like/upDislike', variable)
        .then(response => {
          if(response.data.success) {
            setDislikes(Dislikes + 1);
            setDislikeAction(true);

            // dislike가 null이어도 like가 이미 눌려있어서 그럴 수도 있기 때문에 like 여부도 확인한다.
            if(LikeAction !== null) {
              setLikeAction(null);
              setLikes(Likes - 1);
            }

          } else {
            alert('Dislike를 올리는데 실패했습니다.');
          }
        });

    } else {
      axios.post('/api/like/unDislike', variable)
        .then(response => {
          if(response.data.success) {
            setDislikes(Dislikes - 1);
            setDislikeAction(null);
          } else {
            alert('Like를 취소하는데 실패했습니다.');
          }
        });
    }
  }

  return (
    <div>
      <span key="comment-basic-like" >
        <Tooltip title="Like">
          <Icon type="like"
                theme={LikeAction ? 'filled' : 'outlined'}
                onClick={onLike}
          />
        </Tooltip>
      </span>
      <span style={{ padingLeft: '8px', cursor: 'auto' }}> {Likes} </span>

      <span key="comment-basic-dislike" >
        <Tooltip title="Dislike">
          <Icon type="dislike"
                theme={DislikeAction ? 'filled' : 'outlined'}
                onClick={onDislike}
          />
        </Tooltip>
      </span>
      <span style={{ padingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
    </div>
  )
  
}

export default LikeDislikes