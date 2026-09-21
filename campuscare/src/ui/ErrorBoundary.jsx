import { Component } from "react";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("CampusCare boundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback || (
          <section className="card state-card">
            <h2>Something broke</h2>
            <p>The clinic desk hit an unexpected error.</p>
            <button
              type="button"
              className="btn"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </section>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
