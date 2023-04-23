import socket
import time
import sys
import speech_recognition as sr
import whisper
import io
import torch
from tempfile import NamedTemporaryFile


localhost = "127.0.0.1"

# This port doesn't matter, it just helps with consistency
audio_file_sender_port = 12345

# only this one does
audio_file_receiver_port = 5555


def recv_bytes(filename):
    # Create a UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # Bind the socket to a local address and port
    sock.bind(("0.0.0.0", audio_file_receiver_port))
    temp_file = NamedTemporaryFile().name

    model = "tiny.en"
    audio_model = whisper.load_model(model)

    yeet = None

    last_time = time.time()
    total = b""
    while True:
        audio_data, address = sock.recvfrom(1024)
        new_time = time.time()
        if new_time - last_time > 3:
            break

        total += audio_data

        if audio_data is not None:
            last_time = new_time

    print(f"we done {len(total)!r}")
    audio_data = sr.AudioData(total, 16_000, 2)
    print(len(total))
    wav_data = io.BytesIO(audio_data.get_wav_data())

    # Write wav data to the temporary file as bytes.
    with open("yo.wav", "w+b") as f:
        f.write(wav_data.read())

    # Read the transcription.
    result = audio_model.transcribe("yo.wav", fp16=torch.cuda.is_available())
    text = result["text"].strip()
    print(text)
    print("done")


def send_bytes(filename: str):
    # Create a UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(("0.0.0.0", audio_file_sender_port))

    # There are this many samples in a second. This lets us know how much to delay so that we send the audio in real time.
    sample_rate_hz = 16_000

    # Open the file for reading in binary mode
    with open(filename, "rb") as f:
        # Read the entire file into memory
        data = f.read()

        bytes_sent = 0
        while bytes_sent < len(data):
            # UDP sockets have a maximum size, but IP fragmentation will help increase the limit
            # to some extent
            num_bytes_to_send = min(8000, len(data) - bytes_sent)
            # Send the data over the socket
            sock.sendto(
                data[bytes_sent : bytes_sent + num_bytes_to_send],
                (localhost, audio_file_receiver_port),
            )
            bytes_sent += num_bytes_to_send

            print(
                f"Sent {num_bytes_to_send} bytes to {localhost}:{audio_file_receiver_port}"
            )

            # Assuming that we have 2-byte samples (signed 16-bit integer, little endian), figure out a realistic amount of time to wait
            num_samples = num_bytes_to_send / 2
            seconds_to_wait = num_samples / sample_rate_hz
            print(f"Waiting {seconds_to_wait} seconds")
            time.sleep(seconds_to_wait)


def main():
    match sys.argv:
        case [_, "send", filename]:
            send_bytes(filename)
        case [_, "recv", filename]:
            recv_bytes(filename)
        case _:
            raise LookupError(
                "Sasha needs to look at the `main` and pass the correct arguments to run this test script"
            )


if __name__ == "__main__":
    main()
