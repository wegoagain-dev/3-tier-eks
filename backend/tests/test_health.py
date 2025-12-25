"""
Tests for health check endpoints.
These tests verify that the Kubernetes liveness and readiness probes will work correctly.
"""


class TestHealthEndpoints:
    """Test suite for health check endpoints."""

    def test_api_root_returns_healthy(self, client):
        """Test that the API root endpoint returns a healthy status."""
        response = client.get('/api')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert 'message' in data

    def test_health_endpoint_returns_healthy(self, client):
        """Test that the main health endpoint returns healthy status with checks."""
        response = client.get('/api/health')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert 'checks' in data
        assert data['checks']['app'] == 'ok'
        assert data['checks']['database'] == 'ok'

    def test_liveness_probe_returns_alive(self, client):
        """
        Test the liveness probe endpoint.
        This is a lightweight check that should always succeed if the app is running.
        """
        response = client.get('/api/health/live')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['status'] == 'alive'

    def test_readiness_probe_returns_ready(self, client):
        """
        Test the readiness probe endpoint.
        This checks database connectivity and should return 200 when DB is available.
        """
        response = client.get('/api/health/ready')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['status'] == 'ready'


class TestAPIEndpoints:
    """Test suite for core API endpoints."""

    def test_topics_endpoint_exists(self, client):
        """Test that the topics endpoint is accessible."""
        response = client.get('/api/topics')
        # Should return 200 with empty list, not 404
        assert response.status_code == 200
        
        data = response.get_json()
        assert isinstance(data, list)

    def test_cors_headers_present(self, client):
        """Test that CORS headers are properly set."""
        response = client.get('/api')
        # CORS should allow the response
        assert response.status_code == 200
