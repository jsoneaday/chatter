use futures::TryStreamExt;
use actix_multipart::Field;

#[allow(unused)]
pub async fn read_string(field: &mut Field) -> Option<String> {
    let bytes = field.try_next().await;

    if let Ok(Some(bytes)) = bytes {
        let result = String::from_utf8(bytes.to_vec());
        if let Ok(val_str) = result {
            Some(val_str)
        } else {
            println!("read_string error {}", result.err().unwrap().utf8_error());
            None
        }
    } else {
        println!("read_string error {:?}", bytes.err().unwrap());
        None
    }
}

#[allow(unused)]
pub async fn read_i64(field: &mut Field) -> Option<i64> {
    let bytes = field.try_next().await;

    if let Ok(Some(bytes)) = bytes {
        let val_str = String::from_utf8_lossy(&bytes);
        Some(val_str.parse::<i64>().unwrap())
    } else {
        None
    }
}

#[allow(unused)]
pub async fn read_i32(field: &mut Field) -> Option<i32> {
    let bytes = field.try_next().await;

    if let Ok(Some(bytes)) = bytes {
        let val_str = String::from_utf8_lossy(&bytes);
        Some(val_str.parse::<i32>().unwrap())
    } else {
        None
    }
}