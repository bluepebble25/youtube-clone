import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux';

function Subscribe(props) {
  const user = useSelector(state => state.user);
  const [IsSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if(user.userData) {
      let subscribedVariable = { userTo: props.userTo, userFrom: props.userFrom };
      axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
          if(response.status === 200) {
            setIsSubscribed(response.data.isSubscribed);
            console.log(response.data.isSubscribed);
          } else {
            alert('구독 정보를 가져오지 못했습니다.');
          }
        })
    }
  }, [user]);
  

  return (
    <button style={{ backgroundColor: `${IsSubscribed ? '#AAAAA' : '#CC0000'}`, borderRadius: '4px', border: 'none',
                    color: `${IsSubscribed ? '757575' : 'white'}`, padding: '10px 16px', cursor: 'pointer',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
    }}>
      {IsSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  )
}

export default Subscribe