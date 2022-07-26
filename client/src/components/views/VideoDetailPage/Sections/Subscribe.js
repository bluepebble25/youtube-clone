import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Subscribe(props) {
  const [IsSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchSubscribed();
  }, []);

  const fetchSubscribed = () => {
    let subscribedVariable = { userTo: props.userTo, userFrom: props.userFrom };
      axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
          if(response.status === 200) {
            setIsSubscribed(response.data.isSubscribed);
            console.log(response.data.isSubscribed);
          } else {
            alert('구독 정보를 가져오지 못했습니다.');
          }
        });
  };

  const onSubscribe = () => {
    let subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom
    };

    if(IsSubscribed) {
    // 이미 구독 중이라면 구독 취소
      axios.post('/api/subscribe/unSubscribe', subscribeVariable)
        .then(response => {
          if(response.status === 200) {
            setIsSubscribed(!IsSubscribed);
            props.onSubscriberNumber(props.subscriberNumber - 1);
          } else {
            alert('구독 취소에 실패했습니다.');
          }
        });

    } else {
    // 구독하지 않은 상태라면 구독하기
      axios.post('/api/subscribe/subscribe', subscribeVariable)
        .then(response => {
          if(response.status === 200) {
            setIsSubscribed(!IsSubscribed);
            props.onSubscriberNumber(props.subscriberNumber + 1);
          } else {
            alert('구독에 실패했습니다.');
          }
        });
    }
  };

  return (
    <button style={{ backgroundColor: `${IsSubscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', border: 'none',
                    color: `${IsSubscribed ? '757575' : 'white'}`, padding: '10px 16px', cursor: 'pointer',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                  }}
            onClick={onSubscribe}
    >
      {IsSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  )
}

export default Subscribe