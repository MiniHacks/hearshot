import socket
import time
import io
from queue import Queue
from tempfile import NamedTemporaryFile
import speech_recognition as sr
import torch
import whisper
import threading

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
    model = "tiny.en"
    audio_model = whisper.load_model(model)
    last_time = time.time()
    total = b""

    while True:
        audio_data = data_queue.get()

        new_time = time.time()
        total += audio_data

        if new_time - last_time > 3:
            audio_data = sr.AudioData(total, 16_000, 2)
            wav_data = io.BytesIO(audio_data.get_wav_data())

            with open("temp.wav", "w+b") as f:
                f.write(wav_data.read())

            result = audio_model.transcribe("temp.wav", fp16=torch.cuda.is_available())
            text = result["text"].strip()
            print(text)

            last_time = new_time


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
