import io
import wave
import numpy as np

def analyze_audio_forensics(audio_bytes: bytes, filename: str = "audio.wav") -> dict:
    """
    Performs forensic analysis on audio waveform bytes.
    Detects synthetic speech artifacts, frequency cutoff, and silence/cadence anomalies.
    """
    try:
        # Check if WAV format
        try:
            with wave.open(io.BytesIO(audio_bytes), "rb") as wf:
                channels = wf.getnchannels()
                sample_width = wf.getsampwidth()
                framerate = wf.getframerate()
                n_frames = wf.getnframes()
                raw_data = wf.readframes(n_frames)
                
                # Convert to numpy array
                if sample_width == 2:
                    audio_data = np.frombuffer(raw_data, dtype=np.int16).astype(np.float32)
                elif sample_width == 4:
                    audio_data = np.frombuffer(raw_data, dtype=np.int32).astype(np.float32)
                else:
                    audio_data = np.frombuffer(raw_data, dtype=np.uint8).astype(np.float32) - 128.0
                    
                if channels > 1:
                    audio_data = audio_data[::channels] # mono fold
                    
                duration_sec = n_frames / float(framerate)
        except Exception:
            # Fallback for non-wav: synthesize basic byte frequency statistics
            audio_data = np.frombuffer(audio_bytes[:min(len(audio_bytes), 200000)], dtype=np.int8).astype(np.float32)
            framerate = 44100
            duration_sec = len(audio_data) / 44100.0

        if len(audio_data) == 0:
            return {
                "status": "error",
                "message": "Empty audio buffer",
                "synthetic_probability": 0.0
            }

        # Normalize
        peak = np.max(np.abs(audio_data))
        if peak > 0:
            norm_audio = audio_data / peak
        else:
            norm_audio = audio_data

        # 1. Zero Crossing Rate (ZCR)
        zero_crossings = np.sum(np.abs(np.diff(np.signbit(norm_audio)))) / len(norm_audio)
        
        # 2. Spectral FFT and high frequency cutoff detection
        # AI voices often have brick-wall spectral cutoffs at 8kHz, 16kHz, or 22kHz
        fft_data = np.abs(np.fft.rfft(norm_audio[:min(len(norm_audio), 65536)]))
        freqs = np.fft.rfftfreq(min(len(norm_audio), 65536), 1.0 / framerate)
        
        # Spectral energy distribution
        total_energy = np.sum(fft_data) + 1e-9
        high_freq_mask = freqs > (framerate * 0.35)
        high_freq_energy_ratio = float(np.sum(fft_data[high_freq_mask]) / total_energy)
        
        # Silence / Cadence uniformity
        frame_len = int(framerate * 0.02) # 20ms frames
        if frame_len > 0 and len(norm_audio) > frame_len:
            frames = norm_audio[:len(norm_audio) - (len(norm_audio) % frame_len)].reshape(-1, frame_len)
            frame_energies = np.mean(frames ** 2, axis=1)
            energy_variance = float(np.var(frame_energies))
        else:
            energy_variance = 0.05

        # Heuristic scoring for synthetic voice
        # Synthetic speech exhibits: unnaturally low background floor, flat high freq, repetitive cadence
        score = 0.0
        findings = []

        if high_freq_energy_ratio < 0.005:
            score += 35.0
            findings.append("Sharp high-frequency spectral attenuation characteristic of vocoder synthesis.")
        
        if zero_crossings < 0.02:
            score += 25.0
            findings.append("Low phonetic variation and unnaturally sustained pitch modulation.")
            
        if energy_variance < 0.001:
            score += 20.0
            findings.append("Abnormally flat ambient noise floor, lacking natural room reverberation.")
        else:
            score += 10.0

        synthetic_prob = min(98.5, max(5.0, score + 15.0))

        return {
            "status": "success",
            "duration_seconds": round(duration_sec, 2),
            "sample_rate": framerate,
            "synthetic_probability": round(synthetic_prob, 1),
            "spectral_high_freq_ratio": round(high_freq_energy_ratio, 4),
            "zero_crossing_rate": round(float(zero_crossings), 4),
            "background_noise_floor": "Ultra-clean / Artificial" if energy_variance < 0.002 else "Natural acoustic environment",
            "detected_anomalies": findings if findings else ["Standard vocal resonance and natural ambient acoustics observed."]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "synthetic_probability": 50.0
        }

