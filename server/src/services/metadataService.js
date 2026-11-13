import sharp from 'sharp';

const KNOWN_AI_GENERATOR_SIGNATURES = [
  'midjourney',
  'stable diffusion',
  'dall-e',
  'comfyui',
  'novelai',
  'civitai',
  'adobe firefly',
  'generative fill',
  'automatic1111',
  'flux.1',
  'runway',
  'sora',
  'pika',
];

export async function inspectMetadata(fileBuffer, originalFileName) {
  try {
    const metadata = await sharp(fileBuffer).metadata();
    const anomalies = [];
    let detectedSoftware = null;
    let isAITagged = false;

    // Check raw exif/icc/iptc text if present
    const rawMetaString = JSON.stringify(metadata).toLowerCase();
    for (const signature of KNOWN_AI_GENERATOR_SIGNATURES) {
      if (rawMetaString.includes(signature)) {
        isAITagged = true;
        detectedSoftware = signature.toUpperCase();
        anomalies.push(`Direct AI metadata signature found: "${signature.toUpperCase()}"`);
        break;
      }
    }

    // Check camera EXIF presence
    const hasExif = !!metadata.exif;
    const hasIcc = !!metadata.icc;
    
    if (!hasExif) {
      anomalies.push('Zero camera EXIF sensor data (no ISO, aperture, lens, or camera make/model found). Common in synthetic outputs.');
    }

    if (metadata.format === 'png' && !metadata.density) {
      anomalies.push('Standard raw synthetic PNG profile with stripped color space profile.');
    }

    return {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      channels: metadata.channels,
      hasExif,
      hasIcc,
      isAITagged,
      detectedSoftware: detectedSoftware || (hasExif ? 'Camera Raw / Authenticated Hardware' : 'Unspecified Digital Rendering'),
      anomalies,
      metadataIntegrityScore: isAITagged ? 10 : (hasExif ? 95 : 60),
    };
  } catch (err) {
    return {
      format: 'unknown',
      hasExif: false,
      detectedSoftware: 'Unknown',
      anomalies: ['Unable to parse EXIF metadata container.'],
      metadataIntegrityScore: 50,
    };
  }
}

