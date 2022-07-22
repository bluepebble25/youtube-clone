import React, { useState, useEffect } from 'react'
import axios from 'axios';

function SideVideo() {

  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    axios.get('/api/videos')
      .then(response => {
        if(response.status === 200) {
          setSideVideos(response.data.videos);
        } else {
          alert('비디오를 가져오는데 실패했습니다.');
        }
      });
  }, [])
  
  const renderSideVideos = SideVideos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }} key={index}>
        {/* img */}
        <div style={{ position: 'relative', width: '40%', marginRight: '1rem' }}>
          <a href={`/video/${video._id}`}>
            <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
          </a>
          <div
            style={{
              bottom: 0, right: 0, position: 'absolute', margin: '4px',
              color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8,
              padding: '2px 4px', borderRadius: '2px', letterSpacing: '0.5px', fontSize: '12px',
              fontWeight: '500', lineHeight: '12px'
            }}
          >
              <span>{minutes} : {seconds}</span>
          </div>
        </div>

        {/* info */}
        <div style={{ width: '50%' }}>
          <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
            <span style={{ color: 'black' }}>{video.title}</span><br />
            <span>{video.writer.name}</span><br />
            <span>{video.views} views</span><br />
          </a>
        </div>

    </div>
    )
});

  return (
    <div style={{ marginTop: '3rem' }}>
      {renderSideVideos}
    </div>
  )
}

export default SideVideo