import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import Dropzone from 'react-dropzone';
import axios from 'axios';

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

function VideoUploadPage() {

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Privacy, setPrivacy] = useState(0);  // 0: private, 1: public
  const [Category, setCategory] = useState(0);
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState("");

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
                setThumbnail(response.data.thumbnailPath);
                setDuration(response.data.fileDuration);
              });

          } else {
            alert('비디오 업로드를 실패했습니다.');
          }
        });

  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2} >Upload Video</Title>
      </div>

      <Form>
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
          {/* <div>
            <img src={thumbnailPath} alt="thumbnail" />
          </div> */}

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

        <Button type="primary" size="large">
          Submit
        </Button>

      </Form>

    </div>
  )
}

export default VideoUploadPage