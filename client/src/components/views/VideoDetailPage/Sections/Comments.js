import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Input } from 'antd';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';


const { TextArea } = Input;

function Comments(props) {
  const user = useSelector(state => state.user);
  const videoId = props.videoId;
  const [CommentValue, setCommentValue] = useState("");

  const onChangeHandler = (event) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if(user.userData && !user.userData.isAuth) {
      return alert('로그인을 해주세요');
    }

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      videoId: videoId
    };

    axios.post('/api/comment/saveComment', variables)
      .then(response => {
        if(response.status === 200) {
          setCommentValue("");
          props.refreshComments(response.data.result);
        } else {
          alert('댓글을 저장하지 못했습니다.');
        }
      });
  };

  return (
    <div>
      <br />
      <hr />
      <p>Replies</p>

      {/* Root Comment Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit} >
        <TextArea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onChangeHandler}
            value={CommentValue}
            placeholder="댓글을 남겨주세요"
        />
        <br />
        <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</Button>
      </form>
      <br />
      {/* Comment Lists */}
      {props.commentLists && props.commentLists.map((comment, index) => (
        (!comment.responseTo && 
          <React.Fragment key={comment._id}>
            <SingleComment refreshComments={props.refreshComments} comment={comment} videoId={videoId} />
            <ReplyComment commentLists={props.commentLists} refreshComments={props.refreshComments} parentCommentId={comment._id} />
          </React.Fragment>
        )
        
      ))}
    </div>
  )
}

export default Comments