function Login() {
  return (
    <div className="page auth-page">
      <h1>Login</h1>

      <form className="auth-form">
        <input type="text" placeholder="Phone Number" />

        <input type="password" placeholder="Password" />

        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? Register here.</p>
    </div>
  );
}

export default Login;
