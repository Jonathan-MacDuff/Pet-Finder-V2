try:
    # For embedded version
    from . import create_app, socketio
except ImportError:
    # For standalone version
    import sys
    import os
    sys.path.insert(0, os.path.dirname(__file__))
    from __init__ import create_app, socketio

app = create_app()

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5555)