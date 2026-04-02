// TODO: Youssef Tarek — User Model
// - Fields: name (required), email (required, unique), password (required), role (enum: admin/user, default: user), timestamps
// - Pre-save hook: hash password using bcryptjs (salt rounds: 10)
// - Instance method: comparePassword(password) — compares plain text with hashed
