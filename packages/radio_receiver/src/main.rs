use std::io::Write;
use std::net::{Ipv4Addr, UdpSocket};
use std::sync::mpsc::channel;

fn main() {
    let mut raw_samples_socket = (|| {
        let mut sock = UdpSocket::bind("10.42.0.1:5678")?;
        sock.set_broadcast(true)?;
        sock.connect((Ipv4Addr::BROADCAST, 5678))?;
        Ok::<_, std::io::Error>(sock)
    })()
    .expect("Could not set up UDP socket :(");

    let (mut ctl, mut reader) = rtlsdr_mt::open(0).unwrap();

    // let mut file = std::fs::File::create("out.raw").unwrap();

    let mut gains = [0_i32; 32];
    println!(
        "Existing settings! 
        - Center  freq: {:?}
        - sample rate: {:?}
        - ppm: {:?}
        - tuner gains: {:?}",
        ctl.center_freq(),
        ctl.sample_rate(),
        ctl.ppm(),
        ctl.tuner_gains(&mut gains),
    );

    let (byte_tx, byte_rx) = channel();

    ctl.enable_agc().unwrap();
    ctl.set_ppm(0).unwrap();
    // Frequency
    ctl.set_center_freq(92_143_000).unwrap();
    // How wide of a bandwidth are we doing?
    ctl.set_bandwidth(100_000).unwrap();
    ctl.set_sample_rate(230_400).unwrap();

    println!(
        "New settings! 
        - Center  freq: {:?}
        - sample rate: {:?}
        - ppm: {:?}
        - tuner gains: {:?}",
        ctl.center_freq(),
        ctl.sample_rate(),
        ctl.ppm(),
        ctl.tuner_gains(&mut gains),
    );

    let t1 = std::thread::spawn(move || loop {
        let mut x = Vec::new();

        for _ in 0..100 {
            let audio_floats: Vec<f32> = byte_rx.recv().unwrap();
            x.push(audio_floats);
        }

        for audio_floats in x {
            let send_buf = {
                let num_bytes = audio_floats.len() * core::mem::size_of::<f32>();
                let data_ptr = audio_floats.as_ptr().cast::<u8>();
                unsafe { core::slice::from_raw_parts(data_ptr, num_bytes) }
            };
            let part_len = send_buf.len() / 2;
            if let Some(e) = raw_samples_socket
                .send(&send_buf[0..part_len])
                .and(raw_samples_socket.send(&send_buf[part_len..]))
                .err()
            {
                eprintln!("send error: {e:?}");
            }
        }
    });

    let t2 = std::thread::spawn(move || {
        reader
            .read_async(32, 32768, |bytes| {
                let mut iq_floats = bytes
                    .chunks(2)
                    .map(|iq| {
                        let to_float = |x| ((x as f32) / 127.5_f32) - 1.0;
                        let (i, q) = (iq[0], iq[1]);
                        demodulation::IQSample::new(to_float(i), to_float(q))
                    })
                    .collect::<Vec<_>>();

                let audio_floats = demodulation::demodulate(
                    &mut iq_floats,
                    demodulation::FMRadioConfig {
                        bandwidth: 100_000,
                        samplerate: 230_400,
                        deviation: 75_000,
                    },
                );

                byte_tx.send(audio_floats).unwrap();
            })
            .unwrap()
    });

    t1.join();
    t2.join();
}

mod demodulation {
    use liquid_dsp::firfilt;
    use liquid_dsp::freqdem;
    use liquid_dsp::msresamp;
    use num::complex::Complex32;

    pub type IQSample = Complex32;

    #[derive(Clone, Copy)]
    pub struct FMRadioConfig {
        pub bandwidth: u32,
        pub samplerate: u32,
        pub deviation: u32,
    }

    pub fn demodulate(samples: &mut [IQSample], config: FMRadioConfig) -> Vec<f32> {
        // Configure filter with info about the FM radio parameters
        let FMRadioConfig {
            bandwidth,
            samplerate,
            deviation,
        } = config;
        let filter_len = 64;
        let filter_cutoff_freq = bandwidth as f32 / samplerate as f32;
        let filter_attenuation = 70.0f32;

        let filter = firfilt::FirFilterCrcf::kaiser(
            filter_len,
            filter_cutoff_freq,
            filter_attenuation,
            0.0f32,
        );
        filter.set_scale(2.0f32 * filter_cutoff_freq);

        // Set up resampler to resample to 44.1kHz, which is standard for audio
        const DESIRED_SAMPLE_RATE: u32 = 44_100;
        // let resampler_rate = DESIRED_SAMPLE_RATE / samplerate as f32;
        // let resampler = msresamp::MsresampCrcf::new(resampler_rate, filter_attenuation);

        // Set up FM demodulator
        let modulation_factor = deviation as f32 / samplerate as f32;
        let fm_demod = freqdem::Freqdem::new(modulation_factor);

        /////
        // Actually do the demodulation + resampling!
        /////
        let raw_audio = fm_demod.demodulate_block(samples);
        raw_audio
        // let raw_audio = babycat::Waveform::new(samplerate, 1, raw_audio);
        // let resampled_audio = raw_audio.resample(DESIRED_SAMPLE_RATE).unwrap();
        // resampled_audio.into()
    }
}
