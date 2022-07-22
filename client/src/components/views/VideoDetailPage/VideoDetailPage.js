import React, { useState, useEffect } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import { useSelector } from 'react-redux';

function VideoDetailPage(props) {
  const user = useSelector(state => state.user);
  const [VideoDetail, setVideoDetail] = useState(null);

  const videoId = props.match.params.videoId;
  useEffect(() => {
    axios.get(`/api/videos/${videoId}`)
      .then(response => {
        if(response.status === 200) {
          setVideoDetail(response.data.videoDetail);
          console.log(response.data);
        } else {
          alert('비디오 정보를 가져오는데 실패했습니다.');
        }
      });
  
  }, [])
  
  if(VideoDetail) {
    return (
      <Row>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
  
            <List.Item
              actions
            >

              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
  
            </List.Item>
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    )
  } else {
    return (
      <div>...Loading</div>
    )
  }

  
}

export default VideoDetailPage