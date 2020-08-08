import React, { useState, useRef } from 'react';
import './App.css';

import axios from 'axios'
import BeatLoader from 'react-spinners/BeatLoader'
import ImageSlider from "react-image-comparison-slider";

import wavesvg from './wave.svg'
import blob1 from './blob1.svg'
import blob2 from './blob2.svg'

function App() {

  const [inputImg,setInputImg]=useState(null)
  const [uploadProgress,setProgress]=useState(0)
  const [output,setOutput]=useState(0)
  const inputRef=useRef()
  const [outputRef,setO]=useState('')
  
  const handleInput=(fileObj)=>{
    setInputImg(fileObj)
    inputRef.current.src=URL.createObjectURL(fileObj)
  }

  const resetInput=()=>{
    setOutput(0)
    setInputImg(null)
    inputRef.current.src=""
  }

  const handleUpload=()=>{
    setProgress(1)
    let formData = new FormData();
    formData.append('file', inputImg);
    formData.append('value',document.querySelector('#quantvals').value)
    axios.post('https://colorquant.herokuapp.com/upload',formData,{}).then(res=>{
      setProgress(0)
      setOutput(1)
      inputRef.current.src=""
      if(res.data.success){
        setO(res.data.url)
      }else{
        setO(URL.createObjectURL(inputImg))
      }
    }).catch(err=>{setProgress(0);setOutput(0);console.log(err)})
  }

  return (
    <div className="App">
      <img id="blob1" src={blob1} alt="img" />
      <img id="blob2" src={blob2} alt="img" />
      <h1>Color<span>Quant</span></h1>

      <div className="appMain">
        {!inputImg?<input type="file" accept="image/*" onChange={(e)=>{handleInput(e.target.files[0])}} />:
          null
        }

        {output?<div className="outputImg" style={{ marginTop:'2rem', width: '700px', minHeight: '400px', maxWidth:'100%', maxHeight: '80%' }}><ImageSlider
          image1={URL.createObjectURL(inputImg)}
          image2={outputRef}
          onSlide={() => {}}
        /></div>:null}
        
        <img id="iinput" ref={inputRef} />
        {inputImg?<div className="btns">

        {!uploadProgress?<>{!output?<><br /><label>How many no. of colors you want: </label>
          <select id="quantvals">
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="32">32</option>
            <option value="64">64</option>
          </select><br /></>:null}<button className="btn reset" onClick={resetInput}>Reset</button>
        {!output?<button className="btn upload" onClick={handleUpload}>Upload</button>:null}</>:null}

        <BeatLoader css={{marginTop:'1.5rem'}} color={"#33ae98"} loading={uploadProgress} />

        </div>:null}
      </div>

      <img id="wavesvg" src={wavesvg} alt="img" />
    </div>
  );
}

export default App;
