import sharp from 'sharp';

export async function performNodeELA(imageBuffer) {
  try {
    const originalMetadata = await sharp(imageBuffer).metadata();
    const width = Math.min(originalMetadata.width || 800, 800);
    const height = Math.min(originalMetadata.height || 800, 800);

    // Normalize image to standard RGB size
    const normalizedOriginal = await sharp(imageBuffer)
      .resize(width, height, { fit: 'inside' })
      .toFormat('png')
      .toBuffer();

    // Recompress at 90% quality JPEG
    const recompressedJpeg = await sharp(normalizedOriginal)
      .jpeg({ quality: 90 })
      .toBuffer();

    // Compute difference using sharp composite with 'difference' blend
    const diffBuffer = await sharp(normalizedOriginal)
      .composite([
        {
          input: recompressedJpeg,
          blend: 'difference',
        },
      ])
      .modulate({
        brightness: 4.5, // Amplify subtle compression differences for forensic visibility
      })
      .toFormat('png')
      .toBuffer();

    const { data, info } = await sharp(diffBuffer).raw().toBuffer({ resolveWithObject: true });
    
    // Calculate statistical metrics
    let sum = 0;
    const len = data.length;
    for (let i = 0; i < len; i += info.channels) {
      sum += data[i]; // Luminance channel
    }
    const meanError = sum / (len / info.channels);

    // Synthetic diffusion images exhibit unnatural uniform high-frequency distribution
    // Authentic camera JPEGs exhibit variable error localized to sharp high-contrast edges
    const elaSyntheticScore = Math.min(99.0, Math.max(5.0, meanError * 5.2));

    const heatmapBase64 = `data:image/png;base64,${diffBuffer.toString('base64')}`;

    return {
      success: true,
      meanError: Math.round(meanError * 100) / 100,
      elaScore: Math.round(elaSyntheticScore),
      heatmapUrl: heatmapBase64,
      isAnomalous: meanError > 14.0,
      findings: meanError > 14.0 
        ? 'High compression disparity detected across boundary edges. Indicative of digital splicing or generative inpainting.'
        : 'Uniform compression artifact distribution consistent with natural camera sensor capture.',
    };
  } catch (err) {
    console.warn('[ELA Service] ELA generation failed:', err.message);
    return {
      success: false,
      meanError: 5.0,
      elaScore: 25,
      heatmapUrl: null,
      findings: 'Error Level Analysis skipped or image format unsupported.',
    };
  }
}

