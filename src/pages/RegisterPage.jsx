function RegisterPage() {
  return (
    <section className="auth-container">
      <h2 className="text-center mb-2">Create Account</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="form-group">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            name="username"
            placeholder="Choose a username"
            type="text"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            placeholder="Create a password"
            type="password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">Verify Password</label>
          <input
            id="register-confirm-password"
            name="confirm-password"
            placeholder="Confirm your password"
            type="password"
          />
        </div>

        <button type="submit" className="btn auth-button">
          Sign Up
        </button>
      </form>
      <p className="auth-footer">This page is intentionally mocked for project 2.</p>
    </section>
  );
}

export default RegisterPage;
