import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러를 기록하거나 서버로 보낼 수 있는 추가 작업을 수행합니다.
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>에러가 발생했습니다.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
