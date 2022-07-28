import React, { useState, useEffect } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {

  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComment, setOpenReplyComment] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
  
    props.commentLists.forEach((comment) => {
      if(comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });

    setChildCommentNumber(commentNumber);
  }, [props.commentLists, props.parentCommentId]);
  
  const renderReplyComment = (parentCommentId) => props.commentLists.map((comment, index) => (
      <React.Fragment key={comment._id}>
      { parentCommentId === comment.responseTo && 
        <div style={{ width: '80%', marginLeft: '40px' }}>
          <SingleComment comment={comment} refreshComments={props.refreshComments} />
          <ReplyComment commentLists={props.commentLists} refreshComments={props.refreshComments} parentCommentId={comment._id} />
        </div>
      }
      </React.Fragment>
    )
  );


  const onClickHandler = () => {
    setOpenReplyComment(!OpenReplyComment);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && 
        <p onClick={onClickHandler}>
          View {ChildCommentNumber} more comment(s)
        </p>
      }
      {OpenReplyComment && 
        renderReplyComment(props.parentCommentId)
      }
    </div>
  )
}

export default ReplyComment