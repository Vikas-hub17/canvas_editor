self.addEventListener('message', async (event) => {
  const { canvas, templateData, image } = event.data;
  const offscreen = canvas;

  const ctx = offscreen.getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, offscreen.width, offscreen.height);

  // Draw background color
  ctx.fillStyle = templateData.background_color;
  ctx.fillRect(0, 0, offscreen.width, offscreen.height);

  // Draw design pattern
  const designPattern = new Image();
  designPattern.src = templateData.urls.design_pattern;
  await new Promise((resolve) => designPattern.onload = resolve);
  ctx.drawImage(designPattern, 0, 0, offscreen.width, offscreen.height);

  // Draw image mask
  if (image) {
    const { x, y, width, height } = templateData.image_mask;
    ctx.drawImage(image, x, y, width, height);
  }

  // Draw mask stroke
  const maskStroke = new Image();
  maskStroke.src = templateData.urls.stroke;
  await new Promise((resolve) => maskStroke.onload = resolve);
  ctx.drawImage(maskStroke, 0, 0, offscreen.width, offscreen.height);

  // Draw caption text
  ctx.fillStyle = templateData.caption.text_color;
  ctx.font = `${templateData.caption.font_size}px sans-serif`;
  const captionText = templateData.caption.text;
  const words = captionText.split(' ');
  let line = '';
  let y = templateData.caption.position.y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > templateData.caption.max_characters_per_line && n > 0) {
      ctx.fillText(line, templateData.caption.position.x, y);
      line = words[n] + ' ';
      y += templateData.caption.font_size;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, templateData.caption.position.x, y);

  // Draw CTA button
  ctx.fillStyle = templateData.cta.background_color;
  const textWidth = ctx.measureText(templateData.cta.text).width;
  ctx.fillRect(templateData.cta.position.x, templateData.cta.position.y - templateData.cta.font_size, textWidth + 20, templateData.cta.font_size + 10);
  ctx.fillStyle = templateData.cta.text_color;
  ctx.fillText(templateData.cta.text, templateData.cta.position.x + 10, templateData.cta.position.y);
});

self.addEventListener('install', (event) => {
  console.log('Service worker installed.');
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated.');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
