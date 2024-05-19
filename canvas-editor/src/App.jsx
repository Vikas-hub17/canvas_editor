import React, { useRef, useState, useEffect, useCallback } from 'react';
import 'tailwindcss/tailwind.css';

const templateData = {
  caption: {
    text: "Treat yourself to a divine Blueberry Cake - INR 900.00",
    position: { x: 50, y: 50 },
    max_characters_per_line: 31,
    font_size: 18,
    alignment: "left",
    text_color: "#FFFFFF"
  },
  cta: {
    text: "Contact Us",
    position: { x: 290, y: 290 },
    text_color: "#FFFFFF",
    background_color: "#4B5563"
  },
  image_mask: { x: 56, y: 56, width: 320, height: 320 },
  urls: {
    mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
    stroke: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
    design_pattern: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png"
  },
  background_color: "#0369A1"
};

const App = () => {
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const [data, setData] = useState(templateData);
  const [colorHistory, setColorHistory] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [image, setImage] = useState(null);

  const setupCanvas = useCallback(() => {
    if (offscreenCanvasRef.current && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        canvas: offscreenCanvasRef.current,
        templateData: data,
        image
      });
    }
  }, [data, image]);

  useEffect(() => {
    if (canvasRef.current && !offscreenCanvasRef.current) {
      offscreenCanvasRef.current = canvasRef.current.transferControlToOffscreen();
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        setupCanvas();
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, [setupCanvas]);

  const handleInputChange = (field, value) => {
    const newData = { ...data, [field]: { ...data[field], text: value } };
    setData(newData);
    setupCanvas();
  };

  const handleColorChange = (color) => {
    const newData = { ...data, background_color: color };
    setData(newData);

    const newColorHistory = [...colorHistory];
    if (!newColorHistory.includes(color)) {
      newColorHistory.unshift(color);
      if (newColorHistory.length > 5) {
        newColorHistory.pop();
      }
      setColorHistory(newColorHistory);
    }

    setupCanvas();
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleEyeDropper = async () => {
    if (window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        handleColorChange(result.sRGBHex);
      } catch (error) {
        console.error("EyeDropper API error:", error);
      }
    } else {
      alert('Your browser does not support the EyeDropper API');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          setImage(img);
          setupCanvas();
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <canvas ref={canvasRef} className="border mb-4 w-96 h-96"></canvas>
          </div>
          <div className="w-96 ml-8">
            <h2 className="text-2xl font-bold mb-4">Ad customization</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Change the ad creative image</label>
              <input type="file" onChange={handleImageUpload} className="border p-2 mb-2 w-full" accept="image/*" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Ad Content</label>
              <input type="text" value={data.caption.text} onChange={(e) => handleInputChange('caption', e.target.value)} className="border p-2 mb-2 w-full" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">CTA</label>
              <input type="text" value={data.cta.text} onChange={(e) => handleInputChange('cta', e.target.value)} className="border p-2 mb-2 w-full" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Choose your color</label>
              <div className="flex items-center mb-2">
                {colorHistory.map((color, index) => (
                  <button key={index} className="w-8 h-8 border mr-2" style={{ backgroundColor: color }} onClick={() => handleColorChange(color)} />
                ))}
                <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full border" onClick={toggleColorPicker}>+</button>
                {showColorPicker && (
                  <input type="color" onChange={(e) => handleColorChange(e.target.value)} className="border p-2 ml-2" />
                )}
              </div>
              <button className="bg-blue-500 text-white p-2 rounded" onClick={handleEyeDropper}>Pick a color from this page</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
