use gst::{prelude::*, Bin, DebugGraphDetails, Pad};
use gstreamer as gst;


fn main() {
    // Initialize GStreamer
    gst::init().unwrap();

    let uri = "https://broadcastify.cdnstream1.com/26569";

    uwu(uri);

    // let pipeline = gst::parse_launch(&format!("playbin uri={uri}")).unwrap();
}

fn uwu(uri: impl Into<String>) {
    // Initialize GStreamer
    gst::init().unwrap();

    //// Build pipeline
    let pipeline = gst::Pipeline::new(None);

    // Get the broadcastify stream from the internet
    let filesrc = gst::ElementFactory::make("playbin")
        .name("broadcastify_reader")
        .property("uri", uri.into())
        .build()
        .unwrap();
    pipeline.add_many(&[&filesrc]).unwrap();

    // By default, `playbin` will attempt to use `alsasink` as its sink. 
    // This is undesired -- we want to send PCM over UDP, so we create a bin to acheive this.
    let sinkbin = gst::Bin::new(Some("my fave sink bin"));
    filesrc.set_property("audio-sink", &sinkbin);

    // TODO: remove because the audio is already raw
    let rawaudioparse = gst::ElementFactory::make("rawaudioparse")
        .name("RAWWW AUDIOO PARSE")
        .build()
        .unwrap();
    let udp_sink = gst::ElementFactory::make("udpsink")
        .property("host", "127.0.0.1")
        .property("port", 5555)
        .build()
        .unwrap();
    sinkbin.add_many(&[&rawaudioparse, &udp_sink]).unwrap();

    let sinkbin_sinkpad =
        gst::GhostPad::with_target(Some("sink"), &rawaudioparse.static_pad("sink").unwrap())
            .unwrap();
    sinkbin.add_pad(&sinkbin_sinkpad).unwrap();
    rawaudioparse.link(&udp_sink).unwrap();
    
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
                gst::debug_bin_to_dot_file(
                    pipeline.upcast_ref::<Bin>(),
                    DebugGraphDetails::ALL,
                    "uwu.dot",
                );
            }
        }
    }

    // Stop pipeline and clean up
    pipeline.set_state(gst::State::Null).unwrap();
}
