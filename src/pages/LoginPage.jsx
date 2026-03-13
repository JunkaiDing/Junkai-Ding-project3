function LoginPage() {
  return (
    <section className="auth-container">
      <h2 className="text-center mb-2">Welcome Back</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            name="username"
            placeholder="Enter your username"
            type="text"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
        </div>

        <button type="submit" className="btn auth-button">
          Log In
        </button>
      </form>
      <p className="auth-footer">This page is intentionally mocked for project 2.</p>
    </section>
  );
}

export default LoginPage;
