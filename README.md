Hearshot

*avoid accidentally walking into an active shooter situation!*


```mermaid
flowchart TD
  subgraph Police Scanner
    rfrx[RTL-SDR Radio Receiver];
    driver[RTL-SDR Driver];
    dsp[Liquid-DSP];
    dsp2[Babycat];
    udp_police[UDP Socket];
    
    rfrx -- USB --> driver;
    driver -- I/Q samples of FM radio --> dsp;
    dsp -- 230.4kHz raw audio samples --> dsp2;
    dsp2 -- resampled 16kHz audio --> udp_police;
  end;
  
  subgraph Broadcastify Ingestion Service
    bcast[Broadcastify];
    gst[GStreamer pipeline in Rust];
    udp_bcast[UDP Socket];
    
    bcast -- Hobbyist-maintained stream of police chatter --> gst;
    gst -- Conversion from an `application/x-icy` stream to 16xHz S16LE audio samples --> udp_bcast;
    udp_bcast --> udp_transcribe;
  end;
  
  udp_police --> udp_transcribe;
 
  
  
  subgraph a[Transcription Service];
    udp_transcribe[UDP Socket];
    whisper[OpenAI Whisper];
    claude[Claude LLM];
    firebase[Firebase];
    
    udp_transcribe -- 16kHz raw audio, 16-bit signed integer samples --> whisper;
    whisper -- transcribed audio --> claude;
    claude -- post-processed events the user should know about --> firebase;
  end;
  
  ios[iOS App];
  firebase-->ios;
```
