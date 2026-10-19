"""
AgroVision AI - Crop Recommendation Microservice
Feature 3 of the AgroVision AI Platform.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from .routes.crop_recommendation import crop_bp
from .routes.ai_advisor import advisor_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend integration
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register API blueprints under /api
    app.register_blueprint(crop_bp, url_prefix='/api')
    app.register_blueprint(advisor_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return jsonify({
            'project': 'AgroVision AI',
            'feature': 'AI Crop Recommendation',
            'status': 'active',
            'version': '1.0.0',
            'endpoints': {
                'recommendation': 'POST /api/crop-recommendation',
                'crops_catalog': 'GET /api/crops',
                'sample_presets': 'GET /api/sample-conditions',
                'health': 'GET /api/health'
            }
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            'success': False,
            'error': 'The requested endpoint was not found on AgroVision AI service.'
        }), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({
            'success': False,
            'error': 'An internal server error occurred while processing agricultural data.'
        }), 500

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting AgroVision AI Crop Recommendation Backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
