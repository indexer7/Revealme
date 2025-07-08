import pkgutil
import importlib
from .base import BaseConnector

connectors = {}

# Auto-discover and register all connector subclasses
for _, mod_name, _ in pkgutil.iter_modules(__path__):
    mod = importlib.import_module(f"{__name__}.{mod_name}")

# Register all subclasses of BaseConnector
for cls in BaseConnector.__subclasses__():
    connectors[cls.name] = cls() 