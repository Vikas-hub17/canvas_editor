// src/CanvasDrawer.js
class CanvasDrawer {
  constructor(canvas, templateData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.templateData = templateData;
    this.image = null;
  }

  drawTemplate() {
    const { ctx, canvas, templateData } = this;

    // Set canvas size
    canvas.width = 1080;
    canvas.height = 1080;

    // Draw background color
    this.drawBackgroundColor(templateData.background_color);

    // Draw design pattern
    this.loadAndDrawImage(templateData.urls.design_pattern, 0, 0);

    // Draw image mask
    this.loadAndDrawImage(templateData.urls.mask, templateData.image_mask.x, templateData.image_mask.y, 'destination-in', () => {
      // Draw mask stroke after the mask
      this.loadAndDrawImage(templateData.urls.stroke, templateData.image_mask.x, templateData.image_mask.y);
    });

    // Draw the user-selected image within the mask
    if (this.image) {
      this.drawImageWithinMask();
    }

    // Draw texts (caption and CTA)
    this.drawText(templateData.caption);
    this.drawText(templateData.cta);
  }

  drawBackgroundColor(color) {
    const { ctx, canvas } = this;
    ctx.fillStyle = color || '#0369A1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  loadAndDrawImage(url, x, y, compositeOperation = 'source-over', callback) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = `${url}?random=${Math.random()}`;
    img.onload = () => {
      this.ctx.globalCompositeOperation = compositeOperation;
      this.ctx.drawImage(img, x, y);
      this.ctx.globalCompositeOperation = 'source-over';
      if (callback) callback();
    };
  }

  drawImageWithinMask() {
    const { ctx, templateData } = this;
    const { x, y, width, height } = templateData.image_mask;

    // Draw the image
    ctx.save();
    ctx.drawImage(this.image, x, y, width, height);
    ctx.globalCompositeOperation = 'destination-in';
    this.loadAndDrawImage(templateData.urls.mask, x, y, 'destination-in', () => {
      ctx.restore();
    });
  }

  drawText({ text, position, font_size, text_color, alignment, background_color, max_characters_per_line }) {
    const { ctx } = this;
    ctx.font = `${font_size}px Arial`;
    ctx.fillStyle = text_color;
    ctx.textAlign = alignment;

    const lines = this.splitTextIntoLines(text, max_characters_per_line);
    const lineHeight = font_size * 1.2;

    lines.forEach((line, index) => {
      const y = position.y + index * lineHeight;

      if (background_color) {
        const padding = 24;
        const textMetrics = ctx.measureText(line);
        const textWidth = textMetrics.width + padding * 2;
        const textHeight = font_size + padding * 2;

        ctx.fillStyle = background_color;
        ctx.fillRect(position.x - textWidth / 2, y - textHeight / 2, textWidth, textHeight);
        ctx.fillStyle = text_color;
      }

      ctx.fillText(line, position.x, y);
    });
  }

  splitTextIntoLines(text, maxCharsPerLine) {
    if (!maxCharsPerLine) return [text];

    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    words.slice(1).forEach(word => {
      if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    lines.push(currentLine);
    return lines;
  }

  updateTemplateData(newData) {
    this.templateData = { ...this.templateData, ...newData };
    this.drawTemplate();
  }

  setImage(image) {
    this.image = image;
    this.drawTemplate();
  }
}

export default CanvasDrawer;
