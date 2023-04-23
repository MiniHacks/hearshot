import socket
from time import sleep
import io
from queue import Queue
from tempfile import NamedTemporaryFile
import speech_recognition as sr
import torch
import whisper
import threading
from datetime import datetime, timedelta

localhost = "127.0.0.1"

# This port doesn't matter, it just helps with consistency
audio_file_sender_port = 12345

# only this one does
audio_file_receiver_port = 5555


def recv_bytes(data_queue):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(("0.0.0.0", audio_file_receiver_port))

    while True:
        audio_data, address = sock.recvfrom(8000)
        data_queue.put(audio_data)


def transcribe(data_queue):
    finished = []
    model = "small.en"
    audio_model = whisper.load_model(model)

    last_time = None
    last_sample = bytes()

    while True:
        if not data_queue.empty():
            audio_data = data_queue.get()
            if audio_data == bytes(8000):
                continue

            current_time = datetime.now()
            if last_time:
                print(f"delta: {current_time - last_time}")
            last_sample += audio_data

            audio_data = sr.AudioData(last_sample, 16_000, 2)
            wav_data = io.BytesIO(audio_data.get_wav_data())

            with open("temp.wav", "w+b") as f:
                f.write(wav_data.read())

            if last_time and current_time - last_time > timedelta(seconds=1):
                result = audio_model.transcribe(
                    "temp.wav", fp16=torch.cuda.is_available()
                )
                text = result["text"].strip()
                print(f"Phrase update: {text}")

            if last_time and current_time - last_time > timedelta(seconds=3):
                print(f"Phrase complete: {text}")
                finished.append(text)
                last_sample = bytes()

            last_time = current_time
        sleep(0.25)


def main():
    data_queue = Queue()

    recv_thread = threading.Thread(target=recv_bytes, args=(data_queue,))
    transcribe_thread = threading.Thread(target=transcribe, args=(data_queue,))

    recv_thread.start()
    transcribe_thread.start()

    recv_thread.join()
    transcribe_thread.join()


if __name__ == "__main__":
    main()
