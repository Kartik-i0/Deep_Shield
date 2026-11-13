from fastapi import APIRouter, UploadFile, File, Form
from app.services.ela_service import analyze_ela
from app.services.audio_service import analyze_audio_forensics
from app.services.video_service import analyze_video_frames_metadata

router = APIRouter(prefix="/forensics", tags=["Forensics"])

@router.post("/image-ela")
async def image_ela_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    results = analyze_ela(contents)
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "forensics": results
    }

@router.post("/audio-analysis")
async def audio_analysis_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    results = analyze_audio_forensics(contents, file.filename or "audio.wav")
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "forensics": results
    }

@router.post("/video-analysis")
async def video_analysis_endpoint(
    filename: str = Form("video.mp4"),
    file_size: int = Form(1048576)
):
    results = analyze_video_frames_metadata(filename, file_size)
    return {
        "filename": filename,
        "forensics": results
    }

