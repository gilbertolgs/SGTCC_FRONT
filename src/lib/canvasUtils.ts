/**
 * @author Valentin Hervieu
 * https://codesandbox.io/s/y09komm059?file=/src/canvasUtils.js 
 */

import type { CropArea } from "svelte-easy-crop"

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export async function getCroppedImg(imageSrc: string, pixelCrop: CropArea, rotation = 0): Promise<{ blob: Blob, imageUrl: string } | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  const maxSize = Math.max(image.width, image.height)
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea
  canvas.height = safeArea

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.translate(-safeArea / 2, -safeArea / 2)

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  )
  const data = ctx.getImageData(0, 0, safeArea, safeArea)

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  )

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        resolve({ blob: file, imageUrl });
      }
    }, 'image/png');
  });
}

export async function getRotatedImage(imageSrc: string, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const orientationChanged =
    rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270
  if (orientationChanged) {
    canvas.width = image.height
    canvas.height = image.width
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(image, -image.width / 2, -image.height / 2)

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file))
      }
    }, 'image/png')
  });
}

export function generateRandomCanvas(idProjeto: number, idCurso: number): Promise<{ blob: Blob, imageUrl: string } | null> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 16:9 aspect ratio
  const width = 1280;
  const height = 720;
  canvas.width = width;
  canvas.height = height;

  if (!ctx) {
    return Promise.resolve(null);
  }

  // Predefined soft background colors
  const softColors = ['#AFE1AF', '#ADD8E6', '#E0BBE4']; // Light green, blue, purple
  const backgroundIndex = (idProjeto + idCurso) % softColors.length;
  const backgroundColor = softColors[backgroundIndex];

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Grid color based on idProjeto and idCurso
  const gridColor = (idProjeto * idCurso) % 2 === 0 ? '#000000' : '#FFFFFF';

  // Draw grid
  const gridSize = 92;
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 5;

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        resolve({ blob: file, imageUrl });
      } else {
        resolve(null);
      }
    }, 'image/png');
  });
}