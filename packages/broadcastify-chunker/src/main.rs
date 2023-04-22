use std::mem::MaybeUninit;

use gst::{prelude::*, Bin, DebugGraphDetails, Element, GhostPad, Pad};
use gstreamer as gst;

struct BroadcastifyToPcmOverUdp {
    playbin: Element,
    raw_audio_parse: Element,
    udp_sink: Element,
    sinkbin: gst::Bin,
    sinkbin_sinkpad: gst::GhostPad,
}

impl BroadcastifyToPcmOverUdp {
    fn initialize(
        this: &mut MaybeUninit<Self>,
        pipeline: &gst::Pipeline,
        broadcastify_uri: impl AsRef<str>,
        target_host: impl AsRef<str>,
        udp_port: u16,
    ) {
        // Step 1a: Create all of our elements
        let playbin = gst::ElementFactory::make("playbin")
            .name("broadcastify_reader")
            .property("uri", broadcastify_uri.as_ref())
            .build()
            .unwrap();

        let sinkbin = gst::Bin::new(Some("my fave sink bin"));
        let sinkbin_sinkpad = gst::GhostPad::new(Some("sink"), gst::PadDirection::Sink);

        let raw_audio_parse = gst::ElementFactory::make("rawaudioparse")
            .name("RAWWW AUDIOO PARSE")
            .build()
            .unwrap();
        let udp_sink = gst::ElementFactory::make("udpsink")
            .property("host", target_host.as_ref())
            .property("port", udp_port as i32)
            .build()
            .unwrap();

        // Step 1b: Put them in a place in memory where they won't cause lifetime issues
        let this = this.write(Self {
            playbin,
            raw_audio_parse,
            udp_sink,
            sinkbin,
            sinkbin_sinkpad,
        });
        let BroadcastifyToPcmOverUdp {
            playbin,
            raw_audio_parse,
            udp_sink,
            sinkbin,
            sinkbin_sinkpad,
        } = this;

        // Step 2: Hook them all up!

        // Tell the stream viewer to forward audio into our sinkbin
        pipeline.add(playbin).unwrap();
        playbin.set_property("audio-sink", sinkbin.upcast_ref::<Element>());

        // Hook up the sinkbin's sink to the innards
        sinkbin.add_many(&[raw_audio_parse, udp_sink]).unwrap();
        sinkbin_sinkpad
            .set_target(raw_audio_parse.static_pad("sink").as_ref())
            .unwrap();
        sinkbin.add_pad(sinkbin_sinkpad).unwrap();
        raw_audio_parse.link(udp_sink).unwrap();
    }
}

fn main() {
    // Initialize GStreamer
    gst::init().unwrap();

    let uri = "https://broadcastify.cdnstream1.com/26569";
    let host = "127.0.0.1";
    let port = 5555;

    // Build pipeline
    let pipeline = gst::Pipeline::new(None);

    let mut broadcastify = MaybeUninit::uninit();
    BroadcastifyToPcmOverUdp::initialize(&mut broadcastify, &pipeline, uri, host, port);

    // Start pipeline
    pipeline.set_state(gst::State::Playing).unwrap();

    println!("playing :)");

    // Wait for pipeline to finish
    let bus = pipeline.bus().unwrap();
    for msg in bus.iter_timed(gst::ClockTime::NONE) {
        match msg.view() {
            gst::MessageView::Eos(..) => break,
            gst::MessageView::Error(err) => {
                eprintln!(
                    "Error from {:?}: {}",
                    err.src().map(|e| e.path_string()),
                    err.error()
                );
                break;
            }
            _ => {
                if cfg!(debug_assertions) {
                    gst::debug_bin_to_dot_file(
                        pipeline.upcast_ref::<Bin>(),
                        DebugGraphDetails::ALL,
                        "uwu.dot",
                    );
                }
            }
        }
    }

    // Stop pipeline and clean up
    pipeline.set_state(gst::State::Null).unwrap();
}
