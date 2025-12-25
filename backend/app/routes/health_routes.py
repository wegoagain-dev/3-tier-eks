"""
Health check endpoints for Kubernetes liveness and readiness probes.
"""
from flask import Blueprint, jsonify
from sqlalchemy import text
from ..models import db

health_bp = Blueprint('health', __name__, url_prefix='/api')


@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    Comprehensive health check endpoint for Kubernetes probes.
    
    Returns:
        - 200 OK if app and database are healthy
        - 503 Service Unavailable if database connection fails
    """
    health_status = {
        'status': 'healthy',
        'checks': {
            'app': 'ok',
            'database': 'ok'
        }
    }
    
    # Check database connectivity
    try:
        db.session.execute(text('SELECT 1'))
        db.session.commit()
    except Exception as e:
        health_status['status'] = 'unhealthy'
        health_status['checks']['database'] = f'error: {str(e)}'
        return jsonify(health_status), 503
    
    return jsonify(health_status), 200


@health_bp.route('/health/live', methods=['GET'])
def liveness_check():
    """
    Lightweight liveness probe - checks if the app is running.
    Used by Kubernetes to determine if the container should be restarted.
    """
    return jsonify({'status': 'alive'}), 200


@health_bp.route('/health/ready', methods=['GET'])
def readiness_check():
    """
    Readiness probe - checks if the app can serve traffic.
    Used by Kubernetes to determine if the pod should receive traffic.
    """
    try:
        db.session.execute(text('SELECT 1'))
        db.session.commit()
        return jsonify({'status': 'ready'}), 200
    except Exception as e:
        return jsonify({'status': 'not ready', 'error': str(e)}), 503
