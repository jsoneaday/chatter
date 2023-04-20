use sqlx::{Pool, Postgres};

#[derive(Clone)]
pub struct AppState {
    pub client: reqwest::Client,
    pub conn: Pool<Postgres>
}