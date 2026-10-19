"""
Validation utilities for AgroVision AI Crop Recommendation inputs.
Provides friendly, farmer-understandable validation error messages.
"""

def validate_crop_inputs(data):
    """
    Validates the 7 core agricultural and weather parameters.
    Returns (cleaned_dict, error_message_or_None)
    """
    if not isinstance(data, dict):
        return None, "Invalid request format. Expected JSON data."

    required_fields = {
        'N': {
            'label': 'Nitrogen (N)',
            'min': 0.0,
            'max': 300.0,
            'unit': 'kg/ha',
            'help': 'Typical values range between 0 and 200 kg/ha.'
        },
        'P': {
            'label': 'Phosphorus (P)',
            'min': 0.0,
            'max': 200.0,
            'unit': 'kg/ha',
            'help': 'Typical values range between 0 and 150 kg/ha.'
        },
        'K': {
            'label': 'Potassium (K)',
            'min': 0.0,
            'max': 300.0,
            'unit': 'kg/ha',
            'help': 'Typical values range between 0 and 200 kg/ha.'
        },
        'temperature': {
            'label': 'Temperature',
            'min': 0.0,
            'max': 55.0,
            'unit': '°C',
            'help': 'Typical values range between 10°C and 45°C.'
        },
        'humidity': {
            'label': 'Humidity',
            'min': 5.0,
            'max': 100.0,
            'unit': '%',
            'help': 'Relative humidity must be between 5% and 100%.'
        },
        'ph': {
            'label': 'Soil pH',
            'min': 3.5,
            'max': 10.0,
            'unit': 'pH',
            'help': 'Soil pH usually ranges between 4.5 (acidic) and 8.5 (alkaline).'
        },
        'rainfall': {
            'label': 'Rainfall',
            'min': 0.0,
            'max': 600.0,
            'unit': 'mm',
            'help': 'Typical rainfall values range between 20 mm and 400 mm.'
        }
    }

    cleaned = {}

    for field, rule in required_fields.items():
        val = data.get(field)
        if val is None or str(val).strip() == '':
            return None, f"Please enter a value for {rule['label']}."

        try:
            num = float(val)
        except (ValueError, TypeError):
            return None, f"Please enter a valid numeric value for {rule['label']}."

        if num < rule['min']:
            return None, f"{rule['label']} cannot be less than {rule['min']} {rule['unit']}. {rule['help']}"

        if num > rule['max']:
            return None, f"{rule['label']} cannot exceed {rule['max']} {rule['unit']}. {rule['help']}"

        cleaned[field] = num

    # Optional fields (retained safely without interfering with ML pipeline)
    optional_fields = ['location', 'state', 'district', 'season', 'farm_size', 'farm_size_unit']
    cleaned_optional = {}
    for opt in optional_fields:
        raw_val = data.get(opt)
        if raw_val is not None:
            cleaned_optional[opt] = str(raw_val).strip()
        else:
            cleaned_optional[opt] = ""

    cleaned['farm_meta'] = cleaned_optional

    return cleaned, None
