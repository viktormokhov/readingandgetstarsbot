import os
from pathlib import Path
from aiohttp import web

# Get the absolute path to the webapp directory
WEBAPP_DIR = Path(__file__).parent.absolute()

async def handle_index(request):
    """Handler for the root path - serves index.html"""
    return web.FileResponse(WEBAPP_DIR / "index.html")

async def handle_static(request):
    """Handler for static files"""
    path = request.match_info.get('path', '')
    file_path = WEBAPP_DIR / path
    
    if file_path.exists():
        return web.FileResponse(file_path)
    else:
        return web.Response(status=404, text="File not found")

def setup_routes(app):
    """Set up the routes for the web application"""
    app.router.add_get('/', handle_index)
    app.router.add_get('/{path:.*}', handle_static)

def run_server():
    """Run the web server"""
    app = web.Application()
    setup_routes(app)
    
    # Enable CORS
    app.add_routes([
        web.options('/{tail:.*}', handle_preflight)
    ])
    
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 8080))
    
    print(f"Starting server on port {port}")
    print(f"Serving files from {WEBAPP_DIR}")
    
    web.run_app(app, port=port)

async def handle_preflight(request):
    """Handle preflight CORS requests"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',  # 24 hours
    }
    return web.Response(headers=headers)

if __name__ == '__main__':
    run_server()