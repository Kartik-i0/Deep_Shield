import io
import base64
import numpy as np
from PIL import Image, ImageChops, ImageEnhance

def analyze_ela(image_bytes: bytes, quality: int = 90) -> dict:
    """
    Performs Error Level Analysis (ELA) on an input image.
    Detects compression artifacts, spliced boundaries, and generative noise.
    """
    try:
        original = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Save temporary at given JPEG compression quality
        buffer = io.BytesIO()
        original.save(buffer, format="JPEG", quality=quality)
        buffer.seek(0)
        resaved = Image.open(buffer)
        
        # Calculate pixel difference
        diff = ImageChops.difference(original, resaved)
        
        # Calculate extrema to find scale factor
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        scale = 255.0 / max(1, max_diff) if max_diff > 0 else 1.0
        
        # Enhance difference to make artifacts visually discernible
        enhancer = ImageEnhance.Brightness(diff)
        enhanced_diff = enhancer.enhance(scale * 1.5)
        
        # Convert to numpy for statistical analysis
        diff_np = np.array(diff, dtype=np.float32)
        mean_err = float(np.mean(diff_np))
        std_err = float(np.std(diff_np))
        variance_err = float(np.var(diff_np))
        
        # AI/Synthetic images often have unnaturally uniform high error or specific artifact bands
        # Real camera images have varied compression according to edge density
        synthetic_indicator = min(100.0, max(0.0, (mean_err * 4.2) + (std_err * 2.1)))
        
        # Generate base64 heatmap thumbnail
        out_buf = io.BytesIO()
        enhanced_diff.thumbnail((400, 400))
        enhanced_diff.save(out_buf, format="PNG")
        out_buf.seek(0)
        heatmap_base64 = base64.b64encode(out_buf.getvalue()).decode("utf-8")
        
        return {
            "status": "success",
            "mean_error": round(mean_err, 3),
            "std_deviation": round(std_err, 3),
            "variance": round(variance_err, 3),
            "synthetic_indicator_score": round(synthetic_indicator, 1),
            "is_anomalous": mean_err > 12.0 or std_err < 2.0,
            "heatmap_preview": f"data:image/png;base64,{heatmap_base64}",
            "details": "High uniform error or anomalous edge discrepancy detected across compression blocks." if mean_err > 12.0 else "Normal compression levels consistent with authentic capture."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "synthetic_indicator_score": 50.0,
            "is_anomalous": False
        }

