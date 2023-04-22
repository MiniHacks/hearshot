use std::io::Write;

fn main() {
    let (mut ctl, mut reader) = rtlsdr_mt::open(0).unwrap();

    let mut file = std::fs::File::create("out.iq").unwrap();

    ctl.enable_agc().unwrap();
    ctl.set_ppm(0).unwrap();
    ctl.set_center_freq(92_143_000).unwrap();
    ctl.set_bandwidth(200_000).unwrap();

    reader
        .read_async(4, 32768, |bytes| {
            let float_iq = bytes.chunks(2).map(|iq| {
                let to_float = |x| ((x as f32) / 127.5_f32) - 1.0;
                let (i, q) = (iq[0], iq[1]);
                [
                    to_float(i),
                    to_float(q)
                ]
            }).collect::<Vec<_>>();
            let byte_slice = {
                let num_bytes = float_iq.len() * core::mem::size_of::<[f32; 2]>();
                let start_ptr = float_iq.as_ptr().cast::<u8>();
                
                unsafe { core::slice::from_raw_parts(start_ptr, num_bytes) }
            };
            file.write_all(byte_slice).unwrap();
        })
        .unwrap();
}
