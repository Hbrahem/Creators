
from flask import Flask, request, jsonify
from flask_cors import CORS ,cross_origin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import trained_models
from auth import auth_blueprint

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'
jwt = JWTManager(app)
cors = CORS(app)

app.register_blueprint(trained_models)
app.register_blueprint(auth_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
