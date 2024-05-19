export class CanvasManager {
    constructor(canvas, templateData) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.templateData = templateData;
    }
  
    draw() {
      const { ctx, templateData } = this;
      const { caption, cta, imageMask, backgroundColor, image } = templateData;
  
      // Set background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Draw the image mask
      if (image) {
        const img = new Image();
        img.src = image;
        img.onload = () => {
          ctx.drawImage(img, imageMask.x, imageMask.y, imageMask.width, imageMask.height);
          this.drawOverlay();
        };
      } else {
        this.drawOverlay();
      }
    }
  
    drawOverlay() {
      const { ctx, templateData } = this;
      const { caption, cta } = templateData;
  
      // Draw the caption text
      ctx.fillStyle = caption.textColor;
      ctx.font = `${caption.fontSize}px Arial`;
      ctx.textAlign = caption.alignment;
  
      const words = caption.text.split(' ');
      let line = '';
      const maxWidth = 31;
      let y = caption.position.y;
  
      words.forEach((word, index) => {
        const testLine = line + word + ' ';
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && index > 0) {
          ctx.fillText(line, caption.position.x, y);
          line = word + ' ';
          y += caption.fontSize;
        } else {
          line = testLine;
        }
      });
  
      ctx.fillText(line, caption.position.x, y);
  
      // Draw the CTA background and text
      const ctaWidth = ctx.measureText(cta.text).width + 48;
      const ctaHeight = 30 + 24;
  
      ctx.fillStyle = cta.backgroundColor;
      ctx.fillRect(cta.position.x - 24, cta.position.y - 30, ctaWidth, ctaHeight);
  
      ctx.fillStyle = cta.textColor;
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cta.text, cta.position.x + ctaWidth / 2 - 24, cta.position.y - 6);
    }
  }
  