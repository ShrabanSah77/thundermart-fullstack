function Register() {
  return (
    <div className="page auth-page">
      <h1>Create Account</h1>

      <form className="auth-form">
        <input type="text" placeholder="First Name" />

        <input type="text" placeholder="Last Name" />

        <input type="text" placeholder="Phone Number" />

        <input type="password" placeholder="Password" />

        <input type="password" placeholder="Confirm Password" />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;
