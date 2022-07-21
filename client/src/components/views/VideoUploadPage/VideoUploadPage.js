import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TextArea } = Input;

const PrivacyOption = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" }
];

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" }
];

function VideoUploadPage(props) {
  const user = useSelector(state => state.user);

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Privacy, setPrivacy] = useState(0);  // 0: private, 1: public
  const [Category, setCategory] = useState("0");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const [IsSubmited, setIsSubmited] = useState(false);

  const onTitleChange = (event) => {
    setVideoTitle(event.currentTarget.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.currentTarget.value);
  };

  const onPrivacyChange = (event) => {
    setPrivacy(event.currentTarget.value);
  };

  const onCategoryChange = (event) => {
    setCategory(event.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: {'content-type': 'multipart/form-data'}
    };
    formData.append('file', files[0]);  // <input name='file' value=files[0]>

    axios.post('/api/videos/uploadfiles', formData, config)
        .then(response => {
          if(response.status === 200) {
            console.log(response.data);
            setFilePath(response.data.filePath);

            let variable = {
              filePath: response.data.filePath,
              fileName: response.data.fileName
            };
            
            axios.post('/api/videos/thumbnail', variable)
              .then(response => {
                console.log(response.data);
                setThumbnailPath(response.data.thumbnailPath);
                setDuration(response.data.fileDuration);
              });

          } else {
            alert('비디오 업로드를 실패했습니다.');
          }
        });

  };

  const onSubmit = (event) => {
    event.preventDefault();

    // IsSubmited - 중복클릭 방지
    if(!IsSubmited) {
      setIsSubmited(true);
      if(user.userData && !user.userData.isAuth) {
        return alert('로그인을 해주세요');
      }
  
      if(VideoTitle === "" || Description === "" ||
        Category === "" || FilePath === "" ||
        Duration === "" || ThumbnailPath === "") {
          return alert('모든 항목을 빠짐없이 채워주세요');
        }
  
      const variables = {
        writer: user.userData._id,
        title: VideoTitle,
        description: Description,
        privacy: Privacy,
        filePath: FilePath,
        category: Category,
        duration: Duration,
        thumbnail: ThumbnailPath
      };
  
      axios.post('/api/videos/uploadVideo', variables)
        .then(response => {
          if(response.status === 201) {
            message.success('성공적으로 업로드를 했습니다.')
  
            setTimeout(() => {
              props.history.push('/');
            }, 2000);
          } else {
            alert('비디오 업로드에 실패했습니다.');
          }
        });
    }
    
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2} >Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          
          {/* Drop zone */}
          <Dropzone
          onDrop={onDrop}
          multiple={false}
          maxSize={1000000000}
          >
            {({ getRootProps, getInputProps }) => (
              <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                alignItems: 'center', justifyContent: 'center' }} {...getRootProps()} >
                  <input {...getInputProps()} />
                  <Icon type="plus" style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>


          {/* Thumbnail */}
          {ThumbnailPath &&
          <div>
            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
          </div>
          }
          

        </div>

        <label>
          Title
          <Input
            onChange={onTitleChange}
            value={VideoTitle}
          />
        </label>
        
        <br />
        <br />

        <label>
          Description
          <TextArea
            onChange={onDescriptionChange}
            value={Description}
          />
        </label>
        
        <br />
        <br />

        <select onChange={onPrivacyChange}>
          {PrivacyOption.map((item, index) => (
            <option key={index} value={item.value} >{item.label}</option>
          ))}
        </select>
        <br />
        <br />

        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>
        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>

      </Form>

    </div>
  )
}

export default VideoUploadPage