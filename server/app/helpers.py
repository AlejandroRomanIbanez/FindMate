from bson import ObjectId
from typing import Any, Dict


def serialize_object_id(obj: Any) -> Any:
    """
    Serializes ObjectId instances within a given object to strings.

    Args:
        obj (Any): The object to serialize.

    Returns:
        Any: The serialized object.
    """
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {k: serialize_object_id(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize_object_id(i) for i in obj]
    return obj


def to_dict(model: Any) -> Dict:
    """
    Converts a model instance to a dictionary if it has a dict() method.

    Args:
        model (Any): The model instance to convert.

    Returns:
        Dict: The dictionary representation of the model.

    Raises:
        ValueError: If the provided object does not have a dict() method.
    """
    if hasattr(model, 'dict'):
        return model.dict()
    raise ValueError("Provided object does not have a dict() method.")
