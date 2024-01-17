# react-image-particles
A React component that converts any image into interactive particles.

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
    />
  );
};

export default App;
```

## Props
The `<ImageToParticle>` component accepts the following props:
- `path` (string) *required*: The image to apply the effect to.
- `width` (number) *optional*: The width of the image canvas in pixels.
- `height` (number) *optional*: The height of the image canvas in pixels.
- `particleSize` (number) *optional*: The size of the particles in pixels.
- `numParticles` (number) *optional*: The number of particles to use. Defaults to the number of pixels in the image.

## Author
Samuel Henderson

Contributions are welcome!
GitHub repo: ...

## License
MIT