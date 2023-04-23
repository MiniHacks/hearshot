import socket
from models import Alert
from copy import deepcopy
import os
from time import sleep, time
import io
from queue import Queue
from tempfile import NamedTemporaryFile
import speech_recognition as sr
import torch
import soundfile as sf
import threading
from transcribe import transcribe
from pathlib import Path
import openai

from firebase_admin import credentials, firestore, initialize_app
from dotenv import load_dotenv
from models import TranscriptSection

ENV_PATH = Path(__file__).parent.parent.parent.absolute().joinpath(".env")

load_dotenv(dotenv_path=ENV_PATH)

openai.api_key = os.environ.get("OPENAI_API_KEY")


localhost = "127.0.0.1"
SAMPLE_RATE = 16_000
SAMPLE_WIDTH = 2

USE_ONNX = True
silero_model, utils = torch.hub.load(
    repo_or_dir="snakers4/silero-vad",
    model="silero_vad",
    force_reload=False,
    onnx=USE_ONNX,
)
(get_speech_timestamps, _, _, VADIterator, collect_chunks) = utils

# credentias w service account JSON
cred = credentials.Certificate("google_creds.json")

initialize_app(cred)

db = firestore.client()

# This port doesn't matter, it just helps with consistency
audio_file_sender_port = 12345

# only this one does
audio_file_receiver_port = 5555


def read_audio(file, sampling_rate: int = SAMPLE_RATE) -> torch.Tensor:
    file.seek(0)
    audio, _ = sf.read(file, dtype="float32")
    # reshape to (n,)
    return torch.from_numpy(audio).view(-1)


def receive_packets(data_queue):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(("0.0.0.0", audio_file_receiver_port))

    while True:
        audio_data, address = sock.recvfrom(8000)
        data_queue.put(audio_data)


def transcribe_packets(
    data_queue: Queue[bytes], transcript_queue: Queue[TranscriptSection]
):
    curr_section = TranscriptSection(content="", start=None, end=None)
    finished: list[TranscriptSection] = [curr_section]
    temp_file: str = NamedTemporaryFile().name

    last_time = None
    last_sample = bytes()

    while True:
        current_time: float = time()
        if not data_queue.empty():
            phrase_complete = False
            if not curr_section.start:
                curr_section.start = current_time

            if last_time and current_time - last_time > 2:
                last_sample = bytes()
                phrase_complete = True

            last_time = current_time
            while not data_queue.empty():
                data: bytes = data_queue.get()

                audio_data: sr.AudioData = sr.AudioData(data, SAMPLE_RATE, SAMPLE_WIDTH)
                wav_data: io.BytesIO = io.BytesIO(audio_data.get_wav_data())

                # Use Silero VAD to skip segments without voice
                wav: torch.Tensor = read_audio(wav_data, sampling_rate=SAMPLE_RATE)
                # assert wav.shape == (4000,)

                window_size_samples = 512
                speech_probs_and_chunks = [
                    (silero_model(chunk, SAMPLE_RATE).item(), chunk)
                    for chunk in (
                        wav[i : i + window_size_samples]
                        for i in range(0, len(wav), window_size_samples)
                    )
                    if len(chunk) == window_size_samples
                ]
                silero_model.reset_states()

                speech_probs = [prob for prob, _ in speech_probs_and_chunks]
                if max(speech_probs) < 0.3:
                    continue

                last_sample += data

            audio_data = sr.AudioData(last_sample, SAMPLE_RATE, SAMPLE_WIDTH)
            wav_data = io.BytesIO(audio_data.get_wav_data())

            with open(temp_file, "w+b") as f:
                f.write(wav_data.read())

            result = transcribe(temp_file)

            assert type(result["text"]) == str
            text = result["text"].strip()

            if phrase_complete:
                if not text.strip():
                    continue
                curr_section.content = text
                curr_section.end = current_time
                finished[-1] = curr_section
                transcript_queue.put(curr_section)
                curr_section = TranscriptSection(content="", start=None, end=None)
                finished.append(curr_section)
                last_time = None
            else:
                curr_section.content = text
                curr_section.end = current_time
                finished[-1] = curr_section

            os.system("cls" if os.name == "nt" else "clear")
            for line in finished:
                print(f"{line.content} ({line.start} - {line.end})")
            print("", end="", flush=True)

        sleep(0.25)


def upsert_alert(alert: Alert):
    time, doc = db.collection("alerts").add(
        {
            "label": alert.label,
            "date": alert.date,
            "severity": alert.severity.value,
            "address": alert.address,
            "raw_address": alert.raw_address,
            "name": alert.name,
            "coord": alert.coord,
        }
    )


def process_events(transcript_queue: Queue[TranscriptSection]):
    context = ""
    while True:
        if not transcript_queue.empty():
            while transcript_queue:
                item = deepcopy(transcript_queue.get())
                new_section = {
                    "content": item.content,
                    "start": item.start,
                    "end": item.end,
                }

                # Add the new section to the existing Firebase object
                transcription_ref = db.collection("transcriptions").document("lapd")
                transcription = transcription_ref.get()
                sections = transcription.get("sections")
                sections.append(new_section)

                # Update the document with the new sections array
                transcription_ref.update({"sections": sections})

                print(f"Processing {item}")
        sleep(0.25)
    """
    { alerts: [{
        id: “1”
        severity: “medium”,    name: “Aggravated Assault at Pioneer Hall”
        coord: [44.9704, 93.2290]
        address: “615 Fulton St SE, Minneapolis, MN 55455”    date: Tue April 23 2023 18:50:21 GMT-0500
        summary: “Victim was outside, walking down Fulton
                St Se when a male suspect fired a BB gun
                from a 3rd story window at Pioneer Hall.
                Victim was struck face.”
        }, {
        id: “2”
        severity: “fire”,    name: “Fire at Pauley Pavilion”
        coord: [34.070313,-118.446938]
        address: “301 Westwood Plaza, Los Angeles, CA 90095”    date: Tue April 23 2023 23:13:43 GMT-0500
        summary: “Random turkeys appeared on campus and started
                setting everything on fire.”
        }, {
        id: “3”
        severity: “high”,    name: “Shooting at XYZ”
        coord: [21.312, 74.232]
        address: “Kenneth H. Keller Hall, 200 Union St SE,
                Minneapolis, MN 55455”    date: Tue April 24 2023 19:30:10 GMT-0500
        summary: “Shooting reported at XYZ. 2 Injured, suspect
                wearing black vest.”
        }]
    }
    """


def main():
    packet_queue: Queue[bytes] = Queue()
    transcript_queue: Queue[str] = Queue()

    recv_thread = threading.Thread(target=receive_packets, args=(packet_queue,))
    transcribe_thread = threading.Thread(
        target=transcribe_packets, args=(packet_queue, transcript_queue)
    )
    event_thread = threading.Thread(target=process_events, args=(transcript_queue,))

    recv_thread.start()
    transcribe_thread.start()
    event_thread.start()

    recv_thread.join()
    transcribe_thread.join()
    event_thread.join()


if __name__ == "__main__":
    main()
