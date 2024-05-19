// src/Canvas.js
import React, { Component } from 'react';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      canvas: null,
      ctx: null,
    };
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    this.setState({ canvas, ctx }, this.drawTemplate);
  }

  componentDidUpdate() {
    this.drawTemplate();
  }

  drawTemplate = () => {
    const { canvas, ctx } = this.state;
    const { templateData } = this.props;

    if (!ctx) return;

    // Set canvas size
    canvas.width = 1080;
    canvas.height = 1080;

    // Draw background color
    ctx.fillStyle = templateData.background_color || '#0369A1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw design pattern, mask, and stroke
    this.loadAndDrawImage(templateData.urls.design_pattern, 0, 0);
    this.loadAndDrawImage(templateData.urls.mask, templateData.image_mask.x, templateData.image_mask.y, 'destination-in');
    this.loadAndDrawImage(templateData.urls.stroke, templateData.image_mask.x, templateData.image_mask.y);

    // Draw caption and CTA
    this.drawText(templateData.caption);
    this.drawText(templateData.cta);
  };

  loadAndDrawImage = (url, x, y, compositeOperation) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle CORS issues
    img.src = `${url}?random=${Math.random()}`;
    img.onload = () => {
      const { ctx } = this.state;
      if (compositeOperation) {
        ctx.globalCompositeOperation = compositeOperation;
      }
      ctx.drawImage(img, x, y);
      ctx.globalCompositeOperation = 'source-over';
    };
  };

  drawText = ({ text, position, font_size = 30, text_color, alignment = 'center', background_color }) => {
    const { ctx } = this.state;
    ctx.font = `${font_size}px Arial`;
    ctx.fillStyle = text_color;
    ctx.textAlign = alignment;

    if (background_color) {
      const padding = 24;
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width + padding * 2;
      const textHeight = font_size + padding * 2;

      ctx.fillStyle = background_color;
      ctx.fillRect(position.x - textWidth / 2, position.y - textHeight / 2, textWidth, textHeight);
      ctx.fillStyle = text_color;
    }

    ctx.fillText(text, position.x, position.y);
  };

  render() {
    return (
      <canvas ref={this.canvasRef} style={{ height: 400, width: 400 }}></canvas>
    );
  }
}

export default Canvas;
