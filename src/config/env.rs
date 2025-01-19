use dotenvy::dotenv;
use std::env;

struct EnvVar<'a> {
    name: &'a str,
    required: bool,
    default: Option<&'a str>,
}

impl<'a> EnvVar<'a> {
    fn new(name: &'a str, required: bool, default: Option<&'a str>) -> EnvVar<'a> {
        EnvVar {
            name,
            required,
            default,
        }
    }
}

pub fn setup() {
    dotenv().ok();

    let env: Vec<EnvVar> = vec![
        EnvVar::new("RUST_LOG", false, Some("debug,tower_http=debug")),
        EnvVar::new("API_HOST", false, Some("0.0.0.0")),
        EnvVar::new("API_PORT", false, None),
        EnvVar::new("DATABASE_URL", true, None),
        EnvVar::new("DB_TIMEOUT", false, Some("10")),
        EnvVar::new("DB_MAX_CONNECTIONS", false, Some("10")),
    ];

    for var in env.iter() {
        if let Err(e) = env::var(var.name) {
            if var.required {
                panic!("[ENV ERROR]: {} not found ({})", var.name, e);
            } else if let Some(default) = var.default {
                println!(
                    "[ENV WARNING]: {} not found, set to default: {}",
                    var.name, default
                );
                env::set_var(var.name, default);
            }
        }
    }
}
