import React, { useRef, useEffect, useState } from 'react';
import { CanvasManager } from './CanvasManager';
import './CanvasEditor.css';

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const [captionText, setCaptionText] = useState("Treat yourself to a divine Blueberry Cake - INR 900.00!");
  const [ctaText, setCtaText] = useState("Contact Us");
  const [backgroundColor, setBackgroundColor] = useState("#0369A1");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const canvasManager = new CanvasManager(canvasRef.current, {
      caption: {
        text: captionText,
        position: { x: 50, y: 50 },
        maxCharactersPerLine: 31,
        fontSize: 44,
        alignment: "left",
        textColor: "#FFFFFF"
      },
      cta: {
        text: ctaText,
        position: { x: 190, y: 320 },
        textColor: "#FFFFFF",
        backgroundColor: "#6D4C41" // Using the brown color shown in the image
      },
      imageMask: {
        x: 56,
        y: 442,
        width: 970,
        height: 600
      },
      backgroundColor,
      image
    });

    canvasManager.draw();
  }, [captionText, ctaText, backgroundColor, image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-row">
      <canvas ref={canvasRef} width="1080" height="1080" className="canvas"></canvas>
      <div className="controls ml-10">
        <div className="mb-4">
          <label className="block mb-2">Change the ad creative image:</label>
          <input type="file" onChange={handleImageUpload} />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Ad Content</label>
          <input
            type="text"
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">CTA</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Choose your color</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
