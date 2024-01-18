# react-image-particles
A React component that converts any image into interactive particles.

![Example](https://instagram-caption-tool.s3.amazonaws.com/demo.gif)

## Installation
Using npm:
`npm install react-image-particles`

Using yarn:
`yarn add react-image-particles`

## Usage
```javascript 
import React from 'react';
import ImageToParticle from 'react-image-particles';

const App = () => {
  return (
    <ImageToParticle
      path="path/to/image"
      width={500}
      height={500}
      numParticles={1000}
    />
  );
};

export default App;
```

## Props
The `<ImageToParticle>` component accepts the following props:
- `path` (string) *required*: Image to apply the effect to.
- `width` (number) *optional*: Width of the image canvas in pixels.
- `height` (number) *optional*: Height of the image canvas in pixels.
- `particleSize` (number) *optional*: Size of each particle in pixels.
- `numParticles` (number) *optional*: Number of particles to use. Defaults to the number of pixels in the image.

## Author
Samuel Henderson

Contributions are welcome!
Repo: https://github.com/samzi123/react-image-particles

## License
MIT