from typing import List
import socket
import os
from time import sleep
import io
from queue import Queue
from tempfile import NamedTemporaryFile
import speech_recognition as sr
import torch
import whisper
import threading
from datetime import datetime, timedelta
from transcribe import transcribe

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
(get_speech_timestamps, save_audio, read_audio, VADIterator, collect_chunks) = utils

# This port doesn't matter, it just helps with consistency
audio_file_sender_port = 12345

# only this one does
audio_file_receiver_port = 5555


def receive_packets(data_queue):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(("0.0.0.0", audio_file_receiver_port))

    while True:
        audio_data, address = sock.recvfrom(8000)
        data_queue.put(audio_data)


def transcribe_packets(data_queue: Queue[bytes]):
    finished: list[str] = [""]
    temp_file: str = NamedTemporaryFile().name

    last_time = None
    last_sample = bytes()

    while True:
        current_time: datetime = datetime.now()
        if not data_queue.empty():
            phrase_complete = False

            if last_time and current_time - last_time > timedelta(seconds=2):
                last_sample = bytes()
                phrase_complete = True

            last_time = current_time
            while not data_queue.empty():
                data = data_queue.get()

                data_as_wav: sr.AudioData = sr.AudioData(
                    data, SAMPLE_RATE, SAMPLE_WIDTH
                )
                wav_data: io.BytesIO = io.BytesIO(data_as_wav.get_wav_data())

                # Use Silero VAD to skip segments without voice
                wav: torch.Tensor = read_audio(wav_data, sampling_rate=SAMPLE_RATE)
                print(wav.shape)
                import pdb

                pdb.set_trace()

                speech_probs: List[float] = []
                window_size_samples = 512
                new_wav = []
                for i in range(0, len(wav), window_size_samples):
                    chunk: torch.Tensor = wav[i : i + window_size_samples]
                    if len(chunk) < window_size_samples:
                        break
                    speech_prob = silero_model(chunk, SAMPLE_RATE).item()
                    speech_probs.append(speech_prob)
                    if speech_prob > 0.5:
                        new_wav.append(chunk)
                silero_model.reset_states()

                last_sample += data

            audio_data = sr.AudioData(last_sample, SAMPLE_RATE, SAMPLE_WIDTH)
            wav_data = io.BytesIO(audio_data.get_wav_data())

            with open(temp_file, "w+b") as f:
                f.write(wav_data.read())

            result = transcribe(temp_file)

            assert type(result["text"]) == str
            text = result["text"].strip()

            if phrase_complete:
                finished.append(text)
            else:
                finished[-1] = text

            os.system("cls" if os.name == "nt" else "clear")
            for line in finished:
                print(line)
            print("", end="", flush=True)

        sleep(0.25)


def main():
    data_queue: Queue[bytes] = Queue()

    recv_thread = threading.Thread(target=receive_packets, args=(data_queue,))
    transcribe_thread = threading.Thread(target=transcribe_packets, args=(data_queue,))

    recv_thread.start()
    transcribe_thread.start()

    recv_thread.join()
    transcribe_thread.join()


if __name__ == "__main__":
    main()
