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
    finished = [""]
    model = "small.en"
    audio_model = whisper.load_model(model)

    last_time = None
    last_sample = bytes()

    while True:
        current_time = datetime.now()
        if not data_queue.empty():
            phrase_complete = False

            if last_time and current_time - last_time > timedelta(seconds=2):
                last_sample = bytes()
                phrase_complete = True

            last_time = current_time
            while not data_queue.empty():
                data = data_queue.get()
                if data == bytes(8000):
                    continue
                last_sample += data

            audio_data = sr.AudioData(last_sample, 16_000, 2)
            wav_data = io.BytesIO(audio_data.get_wav_data())

            with open("temp.wav", "w+b") as f:
                f.write(wav_data.read())

            result = audio_model.transcribe("temp.wav", fp16=torch.cuda.is_available())
            text = result["text"].strip()
            print(f"Phrase update: {text}")

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
    data_queue = Queue()

    recv_thread = threading.Thread(target=recv_bytes, args=(data_queue,))
    transcribe_thread = threading.Thread(target=transcribe, args=(data_queue,))

    recv_thread.start()
    transcribe_thread.start()

    recv_thread.join()
    transcribe_thread.join()


if __name__ == "__main__":
    main()
