self.onmessage = (e) => {
    const { canvas, templateData, image, backgroundColor } = e.data;
    const ctx = canvas.getContext('2d');
  
    // Draw background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw design pattern
    const designPattern = new Image();
    designPattern.src = templateData.urls.design_pattern;
    designPattern.onload = () => {
      ctx.drawImage(designPattern, 0, 0, canvas.width, canvas.height);
  
      // Draw image with mask
      if (image) {
        const mask = new Image();
        mask.src = templateData.urls.mask;
        mask.onload = () => {
          const maskCanvas = new OffscreenCanvas(templateData.image_mask.width, templateData.image_mask.height);
          const maskCtx = maskCanvas.getContext('2d');
          maskCtx.drawImage(mask, 0, 0, templateData.image_mask.width, templateData.image_mask.height);
  
          ctx.save();
          ctx.drawImage(maskCanvas, templateData.image_mask.x, templateData.image_mask.y);
          ctx.globalCompositeOperation = 'source-in';
          ctx.drawImage(image, templateData.image_mask.x, templateData.image_mask.y, templateData.image_mask.width, templateData.image_mask.height);
          ctx.restore();
  
          // Draw mask stroke
          const maskStroke = new Image();
          maskStroke.src = templateData.urls.stroke;
          maskStroke.onload = () => {
            ctx.drawImage(maskStroke, templateData.image_mask.x, templateData.image_mask.y, templateData.image_mask.width, templateData.image_mask.height);
  
            // Draw caption
            ctx.font = `${templateData.caption.font_size}px Arial`;
            ctx.fillStyle = templateData.caption.text_color;
            const words = templateData.caption.text.split(' ');
            let line = '';
            const lines = [];
            for (const word of words) {
              const testLine = line + word + ' ';
              const testWidth = ctx.measureText(testLine).width;
              if (testWidth > templateData.caption.max_characters_per_line && line.length > 0) {
                lines.push(line);
                line = word + ' ';
              } else {
                line = testLine;
              }
            }
            lines.push(line);
            let y = templateData.caption.position.y;
            for (const line of lines) {
              ctx.fillText(line, templateData.caption.position.x, y);
              y += templateData.caption.font_size + 5;
            }
  
            // Draw CTA button
            ctx.fillStyle = templateData.cta.background_color;
            const textWidth = ctx.measureText(templateData.cta.text).width;
            ctx.fillRect(templateData.cta.position.x, templateData.cta.position.y - templateData.cta.font_size, textWidth + 20, templateData.cta.font_size + 10);
            ctx.fillStyle = templateData.cta.text_color;
            ctx.fillText(templateData.cta.text, templateData.cta.position.x + 10, templateData.cta.position.y);
          };
        };
      }
    };
  };
  
  // worker.js
self.onmessage = function(e) {
    const offscreenCanvas = e.data.canvas;
    const ctx = offscreenCanvas.getContext('2d');
    // Perform drawing operations here
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  };
  