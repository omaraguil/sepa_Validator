from flask import Blueprint, request, jsonify, session
from utils import compare_version, montantPlusQue, montantPlusQue_tag, repeated_paiment, rep_p_tag, date_validate
from models import User, db
from utils import generate_verification_code, send_verification_email
import datetime
import secrets

api_bp = Blueprint('sepa_checker', __name__, url_prefix='/sepa_checker')


@api_bp.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    from app import bcrypt
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@api_bp.route('/change_password', methods=['POST'])
def change_password():
    email = request.json['email']
    entered_code = request.json['verification_code']
    new_password = request.json['new_password']

    from app import bcrypt

    user = User.query.filter_by(email=email).first()
    if user and user.verification_code == entered_code:
        current_time = datetime.datetime.now()
        if user.verification_expiration_time > current_time:
            hashed_password = bcrypt.generate_password_hash(new_password)
            user.password = hashed_password
            db.session.commit()
            return jsonify({"message": "Password changed successfully"}), 200
        else:
            return jsonify({"error": "Verification code has expired"}), 400

    else:
        return jsonify({"error": "Invalid verification code or user"}), 400

    # if user and user.verification_code == entered_code:
    #     # Check if the verification code is still valid
    #     current_time = datetime.datetime.now()
    #     if user.verification_expiration_time > current_time:
    #         # Update the user's password
    #         hashed_password = bcrypt.generate_password_hash(new_password)
    #         user.password = hashed_password
    #         db.session.commit()
    #         return jsonify({"message": "Password changed successfully"}), 200
    #     else:
    #         return jsonify({"error": "Verification code has expired"}), 400
    # else:
    #     return jsonify({"error": "Invalid verification code or user"}), 400


@api_bp.route('/send_verification_code', methods=['POST'])
def send_verification_code():
    email = request.json['email']
    user = User.query.filter_by(email=email).first()
    if user:
        verification_code = generate_verification_code()
        user.verification_code = verification_code
        user.verification_expiration_time = datetime.datetime.now(
        ) + datetime.timedelta(minutes=15)  # Set an expiration time
        db.session.commit()
        send_verification_email(email, verification_code)
        return jsonify({"message": "Verification code sent"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


@api_bp.route('/signup', methods=['POST'])
def signup():
    email = request.json['email']
    password = request.json['password']
    from app import bcrypt
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({'error': "Email exist deja"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })


@api_bp.route('/validate', methods=['POST'])
def validate_xml():
    if 'xmlFile' in request.files:
        xml_file = request.files['xmlFile']
        montant = request.form['montant']
        if xml_file.filename.endswith('.xml'):
            v = compare_version(xml_file)
            x = montantPlusQue(montant, xml_file)
            p = montantPlusQue_tag(montant, xml_file)
            r = repeated_paiment(xml_file)
            o = rep_p_tag(xml_file)
            date = date_validate(xml_file)
            try:
                return jsonify({'message': 'XML file validated successfully', 'version': v, 'payment_amounts': x, 'repeated_payments': o, 'warning': r, 'date': date})
            except Exception as e:
                return jsonify({'message': 'Error parsing XML file.', 'error': str(e)}), 400
        else:
            return jsonify({'message': 'Invalid file format. Only XML files are allowed.'}), 400
    else:
        return jsonify({'message': 'No file uploaded.'}), 400
