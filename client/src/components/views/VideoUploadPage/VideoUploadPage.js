import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import Dropzone from 'react-dropzone';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOption = [
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
  const [Private, setPrivate] = useState(0);  // 0: private, 1: public
  // boolean이 아닌 이유 - 일부 공개처럼 다른 옵션 존재 가능
  const [Category, setCategory] = useState(0);

  const onTitleChange = (event) => {
    setVideoTitle(event.currentTarget.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.currentTarget.value);
  };

  const onPrivateChange = (event) => {
    setPrivate(event.currentTarget.value);
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

    axios.post('/api/videos', formData, config)
        .then(response => {
          if(response.data.success) {
            console.log(response.data);
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

        <select onChange={onPrivateChange}>
          {PrivateOption.map((item, index) => (
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